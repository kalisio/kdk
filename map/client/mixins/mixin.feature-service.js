import _ from 'lodash'
import sift from 'sift'
import logger from 'loglevel'
import { listenToServiceEvents, unlistenToServiceEvents } from '../../../core/client/utils/index.js'
import * as features from '../utils/utils.features.js'
import * as layers from '../utils/utils.layers.js'

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
      const response = await features.getFeaturesFromQuery(options, query)
      return response
    },
    async getFeaturesFromLayer (name, queryInterval) {
      // Retrieve the layer
      const layer = this.getLayerByName(name)
      if (!layer) return
      return this.getFeatures(layer, queryInterval)
    },
    getMeasureForFeatureBaseQuery: features.getMeasureForFeatureBaseQuery,
    async getMeasureForFeatureQuery (layer, feature, startTime, endTime) {
      const query = await this.getFeaturesQuery(_.merge({
        baseQuery: features.getMeasureForFeatureBaseQuery(layer, feature)
      }, layer), {
        $gte: startTime.toISOString(),
        $lte: endTime.toISOString()
      })
      return query
    },
    getMeasureForFeatureFromQuery: features.getMeasureForFeatureFromQuery,
    async getMeasureForFeature (layer, feature, startTime, endTime) {
      let probedLocation
      this.setCursor('processing-cursor')
      try {
        const query = await this.getMeasureForFeatureQuery(layer, feature, startTime, endTime)
        probedLocation = await features.getMeasureForFeatureFromQuery(layer, feature, query)
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
    onFeatureUpdated (feature, layer) {
      // Find related layer, either directly given in feature if coming from user-defined features service
      // otherwise bound to the listener for features services attached to a built-in layer
      if (!layer && feature.layer) layer = this.getLayerById(feature.layer)
      if (!layer || !this.isLayerVisible(layer.name)) return
      // Only possible when not edited by default
      if ((typeof this.isLayerEdited === 'function') && this.isLayerEdited(layer)) return
      // Check for time-based layers if update is in the currently visualized time range
      // so that we don't add too much old features
      if (!features.isFeatureInQueryInterval(feature, layer)) return
      // As by default we update the whole layer in fetch and replace mode force add/update only mode
      // Can only apply to realtime layers as we need to force a data refresh
      if (typeof this.updateLayer === 'function') {
        // Check if feature should be filtered or not according to layer base query
        const filteredFeature = [feature].filter(sift(_.omit(layer.baseQuery || {}, ['$skip', '$sort', '$limit', '$select'])))
        if (filteredFeature.length > 0) this.updateLayer(layer.name, feature, { removeMissing: false })
      }
    },
    onFeatureRemoved (feature, layer) {
      // Find related layer, either directly given in feature if coming from user-defined features service
      // otherwise bound to the listener for features services attached to a built-in layer
      if (!layer && feature.layer) layer = this.getLayerById(feature.layer)
      if (!layer || !this.isLayerVisible(layer.name)) return
      // Only possible when not edited by default
      if ((typeof this.isLayerEdited === 'function') && this.isLayerEdited(layer)) return
      // Check for time-based layers if update is in the currently visualized time range ? Should not be relevent in this case. 
      // Indeed, as time has passed we might have old features that need to be cleaned,
      // ie features now outside the request time range but inside the initial time range when they were requested
      //if (!features.isFeatureInQueryInterval(feature, layer)) return
      // Can only apply to realtime layers as we need to force a data refresh
      if (typeof this.updateLayer === 'function') {
        // Check if feature should be filtered or not according to layer base query
        const filteredFeature = [feature].filter(sift(_.omit(layer.baseQuery || {}, ['$skip', '$sort', '$limit', '$select'])))
        if (filteredFeature.length > 0) this.updateLayer(layer.name, feature, { remove: true })
      }
    },
    listenToFeaturesServiceEventsForLayer (layer) {
      const listeners = features.listenToFeaturesServiceEventsForLayer(layer, {
        created: this.onFeatureUpdated, updated: this.onFeatureUpdated, patched: this.onFeatureUpdated, removed: this.onFeatureRemoved
      }, this.layerServiceEventListeners[layer._id])
      if (listeners) this.layerServiceEventListeners[layer._id] = listeners
    },
    unlistenToFeaturesServiceEventsForLayer (layer) {
      features.unlistenToFeaturesServiceEventsForLayer(layer, this.layerServiceEventListeners[layer._id])
      delete this.layerServiceEventListeners[layer._id]
    },
    listenToFeaturesServiceEventsForLayers () {
      this.layerServiceEventListeners = {}
      _.forEach(this.getLayers(), this.listenToFeaturesServiceEventsForLayer)
    },
    unlistenToFeaturesServiceEventsForLayers () {
      _.forOwn(this.layerServiceEventListeners, this.unlistenToFeaturesServiceEventsForLayer)
      this.layerServiceEventListeners = {}
    }
  },
  created () {
    // Extend timeout for large write operations
    this.$api.getService('features').timeout = 60 * 60 * 1000 // 1h should be sufficient since we also have size limits
  },
  mounted () {
    // Here we need to listen to service events for all realtime layers
    this.listenToFeaturesServiceEventsForLayers()
    // As we don't know target services upfront we register listeners when layer are added, we track it in a map
    this.$engineEvents.on('layer-added', this.listenToFeaturesServiceEventsForLayer)
    this.$engineEvents.on('layer-removed', this.unlistenToFeaturesServiceEventsForLayer)
    // Target online/offline service depending on status
    this.$events.on('navigator-disconnected', this.listenToFeaturesServiceEventsForLayers)
    this.$events.on('navigator-reconnected', this.listenToFeaturesServiceEventsForLayers)
    this.$events.on('websocket-disconnected', this.listenToFeaturesServiceEventsForLayers)
    this.$events.on('websocket-reconnected', this.listenToFeaturesServiceEventsForLayers)
  },
  beforeUnmount () {
    // Remove all listeners
    this.unlistenToFeaturesServiceEventsForLayers()
    this.$engineEvents.off('layer-added', this.listenToFeaturesServiceEventsForLayer)
    this.$engineEvents.off('layer-removed', this.unlistenToFeaturesServiceEventsForLayer)
    this.$events.off('navigator-disconnected', this.listenToFeaturesServiceEventsForLayers)
    this.$events.off('navigator-reconnected', this.listenToFeaturesServiceEventsForLayers)
    this.$events.off('websocket-disconnected', this.listenToFeaturesServiceEventsForLayers)
    this.$events.off('websocket-reconnected', this.listenToFeaturesServiceEventsForLayers)
  }
}
