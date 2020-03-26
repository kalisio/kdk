import _ from 'lodash'
import L from 'leaflet'
import sift from 'sift'
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
      const sourceTemplate = _.get(leafletOptions, 'urlTemplate')
      if (sourceTemplate) layer.sourceCompiler = _.template(sourceTemplate)

      if (options.service) { // Check for feature service layers
        const geoJson = await this.getFeatures(options)
        this.updateLeafletHeatmap(layer, geoJson)
      } else if (!_.isNil(source)) {
        // Assume source is an URL returning GeoJson
        const geoJson = await fetchGeoJson(source)
        this.updateLeafletHeatmap(layer, geoJson)
      } else if (!_.isNil(sourceTemplate)) {
        // Source is an URL returning GeoJson possibly templated by time
        const geoJson = await fetchGeoJson(layer.sourceCompiler({ time: this.currentTime }))
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
        min: (min || (valueField ? _.min(values) : 0)),
        max: (max || (valueField ? _.max(values) : 1)),
        data: geoJson.features.map(feature => ({
          lng: _.get(feature, 'geometry.coordinates[0]'),
          lat: _.get(feature, 'geometry.coordinates[1]'),
          [valueField]: (valueField ? _.toNumber(_.get(feature, `properties.${valueField}`)) : 1)
        }))
      })
    },
    updateHeatmap (name, geoJson) {
      // Retrieve the layer
      const layer = this.getLeafletLayerByName(name)
      if (!layer) return // Cannot update invisible layer
      this.updateLeafletHeatmap(layer, geoJson)
    },
    onCurrentTimeChangedHeatmapLayers (time) {
      const heatmaps = _.values(this.layers).filter(sift({
        'leaflet.type': 'heatmap',
        $or: [ // Supported by template URL or time-based features
          { 'leaflet.urlTemplate': { $exists: true } },
          { 'service': { $exists: true }, 'variables': { $exists: true } }
        ],
        isVisible: true
      }))
      heatmaps.forEach(async options => {
        // Retrieve the layer
        const layer = this.getLeafletLayerByName(options.name)
        if (options.service) { // Check for feature service layers
          const geoJson = await this.getFeatures(options)
          this.updateLeafletHeatmap(layer, geoJson)
        } else if (layer.sourceCompiler) {
            const geoJson = await fetchGeoJson(layer.sourceCompiler({ time }))
            this.updateLeafletHeatmap(layer, geoJson)
          }
      })
    }
  },
  created () {
    this.registerLeafletConstructor(this.createLeafletHeatmapLayer)
    this.$on('current-time-changed', this.onCurrentTimeChangedHeatmapLayers)
  },
  beforeDestroy () {
    this.$off('current-time-changed', this.onCurrentTimeChangedHeatmapLayers)
  }
}

// Not automatically declared by leaflet plugin
L.heatmap = function (options) {
  return new HeatmapOverlay(options)
}
