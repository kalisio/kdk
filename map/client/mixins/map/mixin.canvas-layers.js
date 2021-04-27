import L from 'leaflet'
// import 'leaflet-canvas-layer'
// import turf_centroid from '@turf/centroid'
import turf_destination from '@turf/destination'
import { point as turf_point } from '@turf/helpers'
import { featureEach as turf_featureEach } from '@turf/meta'
import { coordEach as turf_coordEach } from '@turf/meta'
import { coordAll as turf_coordAll } from '@turf/meta'

L.KanvasLayer = (L.Layer ? L.Layer : L.Class).extend({
    // -- initialized is called on prototype
    initialize: function (options) {
        this._map    = null;
        this._canvas = null;
        this._frame  = null;
        this._delegate = null;
        L.setOptions(this, options);
    },

    delegate :function(del){
        this._delegate = del;
        return this;
    },

    needRedraw: function () {
        if (!this._frame) {
            this._frame = L.Util.requestAnimFrame(this.drawLayer, this);
        }
        return this;
    },

    //-------------------------------------------------------------
    _onLayerDidResize: function (resizeEvent) {
        this._canvas.width = resizeEvent.newSize.x;
        this._canvas.height = resizeEvent.newSize.y;
    },
    //-------------------------------------------------------------
    _onLayerDidMove: function () {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        this.drawLayer();
    },
    //-------------------------------------------------------------
    getEvents: function () {
        var events = {
            resize: this._onLayerDidResize,
            moveend: this._onLayerDidMove,
            zoom: this._onLayerDidMove
        };
        if (this._map.options.zoomAnimation && L.Browser.any3d) {
            events.zoomanim =  this._animateZoom;
        }

        return events;
    },
    //-------------------------------------------------------------
    onAdd: function (map) {
        this._map = map;
        this._canvas = L.DomUtil.create('canvas', 'leaflet-layer');
        this.tiles = {};

        var size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;

        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));


        map._panes.overlayPane.appendChild(this._canvas);

        map.on(this.getEvents(),this);

        var del = this._delegate || this;
        del.onLayerDidMount && del.onLayerDidMount(); // -- callback
        this.needRedraw();
    },

    //-------------------------------------------------------------
    onRemove: function (map) {
        var del = this._delegate || this;
        del.onLayerWillUnmount && del.onLayerWillUnmount(); // -- callback

        if (this._frame) {
            L.Util.cancelAnimFrame(this._frame);
        }

        map.getPanes().overlayPane.removeChild(this._canvas);

        map.off(this.getEvents(),this);

        this._canvas = null;

    },

    //---------- --------------------------------------------------
    addTo: function (map) {
        map.addLayer(this);
        return this;
    },
    // --------------------------------------------------------------------------------
    LatLonToMercator: function (latlon) {
        return {
            x: latlon.lng * 6378137 * Math.PI / 180,
            y: Math.log(Math.tan((90 + latlon.lat) * Math.PI / 360)) * 6378137
        };
    },

    //------------------------------------------------------------------------------
    drawLayer: function () {
        // -- todo make the viewInfo properties  flat objects.
        var size   = this._map.getSize();
        var bounds = this._map.getBounds();
        var zoom   = this._map.getZoom();

        var center = this.LatLonToMercator(this._map.getCenter());
        var corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()));

        var del = this._delegate || this;
        del.onDrawLayer && del.onDrawLayer( {
                                                layer : this,
                                                canvas: this._canvas,
                                                bounds: bounds,
                                                size: size,
                                                zoom: zoom,
                                                center : center,
                                                corner : corner
                                            });
        this._frame = null;
    },
    // -- L.DomUtil.setTransform from leaflet 1.0.0 to work on 0.0.7
    //------------------------------------------------------------------------------
    _setTransform: function (el, offset, scale) {
        var pos = offset || new L.Point(0, 0);

        el.style[L.DomUtil.TRANSFORM] =
			(L.Browser.ie3d ?
				'translate(' + pos.x + 'px,' + pos.y + 'px)' :
				'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
			(scale ? ' scale(' + scale + ')' : '');
    },

    //------------------------------------------------------------------------------
    _animateZoom: function (e) {
        var scale = this._map.getZoomScale(e.zoom);
        // -- different calc of animation zoom  in leaflet 1.0.3 thanks @peterkarabinovic, @jduggan1
        var offset = L.Layer ? this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), e.zoom, e.center).min :
                               this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

        L.DomUtil.setTransform(this._canvas, offset, scale);


    }
});

L.kanvasLayer = function () {
    return new L.KanvasLayer();
};

const canvasLib = {
  // vec2 helpers
  vec2: (pointA, pointB) => { return { x: pointA.x - pointB.x, y: pointA.y - pointB.y } },
  len2: (vec2) => { return Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y) },
  scale2: (vec2, value) => { return { x: vec2.x * value, y: vec2.y * value } },
  norm2: (vec2) => {
    const len = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y)
    return { x: vec2.x / len, y: vec2.y / len }
  }
}

