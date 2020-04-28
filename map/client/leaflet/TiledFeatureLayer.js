import L from 'leaflet'
import _ from 'lodash'
import { tile2key, tileSetContainsParent } from './utils'

const TiledFeatureLayer = L.GridLayer.extend({
  initialize (options) {
    L.setOptions(this, options)
    // register event callbacks
    this.on('tileload', (event) => { this.onTileLoad(event) })
    this.on('tileunload', (event) => { this.onTileUnload(event) })

    this.loadedTiles = new Set()
  },

  setup (activity, layer) {
    this.activity = activity
    this.layer = layer
  },

  onAdd (map) {
    // be notified when zoom starts
    // keep a ref on bound objects to be able to remove them later
    // this.zoomStartCallback = this.onZoomStart.bind(this)
    // this.zoomEndCallback = this.onZoomEnd.bind(this)
    // map.on('zoomstart', this.zoomStartCallback)
    // map.on('zoomend', this.zoomEndCallback)
    L.GridLayer.prototype.onAdd.call(this, map)
  },

  onRemove (map) {
    L.GridLayer.prototype.onRemove.call(this, map)
  },

  createTile (coords, done) {
    const tile = document.createElement('div')
    let skipTile = false

    // Check for zoom level range first,
    // it appears that zoom level has not yet changed in map on creation so that we use the tile one
    if (this.options.minZoom && (coords.zoom < this.options.minZoom)) skipTile = true
    if (this.options.maxZoom && (coords.zoom > this.options.maxZoom)) skipTile = true

    if (!skipTile) {
      // tile.style.outline = '1px solid red'
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
        if (this.layer.probeService) {
          tile.probes = (data[0].features.length ? data[0] : null)
          tile.features = (data[1].features.length ? data[1] : null)
        } else {
          tile.features = (data[0].features.length ? data[0] : null)
        }
        done(null, tile)
      })
        .catch(error => {
          done(error, tile)
          throw error
        })
    } else {
      setTimeout(() => { done(null, tile) }, 100)
    }

    return tile
  },

  async onTileLoad (event) {
    const probes = event.tile.probes
    const features = event.tile.features
    if (!probes && !features) return

    // Check for zoom level range first as user might have zoomed during loading
    if (this.options.minZoom && (this._map.getZoom() < this.options.minZoom)) return
    if (this.options.maxZoom && (this._map.getZoom() > this.options.maxZoom)) return

    // add tile to loaded tiles set
    const tilekey = tile2key(event.coords)
    this.loadedTiles.add(tilekey)

    // Update realtime layer with probe first then (measure) features
    if (probes) this.activity.updateLayer(this.layer.name, probes)
    if (features) this.activity.updateLayer(this.layer.name, features)
  },

  onTileUnload (event) {
    const probes = event.tile.probes
    const features = event.tile.features
    if (!probes && !features) return

    const tilekey = tile2key(event.coords)
    // If tile not available in tile cache then by default we'd like to clear it
    let unload = !this.loadedTiles.has(tilekey)
    // Check for zoom level range first
    if (this.options.minZoom && (this._map.getZoom() < this.options.minZoom)) unload |= true
    if (this.options.maxZoom && (this._map.getZoom() > this.options.maxZoom)) unload |= true
    // check if we can unload the associated geojson bits
    // we only unload when the unloaded tile is completely outside the visible bounds
    if (!unload) {
      const visible = this._map.getBounds()
      const bounds = this._tileCoordsToBounds(event.coords)
      if (!visible.intersects(bounds)) unload = true
    }

    if (unload) {
      // ok, we can unload geosjon, and remove tile from loaded tile set
      this.loadedTiles.delete(tilekey)

      // No need to remove measures as they are 'attached' to probes
      if (probes) this.activity.updateLayer(this.layer.name, probes, true)
      else if (features) this.activity.updateLayer(this.layer.name, features, true)
    }
  },

  redraw () {
    this.loadedTiles.clear()
    L.GridLayer.prototype.redraw.call(this)
  },

  onZoomStart (event) {
  },

  onZoomEnd (event) {
  }
})

export { TiledFeatureLayer }
