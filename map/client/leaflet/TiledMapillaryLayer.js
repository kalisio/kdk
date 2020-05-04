import L from 'leaflet'
import _ from 'lodash'
import moment from 'moment'
import { featureEach } from '@turf/meta'
import { featureCollection } from '@turf/helpers'
import { buildUrl } from '../../../core/common'
import { fetchGeoJson } from '../utils'

const TiledMapillaryLayer = L.GridLayer.extend({
  initialize (options) {
    L.GridLayer.prototype.initialize.call(this, options)

    // register event callbacks
    this.on('tileunload', (event) => { this.onTileUnload(event) })

    this.featureRefCount = new Map()
    // this uid is ok to use for mapillary sequences
    // if we want to display other objects, this may need update
    this.getFeatureKey = (feature) => { return feature.properties.key }
  },

  setup (activity, layer) {
    this.activity = activity
    this.layer = layer
  },

  onAdd (map) {
    this.featureRefCount.clear()
    L.GridLayer.prototype.onAdd.call(this, map)
  },

  onRemove (map) {
    this.featureRefCount.clear()
    L.GridLayer.prototype.onRemove.call(this, map)
  },

  createTile (coords) {
    const tile = document.createElement('div')

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
      if (tile.tileUnloaded) {
        // tile was unloaded before fetch completed
        return
      }

      tile.features = (data.features.length ? data : null)

      if (tile.features) {
        // ref each feature
        // TODO: we could only add features with refcount = 1
        // but in case of probes we need to find corresponding features
        featureEach(tile.features, (feature, index) => {
          const key = this.getFeatureKey(feature)
          let refCount = this.featureRefCount.get(key)
          refCount = refCount === undefined ? 1 : refCount + 1
          this.featureRefCount.set(key, refCount)
        })

        this.activity.updateLayer(this.layer.name, tile.features)
      }
    }).catch(error => {
      throw error
    })

    return tile
  },

  onTileUnload (event) {
    // flag tile as unloaded (useful when tile hasn't loaded completely yet)
    event.tile.tileUnloaded = true

    const features = event.tile.features
    if (!features) return

    const remove = []
    // unref each feature, those with refCount = 0 => we can remove
    featureEach(features, (feature, index) => {
      const key = this.getFeatureKey(feature)
      let refCount = this.featureRefCount.get(key)
      refCount = refCount - 1
      if (refCount === 0) {
        remove.push(feature)
        this.featureRefCount.delete(key)
      } else {
        this.featureRefCount.set(key, refCount)
      }
    })

    if (remove.length) {
      const collection = featureCollection(remove)
      this.activity.updateLayer(this.layer.name, collection, true)
    }
  },

  redraw () {
    this.featureRefCount.clear()
    L.GridLayer.prototype.redraw.call(this)
  }
})

export { TiledMapillaryLayer }
