import _ from 'lodash'
import logger from 'loglevel'
import * as Mapillary from 'mapillary-js'
import { TiledMapillaryLayer } from '../../leaflet/TiledMapillaryLayer'

export default {
  methods: {
    async createLeafletMapillaryCoverageLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid type
      if (leafletOptions.type !== 'mapillary') return
      if (typeof this.createLeafletGeoJsonLayer !== 'function') {
        throw new Error('Mapillary layer needs support of GeoJson layer to work correctly')
      }
      // Based on real-time geojson to be created first
      const layer = await this.createLeafletGeoJsonLayer(_.merge(options, {
        featureId: 'key',
        leaflet: {
          type: 'geoJson',
          realtime: true,
          removeMissing: false,
          cluster: false
        }
      }))
      // Then tiled layer
      const tiledLayer = new TiledMapillaryLayer(leafletOptions)
      tiledLayer.setup(this, options)
      layer.tiledLayer = tiledLayer
      tiledLayer.addTo(this.map)
      layer.on('add', () => tiledLayer.addTo(this.map))
      layer.on('remove', () => tiledLayer.removeFrom(this.map))
      this.mapillaryLayer = options
      return layer
    }
  },
  created () {
    // Initialize the component
    this.mapillaryClientID = undefined
    // Check whether Mapillary is suppoted
    if (!Mapillary.isSupported()) {
      logger.warn('Mapillary is not supported on your platform')
      return
    }
    // Check whether the clientID is initailized
    this.mapillaryClientID = this.$store.get('capabilities.api.mapillary.clientID')
    if (!this.mapillaryClientID) {
      logger.warn('You must provide a clientID to use Mapillary')
      return
    }
    // Register the mapillary coverage
    this.registerLeafletConstructor(this.createLeafletMapillaryCoverageLayer)
  }
}
