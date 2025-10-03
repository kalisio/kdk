import _ from 'lodash'
import logger from 'loglevel'
import { Store } from '../../../../core/client/index.js'
import { LeafletEvents, bindLeafletEvents } from '../../utils.map.js'

export const mapillaryLayers = {
  methods: {
    async createLeafletMapillaryLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid type
      if (leafletOptions.type !== 'mapillary') return
      // Based on real-time geojson to be created first
      const layer = await this.createLeafletLayer(_.merge(options, {
        leaflet: {
          type: 'vectorGrid.protobuf',
          source: 'https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=' + this.mapillaryToken,
          interactive: true,
          minZoom: 13,
          maxNativeZoom: 14,
          vectorTileLayerStyles: {
            sequence: function (properties, zoom) {
              return {
                weight: zoom > 13 ? 1 : 2,
                color: '#44BB44',
                opacity: zoom > 13 ? 0.5 : 1
              }
            },
            image: []
          }
        }
      }))
      bindLeafletEvents(layer, LeafletEvents.Feature, this, options)
      return layer
    }
  },
  created () {
    // Check whether the token is initialized
    this.mapillaryToken = Store.get('capabilities.api.mapillary.token')
    if (!this.mapillaryToken) {
      logger.warn('You must provide a client token to use Mapillary')
      return
    }
    // Register the mapillary coverage
    this.registerLeafletConstructor(this.createLeafletMapillaryLayer)
  }
}
