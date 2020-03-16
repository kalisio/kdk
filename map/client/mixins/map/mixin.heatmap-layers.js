import HeatmapOverlay from 'leaflet-heatmap'
import { fetchGeoJson } from '../../utils'

export default {
  methods: {
    async createLeafletHeatmapLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid types
      if (leafletOptions.type !== 'heatmap') return
      const layer = this.createLeafletLayer(options)
      const source = _.get(leafletOptions, 'url')

      if (options.service) { // Check for feature service layers
        const geoJson = await this.getFeatures(options)
        this.updateLeafletHeatmap(layer, geoJson)
      } else if (!_.isNil(source)) {
        // Assume source is an URL returning GeoJson
        const geoJson = await fetchGeoJson(source)
        this.updateLeafletHeatmap(layer, geoJson)
      }

      return layer
    },
    updateLeafletHeatmap (layer, geoJson) {
      // Otherwise we update data
      const valueField = _.get(layer, 'cfg.valueField')
      const min = _.get(layer, 'cfg.min')
      const max = _.get(layer, 'cfg.max')
      const values = (valueField ? geoJson.features.map(feature => _.toNumber(_.get(feature, `properties.${valueField}`))) : [])
      // By default our intensity is based on the number of points only
      // otherwise when provided we use target value
      layer.setData({
        min: (min ? min : (valueField ? _.min(values) : 0)),
        max: (max ? max : (valueField ? _.max(values) : 1)),
        data: geoJson.features.map(feature => ({
          lng: _.get(feature, 'geometry.coordinates[0]'),
          lat: _.get(feature, 'geometry.coordinates[1]'),
          [valueField]: (valueField ? _.toNumber(_.get(feature, `properties.${valueField}`)) : 1)
        }))
      })
    },
    updateHeatmap (name, geoJson) {
      // Retrieve the layer
      let layer = this.getLeafletLayerByName(name)
      if (!layer) return // Cannot update invisible layer
      this.updateLeafletHeatmap(layer, geoJson)
    }
  },
  created () {
    this.registerLeafletConstructor(this.createLeafletHeatmapLayer)
  }
}

// Not automatically declared by leaflet plugin
L.heatmap = function (options) {
  return new HeatmapOverlay(options)
}