const dragonFlyLib = {
  speedArrow: (ctx, options) => {
    const { center, speed, track, arrow, arcs } = options

    ctx.canvas.save()

    // compute arrow end point and stop points
    const acPoint = turf_point([center.lon, center.lat])
    const arrowPoint = turf_destination(acPoint, speed * (arrow.dt / 60), track)
    const stopPoints = arcs.map((stop) => turf_destination(acPoint, speed * (stop.dt / 60), track))

    // then project in canvas space
    const acPos = ctx.latLonToCanvas(center)
    const arrowPos = ctx.latLonToCanvas({lat: arrowPoint.geometry.coordinates[1], lon: arrowPoint.geometry.coordinates[0]})
    const acStopPos = stopPoints.map((point) => ctx.latLonToCanvas({lat: point.geometry.coordinates[1], lon: point.geometry.coordinates[0]}))

    const uArrow = ctx.norm2(ctx.vec2(arrowPos, acPos))
    const tipHalfLength = arrow.tipLength / 2
    const tipHalfWidth = arrow.tipWidth / 2

    // draw arrow base (circle) + arrow tip
    ctx.canvas.beginPath()
    ctx.canvas.arc(acPos.x, acPos.y, arrow.baseRadius, 0, Math.PI * 2)
    ctx.canvas.moveTo(arrowPos.x, arrowPos.y)
    const arrowBase = {
      x: arrowPos.x - (tipHalfLength * uArrow.x),
      y: arrowPos.y - (tipHalfLength * uArrow.y)
    }
    ctx.canvas.lineTo(arrowBase.x + (tipHalfWidth * uArrow.y), arrowBase.y + (tipHalfWidth * uArrow.x))
    ctx.canvas.lineTo(arrowBase.x - (tipHalfWidth * uArrow.y), arrowBase.y - (tipHalfWidth * uArrow.x))
    ctx.canvas.closePath()
    ctx.canvas.fillStyle = arrow.color
    ctx.canvas.fill()

    // draw arrow line
    ctx.canvas.beginPath()
    ctx.canvas.moveTo(acPos.x, acPos.y)
    ctx.canvas.lineTo(arrowPos.x, arrowPos.y)
    ctx.canvas.strokeStyle = arrow.color
    ctx.canvas.lineWidth = arrow.lineWidth
    ctx.canvas.lineCap = 'butt'
    ctx.canvas.stroke()

    // draw arcs at configured stops
    for (let i = 0; i < arcs.length; ++i) {
      ctx.canvas.beginPath()
      const radius = ctx.len2(ctx.vec2(acStopPos[i], acPos))
      ctx.canvas.arc(acPos.x, acPos.y, radius, (270 + track - 30) * (Math.PI / 180), (270 + track + 30) * (Math.PI / 180))
      ctx.canvas.strokeStyle = arcs[i].color
      ctx.canvas.lineWidth = arcs[i].lineWidth
      ctx.canvas.lineCap = 'round'
      ctx.canvas.stroke()
    }

    ctx.canvas.restore()
  },
  rangeCircles: (ctx, options) => {
    const { center, speed, ranges } = options

    ctx.canvas.save()

    // compute lat/lon stop points
    const acPoint = turf_point([center.lon, center.lat])
    const stopPoints = ranges.map((stop) => turf_destination(acPoint, speed * (stop.dt / 60), 0))

    // project in canvas space
    const acPos = ctx.latLonToCanvas(center)
    const acStopPos = stopPoints.map((point) => ctx.latLonToCanvas({lat: point.geometry.coordinates[1], lon: point.geometry.coordinates[0]}))

    // draw circles at configured stops
    for (let i = 0; i < ranges.length; ++i) {
      ctx.canvas.beginPath()
      const radius = ctx.len2(ctx.vec2(acStopPos[i], acPos))
      ctx.canvas.arc(acPos.x, acPos.y, radius, 0, Math.PI * 2)
      ctx.canvas.strokeStyle = ranges[i].color
      ctx.canvas.lineWidth = ranges[i].lineWidth
      ctx.canvas.stroke()
    }

    ctx.canvas.restore()
  },
  contingencySpider: (ctx, options) => {
    const { center, radius, color, airports } = options

    ctx.canvas.save()

    // project points in canvas space
    const acPos = ctx.latLonToCanvas(center)
    const apVec = airports.map((airport) => {
      const pos = ctx.latLonToCanvas({ lat: airport.coords[1], lon: airport.coords[0] })
      return ctx.norm2(ctx.vec2(pos, acPos))
    })

    ctx.canvas.beginPath()
    // circle around ac
    ctx.canvas.arc(acPos.x, acPos.y, radius, 0, Math.PI * 2)
    ctx.canvas.strokeStyle = color
    ctx.canvas.stroke()

    // then spider legs
    for (let i = 0; i < airports.length; ++i) {
      const base = {
        x: acPos.x + radius * apVec[i].x,
        y: acPos.y + radius * apVec[i].y
      }
      ctx.canvas.beginPath()
      ctx.canvas.moveTo(base.x, base.y)
      ctx.canvas.lineTo(base.x + airports[i].length * apVec[i].x, base.y + airports[i].length * apVec[i].y)
      ctx.canvas.strokeStyle = airports[i].color
      ctx.canvas.stroke()
    }

    // display text on legs
    ctx.canvas.fillStyle = '#ffffff'
    for (let i = 0; i < airports.length; ++i) {
      ctx.canvas.fillText(airports[i].name, acPos.x + (radius + airports[i].length) * apVec[i].x, acPos.y + (radius + airports[i].length) * apVec[i].y)
    }

    ctx.canvas.restore()
  },
  contingencyRoutes: (ctx, options) => {
    const { center, emptyRadius, routes } = options

    ctx.canvas.save()

    const acPos = ctx.latLonToCanvas(center)

    turf_featureEach(routes, (feature, index) => {
      // project route points in canvas space
      const points = []
      turf_coordEach(feature, (coord) => { points.push(ctx.latLonToCanvas({ lat: coord.geometry.coordinates[1], lon: coord.geometry.coordinates[0] })) })
      const uPoint0 = ctx.norm2(ctx.vec2(points[0], acPos))

      ctx.canvas.beginPath()
      // first point, just outside dead zone around ac
      ctx.canvas.moveTo(acPos.x + emptyRadius * uPoint0.x, acPos.y + emptyRadius * uPoint0.y)
      // all other route points
      for (const point of points) ctx.canvas.lineTo(point.x, point.y)
      ctx.canvas.strokeStyle = feature.properties.color
      ctx.canvas.lineWidth = feature.properties.lineWidth
      ctx.canvas.setLineDash(feature.properties.dash)
      ctx.canvas.stroke()
    })

    ctx.canvas.restore()
  },
  incapacitationIndicator: (ctx) => {

  }
}

