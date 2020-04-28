import L from 'leaflet'
import _ from 'lodash'
import moment from 'moment'
import { buildUrl } from '../../../core/common'
import { tile2key, tileSetContainsParent } from './utils'
import { fetchGeoJson } from '../utils'

const TiledMapillaryLayer = L.GridLayer.extend({
  initialize (options) {
    L.GridLayer.prototype.initialize.call(this, options)

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

    // Check for zoom level range first
    if (this.options.minZoom && (this._map.getZoom() < this.options.minZoom)) skipTile = true
    if (this.options.maxZoom && (this._map.getZoom() > this.options.maxZoom)) skipTile = true

    if (!skipTile) {
      // tile.style.outline = '1px solid red'
      const bounds = this._tileCoordsToBounds(coords)
      const endTime = this.activity.currentTime || moment.utc()
      const startTime = endTime.clone().add(moment.duration(_.get(this.layer, 'queryFrom', 'P-1Y'))) // 1 year back by default
      const request = buildUrl(this.options.url + '/v3/sequences', { 
        bbox: `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`,
        client_id: this.activity.mapillaryClientID,
        start_time: startTime.format(),
        end_time: endTime.format()
      })
      
      fetchGeoJson(request).then(data => {
        tile.features = (data.features.length ? data : null)
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
    const features = event.tile.features
    if (!features) return

    // Check for zoom level range first as user might have zoomed during loading
    if (this.options.minZoom && (this._map.getZoom() < this.options.minZoom)) return
    if (this.options.maxZoom && (this._map.getZoom() > this.options.maxZoom)) return

    // add tile to loaded tiles set
    const tilekey = tile2key(event.coords)
    this.loadedTiles.add(tilekey)

    // Update realtime layer with features
    this.activity.updateLayer(this.layer.name, features)
  },

  onTileUnload (event) {
    const features = event.tile.features
    if (!features) return
    
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
      this.activity.updateLayer(this.layer.name, features, true)
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

export { TiledMapillaryLayer }
