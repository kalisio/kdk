import Cesium from 'cesium/Source/Cesium.js'
import _ from 'lodash'
import logger from 'loglevel'
import sift from 'sift'
import { uid } from 'quasar'
import { Time } from '../../../../core/client/time.js'
import { fetchGeoJson, getFeatureId, processFeatures, getFeatureStyleType, isInMemoryLayer } from '../../utils.js'
import { convertSimpleStyleToPointStyle, convertSimpleStyleToLineStyle, convertSimpleStyleToPolygonStyle } from '../../utils/utils.style.js'
import { convertToCesiumFromSimpleStyle, getPointSimpleStyle, getLineSimpleStyle, getPolygonSimpleStyle } from '../../cesium/utils/utils.style.js'

function getWallEntityId (id) {
  return id + '-wall'
}

function updateGeoJsonEntity(source, destination) {
  destination.position = source.position
  destination.orientation = source.orientation
  destination.properties = source.properties
  destination.description = source.description
  // Points
  if (source.billboard) destination.billboard = source.billboard
  // Lines
  if (source.polyline) destination.polyline = source.polyline
  // Polygons
  if (source.polygon) destination.polygon = source.polygon
}

export const geojsonLayers = {
  methods: {
    convertFromSimpleStyleOrDefaults (properties) {
      let { stroke, strokeWidth, fill } = convertToCesiumFromSimpleStyle(properties)
      if (!stroke) stroke = Cesium.GeoJsonDataSource.stroke
      if (!strokeWidth) strokeWidth = Cesium.GeoJsonDataSource.strokeWidth
      if (!fill) fill = Cesium.GeoJsonDataSource.fill
      return { stroke, strokeWidth, fill }
    },
    async loadGeoJson (dataSource, geoJson, options, updateOptions = {}) {
      const cesiumOptions = options.cesium
      // Remove mode
      if (_.get(updateOptions, 'remove', false)) {
        let features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
        features.forEach(feature => {
          const id = getFeatureId(feature, options)
          const wallId = getWallEntityId(id)
          if (dataSource.entities.getById(id)) dataSource.entities.removeById(id)
          // Take care that in case of a wall entity we add it in addition to the original line
          if (dataSource.entities.getById(wallId)) dataSource.entities.removeById(wallId)
        })
        return
      }
      // We use a separated source in order to load data otherwise Cesium will replace previous ones, causing flickering
      const loadingDataSource = new Cesium.GeoJsonDataSource()
      loadingDataSource.notFromDrop = true
      await loadingDataSource.load(geoJson, cesiumOptions)
      // Now we process loaded entities to merge with existing ones if any or add new ones
      let entities = loadingDataSource.entities.values
      entities.forEach(entity => {
        const previousEntity = dataSource.entities.getById(entity.id)
        if (previousEntity) updateGeoJsonEntity(entity, previousEntity)
        else dataSource.entities.add(entity)
      })
      // Remove any entity not existing anymore
      if (_.get(updateOptions, 'removeMissing', cesiumOptions.removeMissing)) {
        dataSource.entities.values.forEach(entity => {
          const id = entity.id
          const wallId = getWallEntityId(id)
          if (!loadingDataSource.entities.getById(id)) dataSource.entities.removeById(id)
          // Take care that in case of a wall entity we add it in addition to the original line
          if (dataSource.entities.getById(wallId)) dataSource.entities.removeById(wallId)
        })
      }
      // Process specific entities
      entities = dataSource.entities.values
      const entitiesToAdd = []
      const entitiesToRemove = []
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        const properties = entity.properties.getValue(0)
        // Circles
        const radius = _.get(properties, 'radius')
        const geodesic = _.get(properties, 'geodesic')
        if (radius && geodesic) {
          const { stroke, strokeWidth, fill } = this.convertFromSimpleStyleOrDefaults(properties)
          // This one will replace the original point
          entitiesToAdd.push({
            id: entity.id,
            position: entity.position.getValue(0),
            name: entity.name ? entity.name : entity.id,
            description: entity.description.getValue(0),
            properties: entity.properties.getValue(0),
            ellipse: {
              semiMinorAxis: radius,
              semiMajorAxis: radius,
              material: new Cesium.ColorMaterialProperty(fill),
              outlineColor: new Cesium.ConstantProperty(stroke),
              outlineWidth: strokeWidth,
              outline: new Cesium.ConstantProperty(true)
            }
          })
          entitiesToRemove.push(entity)
        }
        // Walls
        const wall = _.get(properties, 'wall')
        if (wall && entity.polyline) {
          const { stroke, strokeWidth, fill } = this.convertFromSimpleStyleOrDefaults(properties)
          // Simply push the entity, other options like font will be set using styling options
          // This one will come in addition to the original line
          const wallId = getWallEntityId(entity.id)
          entitiesToAdd.push({
            id: wallId,
            parent: entity,
            name: entity.name ? entity.name : wallId,
            description: entity.description.getValue(0),
            properties: entity.properties.getValue(0),
            wall: {
              positions: entity.polyline.positions.getValue(0),
              material: new Cesium.ColorMaterialProperty(fill),
              outlineColor: new Cesium.ConstantProperty(stroke),
              outlineWidth: strokeWidth,
              outline: new Cesium.ConstantProperty(true)
            }
          })
        }
        // Billboard with 'none' shape should be removed as Cesium creates it even if the maki icon id is unknown
        if (entity.billboard && (_.get(properties, 'marker-symbol') === 'none')) {
          entitiesToRemove.push(entity)
        }
        // Labels
        const text = _.get(properties, 'icon-text')
        if (text) {
          const { stroke, strokeWidth, fill } = this.convertFromSimpleStyleOrDefaults(properties)
          // Simply push the entity, other options like font will be set using styling options
          // This one will replace the original point
          entitiesToAdd.push({
            id: entity.id,
            position: entity.position.getValue(0),
            name: entity.name ? entity.name : entity.id,
            description: entity.description.getValue(0),
            properties: entity.properties.getValue(0),
            label: {
              text,
              fillColor: new Cesium.ConstantProperty(fill),
              outlineColor: new Cesium.ConstantProperty(stroke),
              outlineWidth: strokeWidth
            }
          })
          entitiesToRemove.push(entity)
        }
      }
      entitiesToRemove.forEach(entity => dataSource.entities.remove(entity))
      entitiesToAdd.forEach(entity => dataSource.entities.add(entity))
    },
    async updateGeoJsonData (dataSource, options, geoJson, updateOptions = {}) {
      // As we have async operations during the whole whole loading process avoid reentrance
      // otherwise we might have interleaved calls leading to doublon entities being created
      //if (dataSource.updatingGeoJsonData) return
      //dataSource.updatingGeoJsonData = true
      const cesiumOptions = options.cesium
      const source = _.get(cesiumOptions, 'source')
      const sourceTemplate = _.get(cesiumOptions, 'sourceTemplate')
      try {
        if (geoJson) {
          if (options.processor) processFeatures(geoJson, options.processor)
          await this.loadGeoJson(dataSource, geoJson, options, updateOptions)
        } else if (options.probeService) {
          await this.loadGeoJson(dataSource, this.getProbeFeatures(options), options, updateOptions)
          await this.loadGeoJson(dataSource, this.getFeatures(options), options, updateOptions)
        } else if (options.service) { // Check for feature service layers only, in this case update in place
          // If no probe reference, nothing to be initialized
          await this.loadGeoJson(dataSource, this.getFeatures(options), options, updateOptions)
        } else if (sourceTemplate) {
          const sourceToFetch = dataSource.sourceCompiler({ time: Time.getCurrentTime() })
          if (!dataSource.lastFetchedSource || (dataSource.lastFetchedSource !== sourceToFetch)) {
            dataSource.lastFetchedSource = sourceToFetch
            await this.loadGeoJson(dataSource, fetchGeoJson(sourceToFetch, options), options, updateOptions)
          }
        } else if (!_.isNil(source)) {
          // Assume source is an URL returning GeoJson
          await this.loadGeoJson(dataSource, fetchGeoJson(source, options), options, updateOptions)
        }
        this.applyStyle(dataSource.entities, options)
        if (typeof this.applyTooltips === 'function') this.applyTooltips(dataSource.entities, options)
      } catch (error) {
        logger.error(error)
      }
      //delete dataSource.updatingGeoJsonData
    },
    async createCesiumRealtimeGeoJsonLayer (dataSource, options) {
      const cesiumOptions = options.cesium
      // Add update capabilities
      dataSource.updateGeoJson = async (geoJson, updateOptions) => {
        await this.updateGeoJsonData(dataSource, options, geoJson, updateOptions)
      }
      // Add source compiler if required
      if (_.has(cesiumOptions, 'sourceTemplate')) {
        dataSource.sourceCompiler = _.template(_.get(cesiumOptions, 'sourceTemplate'))
      }
    },
    async createCesiumGeoJsonLayer (options) {
      const cesiumOptions = options.cesium
      // Check for valid type
      if (cesiumOptions.type !== 'geoJson') return
      const engine = _.get(this, 'activityOptions.engine')
      options.processor = (feature) => {
        // File import
        if (!options.featureId && !feature._id) feature._id = uid().toString()
        // Cesium expect id to be in a 'id' property
        feature.id = getFeatureId(feature, options)
        // We cannot access data outside the properties object of a feature in Cesium
        // As a consequence we copy back any style information inside
        const styleType = getFeatureStyleType(feature)
        // We need to convert to simple-style spec as cesium manages this only
        let simpleStyle
        if (styleType === 'point') simpleStyle = getPointSimpleStyle(feature, options, engine)
        else if (styleType === 'line') simpleStyle = getLineSimpleStyle(feature, options, engine)
        else simpleStyle = getPolygonSimpleStyle(feature, options, engine)
        if (!feature.properties) feature.properties = simpleStyle
        else Object.assign(feature.properties, simpleStyle)
      }
      // For activities
      if (_.has(this, 'activityOptions.engine.cluster')) {
        if (cesiumOptions.cluster) Object.assign(cesiumOptions.cluster, _.get(this, 'activityOptions.engine.cluster'))
        else cesiumOptions.cluster = Object.assign({}, _.get(this, 'activityOptions.engine.cluster'))
      }
      // Optimize templating by creating compilers up-front
      const layerStyleTemplate = _.get(cesiumOptions, 'template')
      if (layerStyleTemplate) {
        // We allow to template style properties according to feature, because it can be slow you have to specify a subset of properties
        cesiumOptions.template = layerStyleTemplate.map(property => ({
          property, compiler: _.template(_.get(cesiumOptions, property))
        }))
      }
      const entityStyleTemplate = _.get(cesiumOptions, 'entityStyle.template')
      if (entityStyleTemplate) {
        // We allow to template style properties according to feature, because it can be slow you have to specify a subset of properties
        _.set(cesiumOptions, 'entityStyleTemplate', entityStyleTemplate.map(property => ({
          property, compiler: _.template(_.get(cesiumOptions, `entityStyle.${property}`))
        })))
      }
      const popupTemplate = _.get(cesiumOptions, 'popup.template')
      if (popupTemplate) {
        cesiumOptions.popup.compiler = _.template(popupTemplate)
      }
      const tooltipTemplate = _.get(cesiumOptions, 'tooltip.template')
      if (tooltipTemplate) {
        cesiumOptions.tooltip.compiler = _.template(tooltipTemplate)
      }
      // Convert and store the style
      if (cesiumOptions.style) {
        cesiumOptions.layerPointStyle = _.get(cesiumOptions.style, 'point')
        cesiumOptions.layerLineStyle = _.get(cesiumOptions.style, 'line')
        cesiumOptions.layerPolygonStyle = _.get(cesiumOptions.style, 'polygon')
      } else {
        cesiumOptions.layerPointStyle = convertSimpleStyleToPointStyle(cesiumOptions)
        cesiumOptions.layerLineStyle = convertSimpleStyleToLineStyle(cesiumOptions)
        cesiumOptions.layerPolygonStyle = convertSimpleStyleToPolygonStyle(cesiumOptions)
      }
      // Perform required conversion from JSON to Cesium objects
      // If templating occurs we need to wait until it is performed to convert to Cesium objects
      if (cesiumOptions.entityStyle && !entityStyleTemplate) cesiumOptions.entityStyle = this.convertToCesiumObjects(cesiumOptions.entityStyle)
      if (cesiumOptions.clusterStyle) cesiumOptions.clusterStyle = this.convertToCesiumObjects(cesiumOptions.clusterStyle)
      if (cesiumOptions.tooltip) cesiumOptions.tooltip = this.convertToCesiumObjects(cesiumOptions.tooltip)
      if (cesiumOptions.popup) cesiumOptions.popup = this.convertToCesiumObjects(cesiumOptions.popup)

      const source = _.get(cesiumOptions, 'source')
      let dataSource = source
      if (dataSource) {
        // Check if data source already added to the scene and we only want to
        // create a layer on top of it or if we have to load it
        // Indeed loading a file by drop makes Cesium load it under the hood
        for (let i = 0; i < this.viewer.dataSources.length; i++) {
          const currentSource = this.viewer.dataSources.get(i)
          if (currentSource.name === dataSource) {
            dataSource = currentSource
            this.viewer.dataSources.remove(currentSource, false)
            break
          }
        }
      }
      // If we already have a source we simply use it otherwise we create/load it
      if (!dataSource || !dataSource.name) {
        dataSource = new Cesium.GeoJsonDataSource()
        dataSource.notFromDrop = true
        // Check for realtime layers
        if (cesiumOptions.realtime) {
          await this.createCesiumRealtimeGeoJsonLayer(dataSource, options)
        }
        this.updateGeoJsonData(dataSource, options)
      } else {
        this.applyStyle(dataSource.entities, options)
        if (typeof this.applyTooltips === 'function') this.applyTooltips(dataSource.entities, options)
      }
      if (cesiumOptions.cluster) {
        // Set default cluster options
        _.assign(dataSource.clustering, {
          enabled: true,
          pixelRange: 100,
          minimumClusterSize: 3,
          clusterBillboards: true,
          clusterLabels: true,
          clusterPoints: true
        }, cesiumOptions.cluster)
        dataSource.clustering.clusterEvent.addEventListener(
          (entities, cluster) => this.applyClusterStyle(entities, cluster, options)
        )
      }
      return dataSource
    },
    getGeoJsonOptions (options) {
      return _.get(this, 'activityOptions.engine.featureStyle', {})
    },
    async updateLayer (name, geoJson, updateOptions = {}) {
      // Retrieve the layer
      const layer = this.getCesiumLayerByName(name)
      if (!layer) return // Cannot update invisible layer
      if (typeof layer.updateGeoJson === 'function') layer.updateGeoJson(geoJson, updateOptions)

      // We keep geojson data for in memory layer in a cache since
      // these layers will be destroyed when hidden. We need to be able to restore
      // them when they get shown again
      const baseLayer = this.getLayerByName(name)
      if (isInMemoryLayer(baseLayer)) {
        this.geojsonCache[name] = geoJson
      }
    },
    onCurrentTimeChangedGeoJsonLayers (time) {
      const geoJsonlayers = _.values(this.layers).filter(sift({
        'cesium.type': 'geoJson',
        'cesium.realtime': true,
        $or: [ // Supported by template URL or time-based features
          { 'cesium.sourceTemplate': { $exists: true } },
          { service: { $exists: true } }
        ],
        isVisible: true
      }))
      geoJsonlayers.forEach(async geoJsonlayer => {
        // Retrieve the layer
        const dataSource = this.getCesiumLayerByName(geoJsonlayer.name)
        // Update only the first time or when required according to data update interval
        if (!dataSource.lastUpdateTime || !this.shouldSkipFeaturesUpdate(dataSource.lastUpdateTime, geoJsonlayer)) {
          dataSource.lastUpdateTime = Time.getCurrentTime().clone()
          dataSource.updateGeoJson()
        }
      })
    },
    onLayerShownGeoJsonLayers (layer, engineLayer) {
      // Check if we have cached geojson data for this layer
      const cachedGeojson = this.geojsonCache[layer.name]
      if (cachedGeojson) {
        if (isInMemoryLayer(layer)) {
          // Restore geojson data for in-memory layers that was hidden
          this.updateLayer(layer.name, cachedGeojson)
        } else {
          // Clear cache since layer is not in memory anymore
          delete this.geojsonCache[layer.name]
        }
      }
    },
    onLayerRemovedGeoJsonLayers (layer) {
      // Remove cached geojson data if any
      if (_.has(this.geojsonCache, layer.name)) {
        delete this.geojsonCache[layer.name]
      }
    }
  },
  created () {
    this.registerCesiumConstructor(this.createCesiumGeoJsonLayer)
    this.$events.on('time-current-time-changed', this.onCurrentTimeChangedGeoJsonLayers)
    this.$engineEvents.on('layer-shown', this.onLayerShownGeoJsonLayers)
    this.$engineEvents.on('layer-removed', this.onLayerRemovedGeoJsonLayers)
    // Map of currently updated layers to avoid reentrance with real-time events as
    // we are not able to perform in place update and required to pull the data
    this.updatingGeoJsonData = {}
    // Cache where we'll store geojson data for in memory layers we'll hide
    this.geojsonCache = {}
  },
  beforeUnmount () {
    this.$events.off('time-current-time-changed', this.onCurrentTimeChangedHeatmapLayers)
    this.$engineEvents.off('layer-shown', this.onLayerShownGeoJsonLayers)
    this.$engineEvents.off('layer-removed', this.onLayerRemovedGeoJsonLayers)

    this.geojsonCache = {}
  }
}
