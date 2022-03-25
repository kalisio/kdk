import L from 'leaflet'
import _ from 'lodash'
import { featureEach } from '@turf/meta'
import { featureCollection } from '@turf/helpers'

const TiledFeatureLayer = L.GridLayer.extend({
  initialize (options) {
    L.GridLayer.prototype.initialize.call(this, options)

    this.on('tileunload', (event) => { this.onTileUnload(event) })

    this.featureRefCount = new Map()
    this.getFeatureKey = (feature) => {
      const id = _.get(this.layer, 'featureId', '_id')
      return _.get(feature, 'properties.' + id, _.get(feature, id))
    }

    this.featureSource = options.featureSource
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
    const tileSize = this.getTileSize()
    const bounds = this._tileCoordsToBounds(coords)
    const baseQuery = {
      south: bounds.getSouth(),
      north: bounds.getNorth(),
      west: bounds.getWest(),
      east: bounds.getEast()
    }
    if (_.get(this.options, 'debug.showTileInfos')) {
      tile.style.outline = '1px solid green'
      tile.innerHTML = `leaflet tile is ${tileSize.y} x ${tileSize.x} pixels</br>
        covering ${bounds.getSouth().toFixed(2)}, ${bounds.getNorth().toFixed(2)},
        ${bounds.getWest().toFixed(2)}, ${bounds.getEast().toFixed(2)}</br>`
    }
    // Using async/await seems to cause problems in Leaflet, we use promises instead
    const promises = []
    // Request probes first if any
    if (this.layer.probeService) {
      promises.push(this.activity.getProbeFeatures(_.merge({ baseQuery }, this.layer)))
    }
    const minFeatureZoom = _.get(this.options, 'minFeatureZoom', this._map.getMinZoom())
    const maxFeatureZoom = _.get(this.options, 'maxFeatureZoom', this._map.getMaxZoom())
    // Map zoom will be changed after tile creation
    const tileZoom = this._map.getZoom() + 1
    if ((tileZoom >= minFeatureZoom) && (tileZoom <= maxFeatureZoom)) {
      promises.push(this.featureSource(baseQuery))
    }
    Promise.all(promises).then(data => {
      if (tile.tileUnloaded) {
        // tile was unloaded before fetch completed
        if (_.get(this.options, 'debug.showTileInfos')) {
          tile.innerHTML += 'Data discarded as tile has been unloaded'
        }
        return
      }

      if (this.layer.probeService) {
        tile.probes = (data[0].features.length ? data[0] : null)
        // Can't have measures without probes
        if (!tile.probes) tile.features = null
        // Else check if features are also here
        else if (data.length > 1) tile.features = (data[1].features.length ? data[1] : null)
      } else {
        tile.features = (data[0].features.length ? data[0] : null)
      }

      if (tile.probes || tile.features) {
        if (tile.probes) {
          this.activity.updateLayer(this.layer.name, tile.probes)
        }
        if (tile.features) {
          // If probe are given we should have a perfect match with measures
          // Filter any measure without a corresponding probe
          if (tile.probes) {
            tile.features.features = tile.features.features.filter(feature => {
              const key = this.getFeatureKey(feature)
              return _.find(tile.probes.features, probe => key === this.getFeatureKey(probe))
            })
          }
          this.activity.updateLayer(this.layer.name, tile.features)
        }
        // ref each feature
        // TODO: we could only add features with refcount = 1
        // but in case of probes we need to find corresponding features
        featureEach(tile.probes || tile.features, (feature, index) => {
          const key = this.getFeatureKey(feature)
          let refCount = this.featureRefCount.get(key)
          refCount = refCount === undefined ? 1 : refCount + 1
          this.featureRefCount.set(key, refCount)
        })

        if (_.get(this.options, 'debug.showTileInfos')) {
          if (tile.probes) tile.innerHTML += `fetched ${tile.probes.features.length} probes</br>`
          if (tile.features) tile.innerHTML += `fetched ${tile.features.features.length} features`
        }
      } else {
        if (_.get(this.options, 'debug.showTileInfos')) {
          tile.innerHTML += 'No data fetched'
        }
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
    // remove tiles manually first
    if (this._map) this._removeAllTiles()
    // clear feature ref counts since there's no tile anymore
    this.featureRefCount.clear()
    // request grid layer redraw
    L.GridLayer.prototype.redraw.call(this)
  }
})

export { TiledFeatureLayer }
