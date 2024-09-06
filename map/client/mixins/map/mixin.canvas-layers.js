import _ from 'lodash'
import { CanvasDrawContext } from '../../canvas-draw-context.js'
import { bindLeafletEvents } from '../../utils.map.js'
import L from 'leaflet'

// Helper function to forward events when click through is enabled
// on canvas layers
function forwardEventBehindPane (e, pane) {
  // backup original event target and display mode
  const removed = { node: e.target, display: e.target.style.display }
  // make event target hidden
  removed.node.style.display = 'none'
  // query element at position now that our canvas is hidden
  const target = document.elementFromPoint(e.clientX, e.clientY)

  if (target && target !== pane) {
    // synthetize a new event on the element
    const ev = new MouseEvent(e.type, e)
    const stopped = !target.dispatchEvent(ev)
    if (stopped || ev._stopped) L.DomEvent.stop(e)
  }

  // restore display mode on original event target
  removed.node.style.display = removed.display
}

L.KanvasLayer = (L.Layer ? L.Layer : L.Class).extend({
  // -- initialized is called on prototype
  initialize: function (options) {
    this._map = null
    this._canvas = null
    this._frame = null
    this._delegate = null
    L.setOptions(this, options)

    this.clickableFeatures = []
    this.mousePosition = null
    this.highlighting = false
    this.autoRedraw = false

    if (options.tooltip) {
      this._tooltip = L.tooltip({})
      this._tooltipContent = ''
      // html | property | template
      if (options.tooltip.html) {
        this._getTooltipContent = (feature) => { return options.tooltip.html }
      } else if (options.tooltip.property) {
        this._getTooltipContent = (feature) => {
          const val = _.get(feature, options.tooltip.property)
          return `${val}`
        }
      } else if (options.tooltip.template) {
        const compiler = _.template(options.tooltip.template)
        this._getTooltipContent = (feature) => {
          return compiler({ feature, properties: feature.properties })
        }
      }
    }
  },

  delegate: function (del) {
    this._delegate = del
  },

  setAutoRedraw: function (enable) {
    this.autoRedraw = enable
    if (enable && this._frame === null) this.needRedraw()
  },

  needRedraw: function () {
    if (this._frame !== null || this._canvas === null) return
    this._frame = L.Util.requestAnimFrame(this.drawLayer, this)
  },

  redrawNow: function () {
    const frame = this._frame
    const autoRedraw = this.autoRedraw
    this.autoRedraw = false
    this.drawLayer()
    this._frame = frame
    this.autoRedraw = autoRedraw
  },

  latLonToCanvas: function (coords) {
    const a = this._map.latLngToLayerPoint(L.latLng(coords.lat, coords.lon))
    const b = L.DomUtil.getPosition(this._canvas)
    return a.subtract(b)
  },

  clearClickableFeatures: function () {
    this.clickableFeatures.length = 0
  },

  addClickableFeature: function (feature, clickablePath, { clickableStrokeWidth = 0, highlightPath = undefined, highlightAsStroke = false, highlightStyle = {} }) {
    this.clickableFeatures.push({
      feature,
      click: { path: clickablePath, strokeWidth: clickableStrokeWidth }
    })
    if (highlightPath) {
      this.clickableFeatures[this.clickableFeatures.length - 1].highlight = {
        path: highlightPath,
        asStroke: highlightAsStroke,
        style: highlightStyle
      }
    }
  },

  hasClickableFeaturesAt: function (latlng) {
    if (!latlng || this.clickableFeatures.length === 0) return false

    const pt = this.latLonToCanvas({ lat: latlng.lat, lon: latlng.lng })
    const ctx = this._canvas.getContext('2d')
    let inFeature = false
    for (const feature of this.clickableFeatures) {
      ctx.save()
      if (feature.click.strokeWidth) {
        ctx.lineWidth = feature.click.strokeWidth
        inFeature = ctx.isPointInStroke(feature.click.path, pt.x, pt.y)
      } else {
        inFeature = ctx.isPointInPath(feature.click.path, pt.x, pt.y)
      }
      ctx.restore()
      if (inFeature) return true
    }
    return false
  },

  getClickableFeaturesAt: function (latlng) {
    if (!latlng || this.clickableFeatures.length === 0) return []

    const pt = this.latLonToCanvas({ lat: latlng.lat, lon: latlng.lng })

    const indexes = []
    const ctx = this._canvas.getContext('2d')
    this.clickableFeatures.forEach((feature, index) => {
      ctx.save()
      if (feature.click.strokeWidth) {
        ctx.lineWidth = feature.click.strokeWidth
        if (ctx.isPointInStroke(feature.click.path, pt.x, pt.y)) indexes.push(index)
      } else {
        if (ctx.isPointInPath(feature.click.path, pt.x, pt.y)) indexes.push(index)
      }
      ctx.restore()
    })
    return indexes
  },

  // -------------------------------------------------------------
  _onLayerDidResize: function (resizeEvent) {
    this._canvas.width = resizeEvent.newSize.x
    this._canvas.height = resizeEvent.newSize.y
  },
  // -------------------------------------------------------------
  _onLayerDidMove: function () {
    const topLeft = this._map.containerPointToLayerPoint([0, 0])
    L.DomUtil.setPosition(this._canvas, topLeft)
    this.redrawNow()
  },
  // -------------------------------------------------------------
  _onLayerClick: function (event) {
    if (event.originalEvent.target !== this._canvas) return

    const indexes = this.getClickableFeaturesAt(event.latlng)
    if (indexes.length) {
      this.fire('click', Object.assign({}, event, { feature: this.clickableFeatures[indexes[0]].feature }))
    } else if (this.options.clickThroughEnabled) {
      // let click pass through our canvas when there's no hit
      const pane = this.options.pane ? this._map._panes[this.options.pane] : this._map._panes.overlayPane
      forwardEventBehindPane(event.originalEvent, pane)
    }
  },
  // -------------------------------------------------------------
  _onLayerContextMenu: function (event) {
    if (event.originalEvent.target !== this._canvas) return

    const indexes = this.getClickableFeaturesAt(event.latlng)
    if (indexes.length === 0) return
    this.fire('contextmenu', Object.assign({}, event, { feature: this.clickableFeatures[indexes[0]].feature }))
  },
  // -------------------------------------------------------------
  _onMouseMove: function (event) {
    if (event.originalEvent.target !== this._canvas) return

    this.mousePosition = event.latlng

    let hoveringFeatures = false
    if (this._tooltip) {
      // User requires a tooltip, check if we need to close, update or open it
      const indexes = this.getClickableFeaturesAt(event.latlng)
      if (indexes.length === 0 && this._map.hasLayer(this._tooltip)) {
        // Close tooltip
        this._map.closeTooltip(this._tooltip)
        this._tooltipContent = ''
      } else if (indexes.length) {
        // Open or update
        const content = this._getTooltipContent(this.clickableFeatures[indexes[0]].feature)
        if (content !== this._tooltipContent) {
          this._tooltip.setLatLng(event.latlng)
          this._tooltip.setContent(content)
          this._tooltipContent = content
        }
        if (!this._map.hasLayer(this._tooltip)) this._map.openTooltip(this._tooltip)
        hoveringFeatures = true
      }
    } else {
      hoveringFeatures = this.hasClickableFeaturesAt(event.latlng)
    }

    // Skip redraw when no feature hovered and we're not highlighting
    if (!hoveringFeatures && !this.highlighting) {
      this._canvas.style.cursor = ''
      return
    } else {
      this._canvas.style.cursor = 'pointer'
      this.needRedraw()
    }
  },
  // -------------------------------------------------------------
  getEvents: function () {
    const events = {
      resize: this._onLayerDidResize,
      moveend: this._onLayerDidMove,
      zoom: this._onLayerDidMove
    }
    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      events.zoomanim = this._animateZoom
    }
    if (this.options.pointerEventsEnabled) {
      events.click = this._onLayerClick
      events.contextmenu = this._onLayerContextMenu
      events.mousemove = this._onMouseMove
    }

    return events
  },
  // -------------------------------------------------------------
  onAdd: function (map) {
    this._map = map
    this._canvas = L.DomUtil.create('canvas', 'leaflet-layer')
    // disable pointer events if not explicitely enabled
    if (!this.options.pointerEventsEnabled) this._canvas.style.pointerEvents = 'none'

    const size = this._map.getSize()
    this._canvas.width = size.x
    this._canvas.height = size.y

    const topLeft = this._map.containerPointToLayerPoint([0, 0])
    L.DomUtil.setPosition(this._canvas, topLeft)

    const animated = this._map.options.zoomAnimation && L.Browser.any3d
    L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'))

    const pane = this.options.pane ? map._panes[this.options.pane] : map._panes.overlayPane
    pane.appendChild(this._canvas)

    map.on(this.getEvents(), this)

    const del = this._delegate || this
    del.onLayerDidMount && del.onLayerDidMount() // -- callback
    this.needRedraw()
  },

  // -------------------------------------------------------------
  onRemove: function (map) {
    const del = this._delegate || this
    del.onLayerWillUnmount && del.onLayerWillUnmount() // -- callback

    if (this._frame !== null) {
      L.Util.cancelAnimFrame(this._frame)
    }

    const pane = this.options.pane ? map._panes[this.options.pane] : map._panes.overlayPane
    pane.removeChild(this._canvas)

    map.off(this.getEvents(), this)

    this._canvas = null
    this._frame = null
  },

  // ---------- --------------------------------------------------
  addTo: function (map) {
    map.addLayer(this)
    return this
  },
  // --------------------------------------------------------------------------------
  LatLonToMercator: function (latlon) {
    return {
      x: latlon.lng * 6378137 * Math.PI / 180,
      y: Math.log(Math.tan((90 + latlon.lat) * Math.PI / 360)) * 6378137
    }
  },

  // ------------------------------------------------------------------------------
  drawLayer: function () {
    // -- todo make the viewInfo properties  flat objects.
    const size = this._map.getSize()
    const bounds = this._map.getBounds()
    const zoom = this._map.getZoom()

    const center = this.LatLonToMercator(this._map.getCenter())
    const corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()))

    const del = this._delegate || this
    del.onDrawLayer && del.onDrawLayer({
      layer: this,
      canvas: this._canvas,
      bounds: bounds,
      size: size,
      zoom: zoom,
      center: center,
      corner: corner
    })
    const highlightIndexes = this.getClickableFeaturesAt(this.mousePosition)
    this.highlighting = highlightIndexes.length > 0
    if (this.highlighting) {
      const ctx = this._canvas.getContext('2d')
      for (const index of highlightIndexes) {
        const feature = this.clickableFeatures[index]

        ctx.save()
        ctx.globalAlpha = 0.5
        for (const prop in feature.highlight.style) ctx[prop] = feature.highlight.style[prop]
        if (feature.highlight.asStroke) ctx.stroke(feature.highlight.path)
        else ctx.fill(feature.highlight.path)
        ctx.restore()
      }
    }

    this._frame = null
    // schedule a new draw if autoRedraw is enabled
    if (this.autoRedraw) this.needRedraw()
  },
  // -- L.DomUtil.setTransform from leaflet 1.0.0 to work on 0.0.7
  // ------------------------------------------------------------------------------
  _setTransform: function (el, offset, scale) {
    const pos = offset || new L.Point(0, 0)

    el.style[L.DomUtil.TRANSFORM] =
      (L.Browser.ie3d
        ? 'translate(' + pos.x + 'px,' + pos.y + 'px)'
        : 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
      (scale ? ' scale(' + scale + ')' : '')
  },

  // ------------------------------------------------------------------------------
  _animateZoom: function (e) {
    const scale = this._map.getZoomScale(e.zoom)
    // -- different calc of animation zoom  in leaflet 1.0.3 thanks @peterkarabinovic, @jduggan1
    const offset = L.Layer
      ? this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), e.zoom, e.center).min
      : this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos())

    L.DomUtil.setTransform(this._canvas, offset, scale)
  }
})

