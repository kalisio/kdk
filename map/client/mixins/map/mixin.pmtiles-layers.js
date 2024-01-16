import _ from 'lodash'
import L from 'leaflet'
import { leafletLayer, json_style } from 'protomaps-leaflet'

export const pmtilesLayers = {
  methods: {
    async createLeafletPMTilesLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid types
      if (leafletOptions.type !== 'pmtiles') return
      // Check for style information given as object or URL
      let style = _.get(leafletOptions, 'style')
      if (typeof style === 'string') {
        const response = await fetch(style)
        if (response.status !== 200) {
          throw new Error(`Impossible to fetch style ${style}: ` + response.status)
        }
        style = await response.json()
      }
      // Convert to PMTiles plugin paint rules
      let rules = (style ? json_style(style, {}) : {})
      return this.createLeafletLayer({
        ...leafletOptions,
        ...rules
      })
    }
  },
  created () {
    this.registerLeafletConstructor(this.createLeafletPMTilesLayer)
  }
}

// Not automatically declared by leaflet plugin
L.pmtiles = function (options) {
  return leafletLayer(options)
}
