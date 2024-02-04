import _ from 'lodash'
import L from 'leaflet'
import { leafletLayer, json_style } from 'protomaps-leaflet'

// Use this locally to make pmtiles accessible
// http-server --cors

// Some changes have been required in the style and in the protomaps-leaflet module to make rendering better:
// background layer type not supported => converted to fill but does not seem to work
// text field for labels should be rewritten and not yet support multiple ones => need to rewrite things like "text-field": "{name:latin} {name:nonlatin}" to "text-field": "name:latin"
// stops not supported on numbers => need to add things like "opacity: numberOrFn(layer.paint["fill-opacity"])" whenever required
// hsla colors not supported => converted to hex + opacity
// circle/line opacity not supported => need to add things like "opacity: numberOrFn(layer.paint["line-opacity"])" whenever required
// fonts partially supported but not loaded from pbf like tileservergl => need to be implemented, using default one for now
// stops not supported on colors => need to be implemented
// sprites partially supported but not loaded from atlas like tileservergl => need to be implemented
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
      const backgroundLayer = _.find(style.layers, { type: 'background' })
      const backgroundColor = _.get(backgroundLayer, 'paint.fill-color')
      // Convert to PMTiles plugin paint rules
      let rules = (style ? json_style(style, {}) : {})
      return this.createLeafletLayer({
        levelDiff: 2,
        backgroundColor,
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
