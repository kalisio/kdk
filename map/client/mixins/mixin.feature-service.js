import _ from 'lodash'
import sift from 'sift'
import { getType, getGeom } from '@turf/invariant'
import logger from 'loglevel'
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
    onFeaturesUpdated (feature, layerId) {
      // We only support single feature edition
      if (!getType(feature) || !getGeom(feature)) return
      // Find related layer, either directly given in feature if coming from user-defined features service
      // otherwise bound to the listener for features services attached to a built-in layer
      const layer = ((typeof layerId === 'string') ? this.getLayerById(layerId) : this.getLayerById(feature.layer))
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
    onFeaturesRemoved (feature, layerId) {
      // We only support single feature edition
      if (!getType(feature) || !getGeom(feature)) return
      // Find related layer, either directly given in feature if coming from user-defined features service
      // otherwise bound to the listener for features services attached to a built-in layer
      const layer = ((typeof layerId === 'string') ? this.getLayerById(layerId) : this.getLayerById(feature.layer))
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
    listenToFeaturesServiceEvents () {
      this.featuresService = this.$api.getService('features')
      this.featuresService.on('created', this.onFeaturesUpdated)
      this.featuresService.on('patched', this.onFeaturesUpdated)
      this.featuresService.on('removed', this.onFeaturesRemoved)
    },
    listenToFeaturesServiceEventsForLayer (layer) {
      // User-defined layers are already managed
      if (!layer.service || !layer.serviceEvents || layers.isInMemoryLayer(layer) || layers.isFeatureLayer(layer)) return
      const service = this.$api.getService(layer.service)
      // Check if service available and not already registered
      if (!service || this.layerServiceEventListeners[layer._id]) return
      // Generate listeners targetting the right layer as in this case the features won't hold it contrary to user-defined layers
      const onFeaturesUpdated = (feature) => this.onFeaturesUpdated(feature, layer._id)
      const onFeaturesRemoved = (feature) => this.onFeaturesRemoved(feature, layer._id)
      this.layerServiceEventListeners[layer._id] = { service, onFeaturesUpdated, onFeaturesRemoved }
      service.on('created', onFeaturesUpdated)
      service.on('patched', onFeaturesUpdated)
      service.on('removed', onFeaturesRemoved)
    },
    listenToFeaturesServiceEventsForLayers () {
      this.layerServiceEventListeners = {}
      _.forOwn(this.getLayers(), this.listenToFeaturesServiceEventsForLayer)
    },
    unlistenToFeaturesServiceEvents () {
      if (!this.featuresService) this.featuresService = this.$api.getService('features')
      this.featuresService.off('created', this.onFeaturesUpdated)
      this.featuresService.off('patched', this.onFeaturesUpdated)
      this.featuresService.off('removed', this.onFeaturesRemoved)
    },
    unlistenToFeaturesServiceEventsForLayer (layer) {
      // Check if listeners are registered for layer
      if (!this.layerServiceEventListeners[layer._id]) return
      const { service, onFeaturesUpdated, onFeaturesRemoved } = this.layerServiceEventListeners[layer._id]
      service.off('created', onFeaturesUpdated)
      service.off('patched', onFeaturesUpdated)
      service.off('removed', onFeaturesRemoved)
      delete this.layerServiceEventListeners[layer._id]
    },
    unlistenToFeaturesServiceEventsForLayers () {
      _.forOwn(this.layerServiceEventListeners, listeners => {
        const { service, onFeaturesUpdated, onFeaturesRemoved } = listeners
        service.off('created', onFeaturesUpdated)
        service.off('patched', onFeaturesUpdated)
        service.off('removed', onFeaturesRemoved)
      })
      this.layerServiceEventListeners = {}
    },
    resetFeaturesServiceEventsListeners () {
      this.unlistenToFeaturesServiceEvents()
      this.unlistenToFeaturesServiceEventsForLayers()
      this.listenToFeaturesServiceEvents()
      this.listenToFeaturesServiceEventsForLayers()
    }
  },
  created () {
    // Extend timeout for large write operations
    this.$api.getService('features').timeout = 60 * 60 * 1000 // 1h should be sufficient since we also have size limits
  },
  mounted () {
    // Here we need to listen to service events for all realtime layers triggered by it
    // 1) user-defined layers targetting the features service
    this.listenToFeaturesServiceEvents()
    // 2) built-in layers targetting specific services
    // As we don't know target services upfront we register listeners when layer are added, we track it in a map
    this.listenToFeaturesServiceEventsForLayers()
    this.$engineEvents.on('layer-added', this.listenToFeaturesServiceEventsForLayer)
    this.$engineEvents.on('layer-removed', this.unlistenToFeaturesServiceEventsForLayer)
    // Target online/offline service depending on status
    this.$events.on('navigator-disconnected', this.resetFeaturesServiceEventsListeners)
    this.$events.on('navigator-reconnected', this.resetFeaturesServiceEventsListeners)
  },
  beforeUnmount () {
    // Remove all listeners
    this.unlistenToFeaturesServiceEvents()
    this.unlistenToFeaturesServiceEventsForLayers()
    this.$engineEvents.off('layer-added', this.listenToFeaturesServiceEventsForLayer)
    this.$engineEvents.off('layer-removed', this.unlistenToFeaturesServiceEventsForLayer)
    this.$events.off('navigator-disconnected', this.resetFeaturesServiceEventsListeners)
    this.$events.off('navigator-reconnected', this.resetFeaturesServiceEventsListeners)
  }
}
