import _ from 'lodash'
import L from 'leaflet'
import sift from 'sift'
import centroid from '@turf/centroid'
import HeatmapOverlay from 'leaflet-heatmap'
import { Time } from '../../../../core/client/time.js'
import { Events } from '../../../../core/client/events.js'
import { fetchGeoJson } from '../../utils/utils.features.js'

export const heatmapLayers = {
  methods: {
    async createLeafletHeatmapLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid types
      if (leafletOptions.type !== 'heatmap') return
      const layer = this.createLeafletLayer(options)
      // Optimize templating by creating compilers up-front
      const source = _.get(leafletOptions, 'url')
      const sourceTemplate = _.get(leafletOptions, 'urlTemplate')
      if (sourceTemplate) layer.sourceCompiler = _.template(sourceTemplate)
      const valueTemplate = _.get(leafletOptions, 'valueTemplate')
      if (valueTemplate) layer.valueCompiler = _.template(valueTemplate)

      if (options.service) { // Check for feature service layers
        layer.lastUpdateTime = Time.getCurrentTime().clone()
        const geoJson = await this.getFeatures(options)
        this.updateLeafletHeatmap(layer, geoJson)
      } else if (!_.isNil(source)) {
        // Assume source is an URL returning GeoJson
        const geoJson = await fetchGeoJson(source, options)
        this.updateLeafletHeatmap(layer, geoJson)
      } else if (!_.isNil(sourceTemplate)) {
        // Source is an URL returning GeoJson possibly templated by time
        const sourceToFetch = layer.sourceCompiler({ time: Time.getCurrentTime() })
        layer.lastFetchedSource = sourceToFetch
        const geoJson = await fetchGeoJson(sourceToFetch, options)
        this.updateLeafletHeatmap(layer, geoJson)
      }

      return layer
    },
    updateLeafletHeatmap (layer, geoJson) {
      const valueField = _.get(layer, 'cfg.valueField', 'value')
      const min = _.get(layer, 'cfg.min')
      const max = _.get(layer, 'cfg.max')
      const values = (layer.valueCompiler
        ? geoJson.features.map(feature => _.toNumber(layer.valueCompiler({ properties: feature.properties, feature })))
        : geoJson.features.map(feature => _.toNumber(_.get(feature, `properties.${valueField}`, 1))))
      // By default our intensity is based on the number of points only
      // otherwise when provided we use target value
      layer.setData({
        min: (min || (valueField ? _.min(values) : 0)),
        max: (max || (valueField ? _.max(values) : 1)),
        data: geoJson.features.map((feature, index) => {
          const location = centroid(feature)
          return {
            lng: _.get(location, 'geometry.coordinates[0]'),
            lat: _.get(location, 'geometry.coordinates[1]'),
            [valueField]: values[index]
          }
        })
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
          { service: { $exists: true } }
        ],
        isVisible: true
      }))
      heatmaps.forEach(async options => {
        // Retrieve the layer
        const layer = this.getLeafletLayerByName(options.name)
        if (options.service) { // Check for feature service layers
          // Update only the first time or when required according to data update interval
          if (!layer.lastUpdateTime || !this.shouldSkipFeaturesUpdate(layer.lastUpdateTime, options)) {
            layer.lastUpdateTime = Time.getCurrentTime().clone()
            /* FIXME: we could filter by bbox here to optimize but then if we zoom in/out we should also update the data
            const [[south, west], [north, east]] = this.getBounds()
            const geoJson = await this.getFeatures(_.merge({
              baseQuery: { south, north, west, east }
            }, options)) */
            const geoJson = await this.getFeatures(options)
            this.updateLeafletHeatmap(layer, geoJson)
          }
        } else if (layer.sourceCompiler) {
          const sourceToFetch = layer.sourceCompiler({ time: Time.getCurrentTime() })
          if (!layer.lastFetchedSource || (layer.lastFetchedSource !== sourceToFetch)) {
            layer.lastFetchedSource = sourceToFetch
            const geoJson = await fetchGeoJson(sourceToFetch, options)
            this.updateLeafletHeatmap(layer, geoJson)
          }
        }
      })
    }
  },
  created () {
    this.registerLeafletConstructor(this.createLeafletHeatmapLayer)
    Events.on('time-current-time-changed', this.onCurrentTimeChangedHeatmapLayers)
  },
  beforeUnmount () {
    Events.off('time-current-time-changed', this.onCurrentTimeChangedHeatmapLayers)
  }
}

// Not automatically declared by leaflet plugin
L.heatmap = function (options) {
  return new HeatmapOverlay(options)
}