export default {
  methods: {
    createLeafletCanvasLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'kanvasLayer') return

      const layer = this.createLeafletLayer(options)
      this.buildDrawCode(layer, layerOptions.draw)
      return layer
    },

    buildDrawCode (layer, drawCode) {
      layer.onFeature = []
      layer.onLayer = []
      for (const d of drawCode) {
        if (d.feature) {
          const [srcLayer, srcFeature] = d.feature.split('?')
          const code = `
// define visible variables
const ctx = this;
with(this.proxy) { ${d.code} }
`
          const onFeature = {
            lookup: () => {
              const layer = this.getLeafletLayerByName(srcLayer)
              if (!layer) return null

              return layer._features ? layer._features[srcFeature] : undefined
            },
            draw: Function(code)
          }
          layer.onFeature.push(onFeature)
        } else if (d.layer) {
          const code = `
// define visible variables
const ctx = this;
with(this.proxy) { ${d.code} }
`
          const onLayer = {
            lookup: () => this.getLeafletLayerByName(d.layer),
            draw: Function(code)
          }
          layer.onLayer.push(onLayer)
        }
      }

      if (!layer.onDrawLayer) {
        layer.onDrawLayer = (info) => {
          const ctx = info.canvas.getContext('2d')
          ctx.save()
          ctx.clearRect(0, 0, info.canvas.width, info.canvas.height)

          // build context for code
          const context = Object.assign({
            canvas: ctx,
            zoom: info.zoom,
            latLonToCanvas: (coords) => layer._map.latLngToContainerPoint(L.latLng(coords.lat, coords.lon))
          }, layer.userDrawContext, this.canvasLayerDrawContext)

          for (const onFeature of layer.onFeature) {
            const feature = onFeature.lookup()
            if (!feature) continue
            context.feature = feature
            onFeature.draw.call(context)
          }
          for (const onLayer of layer.onLayer) {
            const layer = onLayer.lookup()
            if (!layer) continue
            for (const feature of layer._features) {
              context.feature = feature
              onLayer.draw.call(context)
            }
          }

          ctx.restore()
        }
      }

      layer.needRedraw()
    },

    updateCanvasLayerDrawCode (name, newDrawCode) {
      const layer = this.getLeafletLayerByName(name)
      if (!layer) return // Cannot update invisible layer

      this.buildDrawCode(layer, newDrawCode)
    },

    setCanvasLayerContext (name, userContext) {
      console.log(userContext)
      const layer = this.getLeafletLayerByName(name)
      if (!layer) return // Cannot update invisible layer

      layer.userDrawContext = userContext
      console.log(userContext)
    }
  },

  created () {
    // a proxy to limit access to variable not defined in draw code scope
    this.canvasLayerDrawProxy = new Proxy(window, {
      get: (target, prop, receiver) => { return undefined }
    })
    // the base context we'll make available in draw code
    this.canvasLayerDrawContext = Object.assign({
      proxy: this.canvasLayerDrawProxy,
      // log: console.log,
    }, canvasLib, dragonFlyLib)

    this.registerLeafletConstructor(this.createLeafletCanvasLayer)
  },

  beforeDestroy () {
  }
}
