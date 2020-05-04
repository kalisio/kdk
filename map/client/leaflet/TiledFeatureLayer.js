import L from 'leaflet'
import _ from 'lodash'
import { featureEach } from '@turf/meta'
import { featureCollection } from '@turf/helpers'

const TiledFeatureLayer = L.GridLayer.extend({
  initialize (options) {
    L.GridLayer.prototype.initialize.call(this, options)

    this.on('tileunload', (event) => { this.onTileUnload(event) })

    this.featureRefCount = new Map()
    this.getFeatureKey = (feature) => { return feature._id }
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
      if (tile.tileUnloaded) {
        // tile was unloaded before fetch completed
        return
      }

      if (this.layer.probeService) {
        tile.probes = (data[0].features.length ? data[0] : null)
        tile.features = (data[1].features.length ? data[1] : null)
      } else {
        tile.features = (data[0].features.length ? data[0] : null)
      }

      if (tile.probes || tile.features) {
        // ref each feature
        // TODO: we could only add features with refcount = 1
        // but in case of probes we need to find corresponding features
        featureEach(tile.probes || tile.features, (feature, index) => {
          const key = this.getFeatureKey(feature)
          let refCount = this.featureRefCount.get(key)
          refCount = refCount === undefined ? 1 : refCount + 1
          this.featureRefCount.set(key, refCount)
        })

        if (tile.probes) this.activity.updateLayer(this.layer.name, tile.probes)
        if (tile.features) this.activity.updateLayer(this.layer.name, tile.features)
      }
    }).catch(error => {
      throw error
    })

    return tile
  },

  onTileUnload (event) {
    // flag tile as unloaded (useful when tile hasn't loaded completely yet)
    event.tile.tileUnloaded = true

    const probes = event.tile.probes
    const features = event.tile.features
    if (!probes && !features) return

    const remove = []
    // unref each feature, those with refCount = 0 => we can remove
    featureEach(probes || features, (feature, index) => {
      const key = this.getFeatureKey(feature)
      let refCount = this.featureRefCount.get(key)
      refCount = refCount - 1
      if (refCount === 0) {
        this.featureRefCount.delete(key)
        remove.push(feature)
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

export { TiledFeatureLayer }
