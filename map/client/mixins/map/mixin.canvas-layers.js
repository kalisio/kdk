import _ from 'lodash'
import { CanvasDrawContext } from '../../canvas-draw-context'
import { bindLeafletEvents, unbindLeafletEvents } from '../../utils'
import L from 'leaflet'

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
  },

  delegate: function (del) {
    this._delegate = del
  },

  setAutoRedraw: function (enable) {
    this.autoRedraw = enable
    if (enable && this._frame === null) this.needRedraw()
  },

  needRedraw: function () {
    if (this._frame !== null) return
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
    if (this.clickableFeatures.length === 0) return false

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
    if (this.clickableFeatures.length === 0) return []

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
    var topLeft = this._map.containerPointToLayerPoint([0, 0])
    L.DomUtil.setPosition(this._canvas, topLeft)
    this.redrawNow()
  },
  // -------------------------------------------------------------
  _onLayerClick: function (event) {
    const indexes = this.getClickableFeaturesAt(event.latlng)
    if (indexes.length === 0) return
    this.fire('click', Object.assign({}, event, { feature: this.clickableFeatures[indexes[0]].feature }))
  },
  _onLayerContextMenu: function (event) {
    const indexes = this.getClickableFeaturesAt(event.latlng)
    if (indexes.length === 0) return
    this.fire('contextmenu', Object.assign({}, event, { feature: this.clickableFeatures[indexes[0]].feature }))
  },
  // -------------------------------------------------------------
  _onMouseMove: function (event) {
    this.mousePosition = event.latlng
    if (!this.hasClickableFeaturesAt(event.latlng) && !this.highlighting) return
    this.needRedraw()
  },
  // -------------------------------------------------------------
  getEvents: function () {
    var events = {
      resize: this._onLayerDidResize,
      moveend: this._onLayerDidMove,
      zoom: this._onLayerDidMove,
      click: this._onLayerClick,
      contextmenu: this._onLayerContextMenu,
      mousemove: this._onMouseMove
    }
    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      events.zoomanim = this._animateZoom
    }

    return events
  },
  // -------------------------------------------------------------
  onAdd: function (map) {
    this._map = map
    this._canvas = L.DomUtil.create('canvas', 'leaflet-layer')

    var size = this._map.getSize()
    this._canvas.width = size.x
    this._canvas.height = size.y

    var animated = this._map.options.zoomAnimation && L.Browser.any3d
    L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'))

    const pane = this.options.pane ? map._panes[this.options.pane] : map._panes.overlayPane
    pane.appendChild(this._canvas)

    map.on(this.getEvents(), this)

    var del = this._delegate || this
    del.onLayerDidMount && del.onLayerDidMount() // -- callback
    this.needRedraw()
  },

  // -------------------------------------------------------------
  onRemove: function (map) {
    var del = this._delegate || this
    del.onLayerWillUnmount && del.onLayerWillUnmount() // -- callback

    if (this._frame !== null) {
      L.Util.cancelAnimFrame(this._frame)
    }

    map.getPanes().overlayPane.removeChild(this._canvas)

    map.off(this.getEvents(), this)

    this._canvas = null
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
    var size = this._map.getSize()
    var bounds = this._map.getBounds()
    var zoom = this._map.getZoom()

    var center = this.LatLonToMercator(this._map.getCenter())
    var corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()))

    var del = this._delegate || this
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
    var pos = offset || new L.Point(0, 0)

    el.style[L.DomUtil.TRANSFORM] =
      (L.Browser.ie3d
        ? 'translate(' + pos.x + 'px,' + pos.y + 'px)'
        : 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
      (scale ? ' scale(' + scale + ')' : '')
  },

  // ------------------------------------------------------------------------------
  _animateZoom: function (e) {
    var scale = this._map.getZoomScale(e.zoom)
    // -- different calc of animation zoom  in leaflet 1.0.3 thanks @peterkarabinovic, @jduggan1
    var offset = L.Layer ? this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), e.zoom, e.center).min
      : this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos())

    L.DomUtil.setTransform(this._canvas, offset, scale)
  }
})

L.kanvasLayer = function (options) {
  return new L.KanvasLayer(options)
}

export default {
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
      // log: console.log,
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

  beforeDestroy () {
  }
}
