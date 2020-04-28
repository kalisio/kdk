import L from 'leaflet'
import _ from 'lodash'
import bbox from '@turf/bbox'
import { tile2key, tileSetContainsParent } from './utils'

const TiledFeatureLayer = L.GridLayer.extend({
  initialize (options) {
    L.GridLayer.prototype.initialize.call(this, options)

    this.enableDebug = _.get(options, 'enableDebug', false)

    // register event callbacks
    this.on('tileunload', (event) => { this.onTileUnload(event) })

    this.loadedTiles = new Set()
  },

  getEvents () {
    const events = L.GridLayer.prototype.getEvents.call(this, map)

    /*
    const onZoomEnd = events.zoomend
    events.zoomend = (event) => {
      this.handleGeojsonLayerVisibility()
      if (onZoomEnd) onZoomEnd.call(this, event)
    }
    */

    return events
  },

  handleGeojsonLayerVisibility () {
    let shouldBeVisible = true
    if (this.options.minZoom && this._map.getZoom() < this.options.minZoom) shouldBeVisible = false
    if (this.options.maxZoom && this._map.getZoom() > this.options.maxZoom) shouldBeVisible = false

    if (this.layer.tiledFeatureLayerVisible && !shouldBeVisible) {
      this._map.removeLayer(this.layer)
      this.layer.tiledFeatureLayerVisible = false
    } else if (!this.layer.tiledFeatureLayerVisible && shouldBeVisible) {
      this._map.addLayer(this.layer)
      this.layer.tiledFeatureLayerVisible = true
    }
  },

  setup (activity, layer) {
    this.activity = activity
    this.layer = layer
    // this.layer.tiledFeatureLayerVisible = true
  },

  onAdd (map) {
    this.loadedTiles.clear()
    L.GridLayer.prototype.onAdd.call(this, map)
  },

  onRemove (map) {
    L.GridLayer.prototype.onRemove.call(this, map)
    this.loadedTiles.clear()
  },

  createTile (coords) {
    const tile = document.createElement('div')
    if (this.enableDebug) {
      tile.style.outline = '1px solid blue'
      tile.innerHTML = `${coords.x} ${coords.y} ${coords.z} :`
    }

    const skipTile = tileSetContainsParent(this.loadedTiles, coords)
    if (!skipTile) {
      if (this.enableDebug) {
        tile.innerHTML += ' requested'
      }

      const bounds = this._tileCoordsToBounds(coords)
      const baseQuery = {
        south: bounds.getSouth(),
        north: bounds.getNorth(),
        west: bounds.getWest(),
        east: bounds.getEast()
      }
      // Using async/await seems to cause problems in Leaflet, we use promises instead
      const promises = []
      // Request probes first if any
      if (this.layer.probeService) {
        promises.push(this.activity.getProbeFeatures(_.merge({ baseQuery }, this.layer)))
      }
      promises.push(this.activity.getFeatures(_.merge({ baseQuery }, this.layer)))
      Promise.all(promises).then(data => {
        // fetch ended, make sure we're still at the zoom level the tile was requested at
        if (this.layer.probeService) {
          tile.probes = (data[0].features.length ? data[0] : null)
          tile.features = (data[1].features.length ? data[1] : null)
        } else {
          tile.features = (data[0].features.length ? data[0] : null)
        }

        // add tile to loaded tiles set
        this.loadedTiles.add(tile2key(coords))

        // Update realtime layer with probe first then (measure) features
        if (tile.probes) this.activity.updateLayer(this.layer.name, tile.probes)
        if (tile.features) {
          // compute features bbox
          const box = bbox(tile.features)
          tile.featuresBbox = L.latLngBounds(L.latLng(box[1], box[0]), L.latLng(box[3], box[2]))
          this.activity.updateLayer(this.layer.name, tile.features)
        }

        if (this.enableDebug) {
          tile.style.outline = '1px solid green'
          tile.innerHTML += ', added to loadedTiles'
        }
      }).catch(error => {
        if (this.enableDebug) {
          tile.style.outline = '1px solid red'
          tile.innerHTML += `, failed (${error})`
        }
        throw error
      })
    } else {
      if (this.enableDebug) {
        tile.style.outline = '1px solid green'
        tile.innerHTML += ' skipped'
      }
    }

    return tile
  },

  onTileUnload (event) {
    const probes = event.tile.probes
    const features = event.tile.features
    if (!probes && !features) return

    // unload by default
    let unload = true

    // only unload when features are completely outside the visible bounds
    if (features) {
      const visible = this._map.getBounds()
      unload = !visible.intersects(event.tile.featuresBbox)
    }

    if (unload) {
      // ok, we can unload geosjon, and remove tile from loaded tile set
      this.loadedTiles.delete(tile2key(event.coords))

      // No need to remove measures as they are 'attached' to probes
      if (probes) this.activity.updateLayer(this.layer.name, probes, true)
      else if (features) this.activity.updateLayer(this.layer.name, features, true)
    }
  },

  redraw () {
    this.loadedTiles.clear()
    L.GridLayer.prototype.redraw.call(this)
  }
})

export { TiledFeatureLayer }
