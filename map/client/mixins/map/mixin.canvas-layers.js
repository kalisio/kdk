import L from 'leaflet'
// import 'leaflet-canvas-layer'
import turf_centroid from '@turf/centroid'
import turf_destination from '@turf/destination'
import { point as turf_point } from '@turf/helpers'

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

    //------------------------------------------------------------
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




export default {
  methods: {
    createLeafletCanvasLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'kanvasLayer') return

      const layer = this.createLeafletLayer(options)
      this.buildDrawCode(layer, layerOptions)
      return layer
    },

    buildDrawCode (layer, options) {
      const handler = {
        get: (target, prop, receiver) => { return undefined }
        /*
        set: (target, prop, newval) => {},
        defineProperty: (target, key, descriptor) => {
          return false
        }
        */
      }
      const proxy = new Proxy(window, handler)

      const drawLib = {
        latLonToCanvas: (lat, lon) => layer._map.latLngToContainerPoint(L.latLng(lat, lon)),
        speedVector: (ctx, acLat, acLon, acBearing, acSpeed) => {
          // we'll compute points at 1, 2, 5 and 6 mins
          const conf = {
            arrow: { dt: 7, color: '#ffffff', tipWidth: 8, tipLength: 16, baseRadius: 4 },
            stops: [
              { dt: 1, color: '#ff0000', lineWidth: 4 },
              { dt: 2, color: '#ffa500', lineWidth: 3 },
              { dt: 5, color: '#ffffff', lineWidth: 2 }
            ]
          }

          ctx.save()

          const acPoint = turf_point([acLon, acLat])
          const arrowPoint = turf_destination(acPoint, acSpeed * (conf.arrow.dt / 60), acBearing)
          const stopPoints = conf.stops.map((stop) => turf_destination(acPoint, acSpeed * (stop.dt / 60), acBearing))

          const acPos = layer._map.latLngToContainerPoint(L.latLng(acPoint.geometry.coordinates[1], acPoint.geometry.coordinates[0]))
          const arrowPos = layer._map.latLngToContainerPoint(L.latLng(arrowPoint.geometry.coordinates[1], arrowPoint.geometry.coordinates[0]))
          const acStopPos = stopPoints.map((point) => {
            const proj = layer._map.latLngToContainerPoint(L.latLng(point.geometry.coordinates[1], point.geometry.coordinates[0]))
            const x = proj.x - acPos.x
            const y = proj.y - acPos.y
            return { x, y, len: Math.sqrt((x * x) + (y * y)) }
          })

          const arrow = { x: arrowPos.x - acPos.x, y: arrowPos.y - acPos.y }
          const lenArrow = Math.sqrt(arrow.x * arrow.x + arrow.y * arrow.y)
          const uArrow = { x: arrow.x / lenArrow, y: arrow.y / lenArrow }
          const tipHalfLength = conf.arrow.tipLength / 2
          const tipHalfWidth = conf.arrow.tipWidth / 2

          // draw arrow base (circle) + arrow tip
          ctx.beginPath()
          ctx.arc(0, 0, conf.arrow.baseRadius, 0, Math.PI * 2)
          ctx.moveTo(arrow.x, arrow.y)
          ctx.lineTo(arrow.x - (tipHalfLength * uArrow.x) + (tipHalfWidth * uArrow.y), arrow.y - (tipHalfLength * uArrow.y) + (tipHalfWidth * uArrow.x))
          ctx.lineTo(arrow.x - (tipHalfLength * uArrow.x) - (tipHalfWidth * uArrow.y), arrow.y - (tipHalfLength * uArrow.y) - (tipHalfWidth * uArrow.x))
          ctx.closePath()
          ctx.fillStyle = conf.arrow.color
          ctx.fill()

          // draw arrow line
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(arrowPos.x - acPos.x, arrowPos.y - acPos.y)
          ctx.strokeStyle = conf.arrow.color
          ctx.lineWidth = 1
          ctx.lineCap = 'butt'
          ctx.stroke()

          // draw arcs at configured stops
          for (let i = 0; i < conf.stops.length; ++i) {
            ctx.beginPath()
            ctx.arc(0, 0, acStopPos[i].len, (270 + acBearing - 30) * (Math.PI / 180), (270 + acBearing + 30) * (Math.PI / 180))
            ctx.strokeStyle = conf.stops[i].color
            ctx.lineWidth = conf.stops[i].lineWidth
            ctx.lineCap = 'round'
            ctx.stroke()
          }

          ctx.restore()
        },
        rangeCircles: (ctx, acLat, acLon, acSpeed) => {
          // 5, 15, 30 and 60 minutes
          const conf = {
            stops: [
              { dt:  5, color: '#ff0000', lineWidth: 4 },
              { dt: 15, color: '#ffa500', lineWidth: 3 },
              { dt: 30, color: '#ff0000', lineWidth: 2 },
              { dt: 60, color: '#ffffff', lineWidth: 2 }
            ]
          }

          ctx.save()

          const acPoint = turf_point([acLon, acLat])
          const stopPoints = conf.stops.map((stop) => turf_destination(acPoint, acSpeed * (stop.dt / 60), 0))

          const acPos = layer._map.latLngToContainerPoint(L.latLng(acPoint.geometry.coordinates[1], acPoint.geometry.coordinates[0]))
          const acStopPos = stopPoints.map((point) => {
            const proj = layer._map.latLngToContainerPoint(L.latLng(point.geometry.coordinates[1], point.geometry.coordinates[0]))
            const x = proj.x - acPos.x
            const y = proj.y - acPos.y
            return { x, y, len: Math.sqrt((x * x) + (y * y)) }
          })

          // draw circles at configured stops
          for (let i = 0; i < conf.stops.length; ++i) {
            ctx.beginPath()
            ctx.arc(0, 0, acStopPos[i].len, 0, Math.PI * 2)
            ctx.strokeStyle = conf.stops[i].color
            ctx.lineWidth = conf.stops[i].lineWidth
            ctx.stroke()
          }

          ctx.restore()
        },
        contingencySpider: (ctx, acLat, acLon) => {
          const conf = {
            len: 30,
            radius: 25,
            airports: [
              { aita: 'BIQ', oaci: 'LFBZ', coords: [-1.5312, 43.4534] },
              { aita: 'TLS', oaci: 'LFBO', coords: [1.3678, 43.6192] },
              { aita: 'ORY', oaci: 'LFPO', coords: [2.3593, 48.7114] },
              { aita: 'AJA', oaci: 'LFKJ', coords: [8.8021, 41.9084] }
            ]
          }

          ctx.save()

          const acPos = layer._map.latLngToContainerPoint(L.latLng(acLat, acLon))
          const apPos = conf.airports.map((airport) => layer._map.latLngToContainerPoint(L.latLng(airport.coords[1], airport.coords[0])))
          apPos.forEach((pos) => {
            pos.x -= acPos.x
            pos.y -= acPos.y
          })
          const apLen = apPos.map((pos) => Math.sqrt((pos.x * pos.x) + (pos.y * pos.y)))

          ctx.beginPath()
          ctx.arc(0, 0, conf.radius, 0, Math.PI * 2)
          for (let i = 0; i < conf.airports.length; ++i) {
            ctx.moveTo(conf.radius * (apPos[i].x / apLen[i]), conf.radius * (apPos[i].y / apLen[i]))
            ctx.lineTo((conf.radius + conf.len) * (apPos[i].x / apLen[i]), (conf.radius + conf.len) * (apPos[i].y / apLen[i]))
          }
          ctx.strokeStyle = '#ffa500'
          ctx.stroke()

          ctx.fillStyle = '#ffffff'
          for (let i = 0; i < conf.airports.length; ++i)
            ctx.fillText(conf.airports[i].aita, (conf.radius + conf.len) * (apPos[i].x / apLen[i]), (conf.radius + conf.len) * (apPos[i].y / apLen[i]))

          ctx.restore()
        },
        contingencyRoutes: (ctx, acLat, acLon) => {
          const conf = {
            deadRadius: 30,
            routes: [
              { points: [[-1.17210, 43.32917], [-1.30806, 43.38709], [-1.32042, 43.56049], [-1.5312, 43.4534]], dash: [5, 15], color: '#ffffff' }
            ]
          }

          ctx.save()

          const acPos = layer._map.latLngToContainerPoint(L.latLng(acLat, acLon))

          for (const route of conf.routes) {
            const points = route.points.map((point) => layer._map.latLngToContainerPoint(L.latLng(point[1], point[0])))
            points.forEach((pos) => {
              pos.x -= acPos.x
              pos.y -= acPos.y
            })
            const len = Math.sqrt(points[0].x * points[0].x + points[0].y * points[0].y)
            ctx.beginPath()
            ctx.moveTo(conf.deadRadius * (points[0].x / len), conf.deadRadius * (points[0].y / len))
            for (const point of points) {
              ctx.lineTo(point.x, point.y)
            }
            ctx.strokeStyle = route.color
            ctx.lineWidth = conf.lineWidth
            ctx.setLineDash(route.dash)
            ctx.stroke()
          }

          ctx.restore()
        },
        incapacitationIndicator: (ctx) => {

        }
      }

      layer.getFeature = []
      layer.drawFunctions = []
      for (const d of options.draw) {
        const [srcLayer, srcFeature] = d.relativeTo.split('?')
        layer.getFeature.push(() => {
          const l = this.getLeafletLayerByName(srcLayer)
          if (!l) return null

          return l._features[srcFeature]
        })

        const drawCode =
`// define visible variables for drawing code
const ctx = this.ctx;
const info = this.info;
const lib = this.lib;
const feature = this.feature;
with (this.proxy) {
  // const fn = eval("console.log(L);")
  // const fn = new Function("console.log(L);")

  // ${d.code};
  if (feature) {
    if (info.zoom < 10)
      lib.rangeCircles(ctx, feature.geometry.coordinates[1], feature.geometry.coordinates[0], 100);
    else
      lib.speedVector(ctx, feature.geometry.coordinates[1], feature.geometry.coordinates[0], 0, 100);
    lib.contingencyRoutes(ctx, feature.geometry.coordinates[1], feature.geometry.coordinates[0])
    lib.contingencySpider(ctx, feature.geometry.coordinates[1], feature.geometry.coordinates[0])
  }
}
`
        layer.drawFunctions.push(new Function(drawCode))
      }
      if (!layer.onDrawLayer) {
        layer.onDrawLayer = (info) => {
          const ctx = info.canvas.getContext('2d')
          ctx.save()
          ctx.clearRect(0, 0, info.canvas.width, info.canvas.height)
          for (let i = 0; i < layer.getFeature.length; ++i) {
            const feature = layer.getFeature[i]()
            let offset
            if (feature) {
              const c = turf_centroid(feature)
              offset = layer._map.latLngToContainerPoint(L.latLng(c.geometry.coordinates[1], c.geometry.coordinates[0]))
              ctx.translate(offset.x, offset.y)
            }
            layer.drawFunctions[i].call({ ctx, info, lib: drawLib, proxy, log: console.log, feature })
            if (feature) {
              ctx.translate(-offset.x, -offset.y)
            }
          }
          ctx.restore()
        }
      }
      layer.needRedraw()
    },

    updateCanvasLayer (name, newDrawCode) {
      // Retrieve the layer
      const layer = this.getLeafletLayerByName(name)
      if (!layer) return // Cannot update invisible layer

      this.setupCanvasLayerDrawCode(layer, newDrawCode)
    }
  },

  created () {
    this.registerLeafletConstructor(this.createLeafletCanvasLayer)
  },

  beforeDestroy () {
  }
}
