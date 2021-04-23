import L from 'leaflet'
// import 'leaflet-canvas-layer'
// import turf_centroid from '@turf/centroid'
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
  speedVector: (ctx, acCoords, acBearing, acSpeed) => {
    // we'll compute points at 1, 2, 5 and 6 mins
    const conf = {
      arrow: { dt: 7, color: '#ffffff', tipWidth: 8, tipLength: 16, baseRadius: 4, lineWidth: 1 },
      stops: [
        { dt: 1, color: '#ff0000', lineWidth: 4 },
        { dt: 2, color: '#ffa500', lineWidth: 3 },
        { dt: 5, color: '#ffffff', lineWidth: 2 }
      ]
    }

    ctx.canvas.save()

    // compute arrow end point and stop points
    const acPoint = turf_point([acCoords.lon, acCoords.lat])
    const arrowPoint = turf_destination(acPoint, acSpeed * (conf.arrow.dt / 60), acBearing)
    const stopPoints = conf.stops.map((stop) => turf_destination(acPoint, acSpeed * (stop.dt / 60), acBearing))

    // then project in canvas space
    const acPos = ctx.latLonToCanvas(acCoords)
    const arrowPos = ctx.latLonToCanvas({lat: arrowPoint.geometry.coordinates[1], lon: arrowPoint.geometry.coordinates[0]})
    const acStopPos = stopPoints.map((point) => ctx.latLonToCanvas({lat: point.geometry.coordinates[1], lon: point.geometry.coordinates[0]}))

    const uArrow = ctx.norm2(ctx.vec2(arrowPos, acPos))
    const tipHalfLength = conf.arrow.tipLength / 2
    const tipHalfWidth = conf.arrow.tipWidth / 2

    // draw arrow base (circle) + arrow tip
    ctx.canvas.beginPath()
    ctx.canvas.arc(acPos.x, acPos.y, conf.arrow.baseRadius, 0, Math.PI * 2)
    ctx.canvas.moveTo(arrowPos.x, arrowPos.y)
    const arrowBase = {
      x: arrowPos.x - (tipHalfLength * uArrow.x),
      y: arrowPos.y - (tipHalfLength * uArrow.y)
    }
    ctx.canvas.lineTo(arrowBase.x + (tipHalfWidth * uArrow.y), arrowBase.y + (tipHalfWidth * uArrow.x))
    ctx.canvas.lineTo(arrowBase.x - (tipHalfWidth * uArrow.y), arrowBase.y - (tipHalfWidth * uArrow.x))
    ctx.canvas.closePath()
    ctx.canvas.fillStyle = conf.arrow.color
    ctx.canvas.fill()

    // draw arrow line
    ctx.canvas.beginPath()
    ctx.canvas.moveTo(acPos.x, acPos.y)
    ctx.canvas.lineTo(arrowPos.x, arrowPos.y)
    ctx.canvas.strokeStyle = conf.arrow.color
    ctx.canvas.lineWidth = conf.arrow.lineWidth
    ctx.canvas.lineCap = 'butt'
    ctx.canvas.stroke()

    // draw arcs at configured stops
    for (let i = 0; i < conf.stops.length; ++i) {
      ctx.canvas.beginPath()
      const radius = ctx.len2(ctx.vec2(acStopPos[i], acPos))
      ctx.canvas.arc(acPos.x, acPos.y, radius, (270 + acBearing - 30) * (Math.PI / 180), (270 + acBearing + 30) * (Math.PI / 180))
      ctx.canvas.strokeStyle = conf.stops[i].color
      ctx.canvas.lineWidth = conf.stops[i].lineWidth
      ctx.canvas.lineCap = 'round'
      ctx.canvas.stroke()
    }

    ctx.canvas.restore()
  },
  rangeCircles: (ctx, acCoords, acSpeed) => {
    // 5, 15, 30 and 60 minutes
    const conf = {
      stops: [
        { dt:  5, color: '#ff0000', lineWidth: 4 },
        { dt: 15, color: '#ffa500', lineWidth: 3 },
        { dt: 30, color: '#ff0000', lineWidth: 2 },
        { dt: 60, color: '#ffffff', lineWidth: 2 }
      ]
    }

    ctx.canvas.save()

    // compute lat/lon stop points
    const acPoint = turf_point([acCoords.lon, acCoords.lat])
    const stopPoints = conf.stops.map((stop) => turf_destination(acPoint, acSpeed * (stop.dt / 60), 0))

    // project in canvas space
    const acPos = ctx.latLonToCanvas(acCoords)
    const acStopPos = stopPoints.map((point) => ctx.latLonToCanvas({lat: point.geometry.coordinates[1], lon: point.geometry.coordinates[0]}))

    // draw circles at configured stops
    for (let i = 0; i < conf.stops.length; ++i) {
      ctx.canvas.beginPath()
      const radius = ctx.len2(ctx.vec2(acStopPos[i], acPos))
      ctx.canvas.arc(acPos.x, acPos.y, radius, 0, Math.PI * 2)
      ctx.canvas.strokeStyle = conf.stops[i].color
      ctx.canvas.lineWidth = conf.stops[i].lineWidth
      ctx.canvas.stroke()
    }

    ctx.canvas.restore()
  },
  contingencySpider: (ctx, acCoords) => {
    const conf = {
      legLength: 30,
      radius: 25,
      airports: [
        { aita: 'BIQ', oaci: 'LFBZ', coords: [-1.5312, 43.4534] },
        { aita: 'TLS', oaci: 'LFBO', coords: [1.3678, 43.6192] },
        { aita: 'ORY', oaci: 'LFPO', coords: [2.3593, 48.7114] },
        { aita: 'AJA', oaci: 'LFKJ', coords: [8.8021, 41.9084] }
      ]
    }

    ctx.canvas.save()

    // project points in canvas space
    const acPos = ctx.latLonToCanvas(acCoords)
    const apVec = conf.airports.map((airport) => {
      const pos = ctx.latLonToCanvas({ lat: airport.coords[1], lon: airport.coords[0] })
      return ctx.norm2(ctx.vec2(pos, acPos))
    })

    ctx.canvas.beginPath()
    // circle around ac
    ctx.canvas.arc(acPos.x, acPos.y, conf.radius, 0, Math.PI * 2)
    // then spider legs
    for (let i = 0; i < conf.airports.length; ++i) {
      const base = {
        x: acPos.x + conf.radius * apVec[i].x,
        y: acPos.y + conf.radius * apVec[i].y
      }
      ctx.canvas.moveTo(base.x, base.y)
      ctx.canvas.lineTo(base.x + conf.legLength * apVec[i].x, base.y + conf.legLength * apVec[i].y)
    }
    ctx.canvas.strokeStyle = '#ffa500'
    ctx.canvas.stroke()

    // display text on legs
    ctx.canvas.fillStyle = '#ffffff'
    for (let i = 0; i < conf.airports.length; ++i) {
      ctx.canvas.fillText(conf.airports[i].aita, acPos.x + (conf.radius + conf.legLength) * apVec[i].x, acPos.y + (conf.radius + conf.legLength) * apVec[i].y)
    }

    ctx.canvas.restore()
  },
  contingencyRoutes: (ctx, acCoords) => {
    const conf = {
      deadRadius: 30,
      routes: [
        { points: [[-1.17210, 43.32917], [-1.30806, 43.38709], [-1.32042, 43.56049], [-1.5312, 43.4534]], dash: [5, 15], color: '#ffffff' }
      ]
    }

    ctx.canvas.save()

    const acPos = ctx.latLonToCanvas(acCoords)

    for (const route of conf.routes) {
      // project route points in canvas space
      const points = route.points.map((point) => ctx.latLonToCanvas({ lat: point[1], lon: point[0] }))
      const uPoint0 = ctx.norm2(ctx.vec2(points[0], acPos))

      ctx.canvas.beginPath()
      // first point, just outside dead zone around ac
      ctx.canvas.moveTo(acPos.x + conf.deadRadius * uPoint0.x, acPos.y + conf.deadRadius * uPoint0.y)
      // all other route points
      for (const point of points) ctx.canvas.lineTo(point.x, point.y)
      ctx.canvas.strokeStyle = route.color
      ctx.canvas.lineWidth = conf.lineWidth
      ctx.canvas.setLineDash(route.dash)
      ctx.canvas.stroke()
    }

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
      this.buildDrawCode(layer, layerOptions)
      return layer
    },

    buildDrawCode (layer, options) {
      layer.onFeature = []
      layer.onLayer = []
      for (const d of options.draw) {
        if (d.feature) {
          const [srcLayer, srcFeature] = d.feature.split('?')
          const code = `
// define visible variables
const ctx = this;
// with(this.proxy) { ${d.code} }
with(this.proxy) {
  const coords = {
    lat: ctx.feature.geometry.coordinates[1],
    lon: ctx.feature.geometry.coordinates[0]
  }
  if (ctx.zoom < 10)
    ctx.rangeCircles(ctx, coords, 100);
  else
    ctx.speedVector(ctx, coords, 0, 100);
  ctx.contingencyRoutes(ctx, coords)
  ctx.contingencySpider(ctx, coords)
}
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
          }, this.canvasLayerDrawContext)

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

    updateCanvasLayer (name, newDrawCode) {
      // Retrieve the layer
      const layer = this.getLeafletLayerByName(name)
      if (!layer) return // Cannot update invisible layer

      this.setupCanvasLayerDrawCode(layer, newDrawCode)
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
