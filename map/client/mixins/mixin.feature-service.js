import _ from 'lodash'
import sift from 'sift'
import { getType, getGeom } from '@turf/invariant'
import logger from 'loglevel'
import * as features from '../utils/utils.features.js'

export const featureService = {
  methods: {
    getBaseQueryForFeatures: features.getBaseQueryForFeatures,
    getFilterQueryForFeatures: features.getFilterQueryForFeatures,
    getSortQueryForFeatures: features.getSortQueryForFeatures,
    getFeaturesUpdateInterval: features.getFeaturesUpdateInterval,
    getFeaturesQueryInterval: features.getFeaturesQueryInterval,
    shouldSkipFeaturesUpdate: features.shouldSkipFeaturesUpdate,
    getFeaturesLevel (options) {
      return (this.selectableLevelsLayer && (this.selectableLevelsLayer.name === options.name) ? this.selectedLevel : null)
    },
    getProbeFeatures: features.getProbeFeatures,
    async getProbeFeaturesFromLayer (name) {
      // Retrieve the layer
      const layer = this.getLayerByName(name)
      if (!layer) return
      return this.getProbeFeatures(layer)
    },
    async getFeaturesQuery (options, queryInterval, queryLevel) {
      // If not given try to compute query level from options
      if (!queryLevel) {
        queryLevel = this.getFeaturesLevel(options)
      }
      return features.getFeaturesQuery(options, queryInterval, queryLevel)
    },
    getFeaturesFromQuery: features.getFeaturesFromQuery,
    async getFeatures (options, queryInterval, queryLevel) {
      const query = await this.getFeaturesQuery(options, queryInterval, queryLevel)
      const response = await this.getFeaturesFromQuery(options, query)
      return response
    },
    async getFeaturesFromLayer (name, queryInterval) {
      // Retrieve the layer
      const layer = this.getLayerByName(name)
      if (!layer) return
      return this.getFeatures(layer, queryInterval)
    },
    getMeasureForFeatureBaseQuery (layer, feature) {
      // We might have a different ID to identify measures related to a timeseries (what is called a chronicle)
      // than measures displayed on a map. For instance mobile measures might appear at different locations,
      // but when selecting one we would like to display the timeseries related to all locations.
      let featureId = layer.chronicleId || layer.featureId
      // Support compound ID
      featureId = (Array.isArray(featureId) ? featureId : [featureId])
      const query = featureId.reduce((result, id) =>
        Object.assign(result, { ['properties.' + id]: _.get(feature, 'properties.' + id) }),
      {})
      query.$groupBy = featureId
      return query
    },
    async getMeasureForFeatureQuery (layer, feature, startTime, endTime) {
      const query = await this.getFeaturesQuery(_.merge({
        baseQuery: this.getMeasureForFeatureBaseQuery(layer, feature)
      }, layer), {
        $gte: startTime.toISOString(),
        $lte: endTime.toISOString()
      })
      return query
    },
    async getMeasureForFeatureFromQuery (layer, feature, query) {
      const result = await this.getFeaturesFromQuery(layer, query)
      if (result.features.length > 0) {
        return result.features[0]
      } else {
        return _.cloneDeep(feature)
      }
    },
    async getMeasureForFeature (layer, feature, startTime, endTime) {
      let probedLocation
      this.setCursor('processing-cursor')
      try {
        const query = await this.getMeasureForFeatureQuery(layer, feature, startTime, endTime)
        probedLocation = await this.getMeasureForFeatureFromQuery(layer, feature, query)
      } catch (error) {
        logger.error(error)
      }
      this.unsetCursor('processing-cursor')
      return probedLocation
    },
    checkFeatures: features.checkFeatures,
    createFeatures: features.createFeatures,
    editFeaturesGeometry: features.editFeaturesGeometry,
    editFeaturesProperties: features.editFeaturesProperties,
    removeFeatures: features.removeFeatures,
    onFeaturesUpdated (feature) {
      // We only support single feature edition
      if (!getType(feature) || !getGeom(feature)) return
      // Find related layer
      const layer = this.getLayerById(feature.layer)
      if (!layer || !this.isLayerVisible(layer.name)) return
      // Only possible when not edited by default
      if ((typeof this.isLayerEdited === 'function') && this.isLayerEdited(layer)) return
      // As by default we update the whole layer in fetch and replace mode force add/update only mode
      // Can only apply to realtime layers as we need to force a data refresh
      if (typeof this.updateLayer === 'function') {
        // Check if feature should be filtered or not according to layer base query
        const filteredFeature = [feature].filter(sift(_.omit(layer.baseQuery || {}, ['$skip', '$sort', '$limit', '$select'])))
        if (filteredFeature.length > 0) this.updateLayer(layer.name, feature, { removeMissing: false })
      }
    },
    onFeaturesRemoved (feature) {
      // We only support single feature edition
      if (!getType(feature) || !getGeom(feature)) return
      // Find related layer
      const layer = this.getLayerById(feature.layer)
      if (!layer || !this.isLayerVisible(layer.name)) return
      // Only possible when not edited by default
      if ((typeof this.isLayerEdited === 'function') && this.isLayerEdited(layer)) return
      // Can only apply to realtime layers as we need to force a data refresh
      if (typeof this.updateLayer === 'function') {
        // Check if feature should be filtered or not according to layer base query
        const filteredFeature = [feature].filter(sift(_.omit(layer.baseQuery || {}, ['$skip', '$sort', '$limit', '$select'])))
        if (filteredFeature.length > 0) this.updateLayer(layer.name, feature, { remove: true })
      }
    }
  },
  created () {
    // Extend timeout for large write operations
    this.$api.getService('features').timeout = 60 * 60 * 1000 // 1h should be sufficient since we also have size limits
  },
  mounted () {
    // Listen to user layer changes
    const featuresService = this.$api.getService('features')
    featuresService.on('created', this.onFeaturesUpdated)
    featuresService.on('patched', this.onFeaturesUpdated)
    featuresService.on('removed', this.onFeaturesRemoved)
  },
  beforeUnmount () {
    // Remove event connections
    const featuresService = this.$api.getService('features')
    featuresService.off('created', this.onFeaturesUpdated)
    featuresService.off('patched', this.onFeaturesUpdated)
    featuresService.off('removed', this.onFeaturesRemoved)
  }
}