L.kanvasLayer = function (options) {
  return new L.KanvasLayer(options)
}

export const canvasLayers = {
  methods: {
    createLeafletCanvasLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'kanvasLayer') return
      const layer = this.createLeafletLayer(options)
      this.setCanvasLayerDrawCode(layer, layerOptions.draw)
      if (layerOptions.userData) this.setCanvasLayerUserData(layer, layerOptions.userData)
      if (layerOptions.autoRedraw) this.setCanvasLayerAutoRedraw(layer, layerOptions.autoRedraw)
      bindLeafletEvents(layer, ['click', 'contextmenu'], this, options)
      return layer
    },

    setCanvasLayerDrawCode (layer, drawCode, autoRedraw = false) {
      const leafletLayer = typeof layer === 'string' ? this.getLeafletLayerByName(layer) : layer
      if (!leafletLayer) return

      // helper function to manage listened layers states
      // since canvas layer draw stuff related to geojson layers
      // we listen to geojson layers 'update' event to mark our
      // canvas layer with needRedraw
      const updateListeners = (canvasLayer, listen) => {
        for (const layerName in canvasLayer.listenedLayers) {
          const state = canvasLayer.listenedLayers[layerName]
          if (state === listen) continue
          const listenedLayer = this.getLeafletLayerByName(layerName)
          if (!listenedLayer) continue
          if (listen) listenedLayer.on('update', canvasLayer.needRedraw, canvasLayer)
          else listenedLayer.off('update', canvasLayer.needRedraw, canvasLayer)
          canvasLayer.listenedLayers[layerName] = listen
        }
      }

      // disconnect from previous geojson layers
      updateListeners(leafletLayer, false)

      leafletLayer.listenedLayers = {}
      leafletLayer.drawCalls = []
      if (leafletLayer.userData === undefined) leafletLayer.userData = {}
      if (leafletLayer.compatContext === undefined) leafletLayer.compatContext = {}

      leafletLayer.clearClickableFeatures()

      for (const d of drawCode) {
        /* eslint no-new-func: 0 */
        const drawCode = Function(`
// define visible variables
const ctx = this;
with(this.proxy) { ${d.code} }
`)

        if (d.feature) {
          const [srcLayer, srcFeature] = d.feature.split('?')
          leafletLayer.drawCalls.push((context) => {
            const layer = this.getLeafletLayerByName(srcLayer)
            if (!layer) return
            const feature = layer._features ? layer._features[srcFeature] : undefined
            if (!feature) return
            context.feature = feature
            drawCode.call(context)
          })
          // we'll have to listen source geojson layer 'update' event
          if (!_.has(leafletLayer.listenedLayers, srcLayer)) leafletLayer.listenedLayers[srcLayer] = false
        } else if (d.layer) {
          leafletLayer.drawCalls.push((context) => {
            const layer = this.getLeafletLayerByName(d.layer)
            if (!layer) return
            for (const feature of Object.values(layer._features)) {
              context.feature = feature
              drawCode.call(context)
            }
          })
          // we'll have to listen source geojson layer 'update' event
          if (!_.has(leafletLayer.listenedLayers, d.layer)) leafletLayer.listenedLayers[d.layer] = false
        }
      }

      if (!leafletLayer.onDrawLayer) {
        // build draw function for the layer
        leafletLayer.onDrawLayer = (info) => {
          // update listener states
          updateListeners(leafletLayer, true)

          const ctx = info.canvas.getContext('2d')
          // build context for draw code
          // here we merge global canvas layer context,
          // user defined context and current state context
          const context = Object.assign(
            // current state context
            {
              canvas: ctx,
              now: Date.now(),
              zoom: info.zoom,
              latLonToCanvas: leafletLayer.latLonToCanvas.bind(leafletLayer),
              clearClickableFeatures: leafletLayer.clearClickableFeatures.bind(leafletLayer),
              addClickableFeature: leafletLayer.addClickableFeature.bind(leafletLayer),
              userData: leafletLayer.userData
            },
            leafletLayer.compatContext,
            // global context
            this.canvasLayerDrawContext)

          // draw
          ctx.save()
          ctx.clearRect(0, 0, info.canvas.width, info.canvas.height)
          for (const draw of leafletLayer.drawCalls) draw(context)
          ctx.restore()
        }
      }

      leafletLayer.setAutoRedraw(autoRedraw)
      leafletLayer.needRedraw()
    },

    setCanvasLayerUserData (layer, userData) {
      const leafletLayer = typeof layer === 'string' ? this.getLeafletLayerByName(layer) : layer
      if (!leafletLayer) return

      leafletLayer.userData = Object.assign(leafletLayer.userData, userData)
      leafletLayer.needRedraw()
    },

    setCanvasLayerAutoRedraw (layer, autoRedraw) {
      const leafletLayer = typeof layer === 'string' ? this.getLeafletLayerByName(layer) : layer
      if (!leafletLayer) return

      leafletLayer.setAutoRedraw(autoRedraw)
    },

    /* Compatibility methods */

    updateCanvasLayerDrawCode (layerName, newDrawCode, autoRedraw = false) {
      this.setCanvasLayerDrawCode(layerName, newDrawCode, autoRedraw)
    },

    setCanvasLayerContext (layerName, context) {
      const leafletLayer = this.getLeafletLayerByName(layerName)
      if (!leafletLayer) return

      leafletLayer.compatContext = context
      leafletLayer.needRedraw()
    }
  },

  created () {
    // a proxy to limit access to variables not defined in draw code scope
    this.canvasLayerDrawProxy = new Proxy(window, {
      get: (target, prop, receiver) => { return undefined }
    })
    // the base context we'll make available in draw code
    this.canvasLayerDrawContext = Object.assign({
      proxy: this.canvasLayerDrawProxy,
      // Math constants
      Math: Math,
      // a few handy helpers for draw code
      vec2: (pointA, pointB) => { return { x: pointA.x - pointB.x, y: pointA.y - pointB.y } },
      len2: (vec2) => { return Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y) },
      scale2: (vec2, value) => { return { x: vec2.x * value, y: vec2.y * value } },
      norm2: (vec2) => {
        const len = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y)
        return { x: vec2.x / len, y: vec2.y / len }
      }
    }, CanvasDrawContext.get())

    this.registerLeafletConstructor(this.createLeafletCanvasLayer)
  },

  beforeUnmount () {
  }
}
