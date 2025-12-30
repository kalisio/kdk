import _ from 'lodash'
import { LeafletEvents, bindLeafletEvents } from '../../utils.map.js'

export const panoramaxLayers = {
  methods: {
    async createLeafletPanoramaxLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid type
      if (leafletOptions.type !== 'panoramax') return
      // Based on real-time geojson to be created first
      const layer = await this.createLeafletLayer(_.merge(options, {
        leaflet: {
          type: 'vectorGrid.protobuf',
          source: 'https://api.panoramax.xyz/api/map/{z}/{x}/{y}.mvt',
          interactive: true,
          minZoom: 13,
          maxNativeZoom: 14,
          vectorTileLayerStyles: {
            sequence: function (properties, zoom) {
              return {
                weight: zoom > 13 ? 1 : 2,
                color: '#2954E9',
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
    this.registerLeafletConstructor(this.createLeafletPanoramaxLayer)
  }
}
