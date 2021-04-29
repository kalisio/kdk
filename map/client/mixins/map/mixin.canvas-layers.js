import { CanvasDrawContext } from '../../canvas-context'
import L from 'leaflet'
// import 'leaflet-canvas-layer'
// import turf_centroid from '@turf/centroid'
// import turf_destination from '@turf/destination'
// import { point as turf_point } from '@turf/helpers'
// import { featureEach as turf_featureEach } from '@turf/meta'
// import { coordEach as turf_coordEach } from '@turf/meta'
// import { coordAll as turf_coordAll } from '@turf/meta'

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

export default {
  methods: {
    createLeafletCanvasLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'kanvasLayer') return

      const layer = this.createLeafletLayer(options)
      this.setupCanvasLayer(layer, layerOptions.draw)
      return layer
    },

    setupCanvasLayer (layer, drawCode) {
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
      updateListeners(layer, false)

      layer.listenedLayers = {}
      layer.drawCalls = []

      for (const d of drawCode) {
        const drawCode = Function(`
// define visible variables
const ctx = this;
with(this.proxy) { ${d.code} }
`)

        if (d.feature) {
          const [srcLayer, srcFeature] = d.feature.split('?')
          layer.drawCalls.push((context) => {
            const layer = this.getLeafletLayerByName(srcLayer)
            if (!layer) return
            const feature = layer._features ? layer._features[srcFeature] : undefined
            if (!feature) return
            context.feature = feature
            drawCode.call(context)
          })
          // we'll have to listen source geojson layer 'update' event
          if (!_.has(layer.listenedLayers, srcLayer)) layer.listenedLayers[srcLayer] = false
        } else if (d.layer) {
          layer.drawCalls.push((context) => {
            const layer = this.getLeafletLayerByName(srcLayer)
            if (!layer) return
            for (const feature of layer._features) {
              context.feature = feature
              drawCode.call(context)
            }
          })
          // we'll have to listen source geojson layer 'update' event
          if (!_.has(layer.listenedLayers, d.layer)) layer.listenedLayers[d.layer] = false
        }
      }

      if (!layer.onDrawLayer) {
        // build draw function for the layer
        layer.onDrawLayer = (info) => {
          // update listener states
          updateListeners(layer, true)

          const ctx = info.canvas.getContext('2d')
          // build context for draw code
          // here we merge global canvas layer context,
          // user defined context and current state context
          const context = Object.assign(
            // current state context
            {
              canvas: ctx,
              zoom: info.zoom,
              latLonToCanvas: (coords) => layer._map.latLngToContainerPoint(L.latLng(coords.lat, coords.lon))
            },
            // user defined context
            layer.userDrawContext,
            // global context
            this.canvasLayerDrawContext)

          // draw
          ctx.save()
          ctx.clearRect(0, 0, info.canvas.width, info.canvas.height)
          for (const draw of layer.drawCalls) draw(context)
          ctx.restore()
        }
      }
    },

    updateCanvasLayerDrawCode (name, newDrawCode) {
      const layer = this.getLeafletLayerByName(name)
      if (!layer) return // Cannot update invisible layer

      this.setupCanvasLayer(layer, newDrawCode)
      layer.needRedraw()
    },

    setCanvasLayerContext (name, userContext) {
      const layer = this.getLeafletLayerByName(name)
      if (!layer) return // Cannot update invisible layer

      layer.userDrawContext = userContext
      layer.needRedraw()
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
