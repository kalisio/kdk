import { GeoJsonDataSource, ColorMaterialProperty, ConstantProperty } from 'cesium'
import _ from 'lodash'
import logger from 'loglevel'
import sift from 'sift'
import { uid } from 'quasar'
import { Time, Units } from '../../../../core.client.js'
import { fetchGeoJson, getFeatureId, processFeatures, getFeatureStyleType, isInMemoryLayer } from '../../utils.js'
import { convertSimpleStyleToPointStyle, convertSimpleStyleToLineStyle, convertSimpleStyleToPolygonStyle } from '../../utils/utils.style.js'
import { convertToCesiumFromSimpleStyle, getPointSimpleStyle, getLineSimpleStyle, getPolygonSimpleStyle, convertToCesiumFromStyle } from '../../cesium/utils/utils.style.js'
import { createPrimitiveWithMovingTexture, findPrimitiveForEntity } from '../../cesium/utils/utils.cesium.js'

// Custom entity types that can be created from a base entity like eg a polyline
const CustomTypes = ['wall', 'corridor']
// Generate an id for a custom entity type, eg 'wall'
function getCustomEntityId (id, type) {
  return `${id}-${type}`
}
// Generate original id from a custom id
function getOriginalEntityId (customId, type) {
  const suffix = `-${type}`
  return customId.endsWith(suffix) ? customId.slice(0, -suffix.length) : ''
}

function addCustomPrimitive (activity, dataSource, id, primitive, material) {
  const oldCustom = dataSource.primitives.get(id)
  if (oldCustom) {
    activity.viewer.scene.primitives.remove(oldCustom.primitive)
    const index = activity.cesiumMaterials.indexOf(oldCustom.material)
    activity.cesiumMaterials.splice(index, 1)
  }
  dataSource.primitives.set(id, { primitive, material })
  activity.viewer.scene.primitives.add(primitive)
  activity.cesiumMaterials.push(material)
}

function removeCustomPrimitiveById (activity, dataSource, id) {
  const custom = dataSource.primitives.get(id)
  if (custom) {
    activity.viewer.scene.primitives.remove(custom.primitive)
    const index = activity.cesiumMaterials.indexOf(custom.material)
    activity.cesiumMaterials.splice(index, 1)
    dataSource.primitives.delete(id)
  }
}

function updateGeoJsonEntity (source, destination) {
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
  emits: [
    'layer-updated'
  ],
  methods: {
    convertFromSimpleStyleOrDefaults (properties) {
      let { stroke, strokeWidth, fill } = convertToCesiumFromSimpleStyle(properties)
      if (!stroke) stroke = GeoJsonDataSource.stroke
      if (!strokeWidth) strokeWidth = GeoJsonDataSource.strokeWidth
      if (!fill) fill = GeoJsonDataSource.fill
      return { stroke, strokeWidth, fill }
    },
    async loadGeoJson (dataSource, geoJson, options, updateOptions = {}) {
      const cesiumOptions = options.cesium
      // Remove mode
      if (_.get(updateOptions, 'remove', false)) {
        const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])

        features.forEach(feature => {
          const id = getFeatureId(feature, options)
          CustomTypes.forEach(type => {
            const customId = getCustomEntityId(id, type)
            if (dataSource.entities.getById(id)) dataSource.entities.removeById(id)
            // Take care that in case of a custom entity we add it in addition to or instead the original line
            if (dataSource.entities.getById(customId)) dataSource.entities.removeById(customId)
            // These are special primitives created to support animated walls & corridors
            removeCustomPrimitiveById(this, dataSource, customId)
          })
        })

        return
      }

      // Apply Cesium entityStyle from style and geometry properties
      // Can change feature geometry in some cases
      // Can create new features in some cases
      //  e.g. Cesium does not support stroke on "clampedToGround" polygons, so a new PolyLine is created to act as stroke
      geoJson = await geoJson
      if (geoJson) {
        _.forEach(_.get(geoJson, 'features', []), feature => {
          // Create style for each feature to store specific feature style
          if (!_.get(feature, 'style')) {
            _.set(feature, 'style', {})
          }

          // Use feature style to create entityStyle and additionalFeatures if needed
          const cesiumStyle = convertToCesiumFromStyle(feature, options)
          _.mergeWith(feature, _.get(cesiumStyle, 'convertedStyle', {}), (objValue, srcValue) => {
            if (_.isArray(objValue)) return srcValue
          })
          _.set(geoJson, 'features', _.concat(_.get(geoJson, 'features', []), _.get(cesiumStyle, 'additionalFeatures', [])))
        })
      }

      // We use a separated source in order to load data otherwise Cesium will replace previous ones, causing flickering
      const loadingDataSource = new GeoJsonDataSource()
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
          CustomTypes.forEach(type => {
            const customId = getCustomEntityId(id, type)
            if (!loadingDataSource.entities.getById(id)) dataSource.entities.removeById(id)
            // Take care that in case of a custom entity we add it in addition to or instead the original line
            if (dataSource.entities.getById(customId)) dataSource.entities.removeById(customId)
          })
        })
        // Cleanup custom primitives if needed too
        for (const id of dataSource.primitives.keys()) {
          CustomTypes.forEach(type => {
            const entityId = getOriginalEntityId(id, type)
            if (entityId && !loadingDataSource.entities.contains(entityId))
              removeCustomPrimitiveById(this, dataSource, id)
          })
        }
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
              material: new ColorMaterialProperty(fill),
              outlineColor: new ConstantProperty(stroke),
              outlineWidth: strokeWidth,
              outline: new ConstantProperty(true)
            }
          })
          entitiesToRemove.push(entity)
        }
        // Walls
        const wall = _.get(properties, 'wall') || _.get(properties, 'entityStyle.wall')
        if (wall && entity.polyline) {
          const { stroke, strokeWidth, fill } = this.convertFromSimpleStyleOrDefaults(properties)
          // Simply push the entity, other options like font will be set using styling options
          // This one will come in addition to the original line
          const wallId = getCustomEntityId(entity.id, 'wall')

          const texture = _.get(properties, 'entityStyle.wall.material.image')
          if (texture && _.get(properties, 'entityStyle.wall.animateMaterialAlongPath', false)) {
            const options = _.get(properties, 'entityStyle.wall')
            options.positions = entity.polyline.positions.getValue(0)
            const { primitive, material } = createPrimitiveWithMovingTexture('wall', options)
            if (primitive) {
              addCustomPrimitive(this, dataSource, wallId, primitive, material)
            }
            entitiesToRemove.push(entity)
          } else {
            entitiesToAdd.push({
              id: wallId,
              parent: entity,
              name: entity.name ? entity.name : wallId,
              description: entity.description.getValue(0),
              properties: entity.properties.getValue(0),
              wall: {
                positions: entity.polyline.positions.getValue(0),
                material: new ColorMaterialProperty(fill),
                outlineColor: new ConstantProperty(stroke),
                outlineWidth: strokeWidth,
                outline: new ConstantProperty(true)
              }
            })
          }
        }
        // Corridors
        const corridor = _.get(properties, 'corridor') || _.get(properties, 'entityStyle.corridor')
        if (corridor && entity.polyline) {
          const { stroke, strokeWidth, fill } = this.convertFromSimpleStyleOrDefaults(properties)
          // Simply push the entity, other options like width be set using styling options
          // This one will come in replacement to the original line
          const corridorId = getCustomEntityId(entity.id, 'corridor')

          const texture = _.get(properties, 'entityStyle.corridor.material.image')
          if (texture && _.get(properties, 'entityStyle.corridor.animateMaterialAlongPath', false)) {
            const options = _.get(properties, 'entityStyle.corridor')
            options.positions = entity.polyline.positions.getValue(0)
            const { primitive, material } = createPrimitiveWithMovingTexture('corridor', options)
            if (primitive) {
              addCustomPrimitive(this, dataSource, corridorId, primitive, material)
            }
            entitiesToRemove.push(entity)
          } else {
            entitiesToAdd.push({
              id: corridorId,
              parent: entity,
              name: entity.name ? entity.name : corridorId,
              description: entity.description.getValue(0),
              properties: entity.properties.getValue(0),
              corridor: {
                positions: entity.polyline.positions.getValue(0),
                material: new ColorMaterialProperty(fill),
                outlineColor: new ConstantProperty(stroke),
                outlineWidth: strokeWidth,
                outline: new ConstantProperty(true)
              }
            })
            entitiesToRemove.push(entity)
          }
        }
        // Billboard with 'none' shape should be removed as Cesium creates it even if the maki icon id is unknown
        if (entity.billboard && (_.get(properties, 'marker-symbol') === 'none')) {
          entitiesToRemove.push(entity)
        }
        // Labels
        const text = _.get(properties, 'icon-text') || _.get(properties, 'entityStyle.label.text')
        const billboardImage = _.get(properties, 'entityStyle.billboard.image')
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
              fillColor: new ConstantProperty(fill),
              outlineColor: new ConstantProperty(stroke),
              outlineWidth: strokeWidth
            },
            billboard: billboardImage ? { image: billboardImage } : undefined
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
        // We need to convert to simple-style spec as cesium manages this only
        // We also need to merge all styling properties as some entities requires eg both line/polygon style (wall polylines or corridor polygons)
        const stylePerType = {
          Point: getPointSimpleStyle(feature, options, engine),
          LineString: getLineSimpleStyle(feature, options, engine),
          Polygon: getPolygonSimpleStyle(feature, options, engine)
        }

        // Apply the style according to the feature type to the end to prevent overriding
        const type = getFeatureStyleType(feature)
        const simpleStyle = Object.assign(...Object.values(stylePerType), stylePerType[type])

        // Manage our extended simple-style spec
        const text = _.get(feature, 'style.text.label')
        if (text) simpleStyle['icon-text'] = text
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
        dataSource = new GeoJsonDataSource()
        dataSource.notFromDrop = true

        // This is where we'll store custom primitives used for animated walls/corridors.
        // Key is feature id, value is associated primitive object
        dataSource.primitives = new Map()
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
      // Update the geoJson layer
      // Need to await to make zoomToLayer work properly on load
      if (typeof layer.updateGeoJson === 'function') await layer.updateGeoJson(geoJson, updateOptions)

      // We keep geojson data for in memory layer in a cache since
      // these layers will be destroyed when hidden. We need to be able to restore
      // them when they get shown again
      const baseLayer = this.getLayerByName(name)
      if (isInMemoryLayer(baseLayer)) {
        this.geojsonCache[name] = geoJson
      }
      this.onLayerUpdated(baseLayer, layer, { features: geoJson.features || [geoJson] })
    },
    onLayerUpdated (layer, cesiumLayer, data) {
      this.$emit('layer-updated', layer, cesiumLayer, data)
      this.$engineEvents.emit('layer-updated', layer, cesiumLayer, data)
    },
    onCurrentTimeChangedGeoJsonLayers (time) {
      // Need to update layers that require an update at a given frequency
      const geoJsonlayers = _.values(this.layers).filter(sift({
        // Possible for realtime layers only
        'cesium.type': 'geoJson',
        'cesium.realtime': true,
        $or: [ // Supported by template URL or time-based features service
          { 'cesium.sourceTemplate': { $exists: true } },
          { service: { $exists: true } }
        ],
        // Skip layers powered by realtime service events
        serviceEvents: { $ne: true },
        // Skip invisible layers
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
    onDefaultUnitChangedGeoJsonLayers (units) {
      _.forOwn(units.default, (unit, quantity) => {
        const units = _.map(Units.getUnits(quantity), 'name')
        // Need to update layers with variables affected by the unit change,
        // ie which style depends on it
        let geoJsonlayers = _.values(this.layers).filter(sift({
          'cesium.type': 'geoJson',
          'cesium.realtime': true,
          // Not sure why but this does not seem to work with sift
          //'variables': { $elemMatch: { unit: { $in: units } } },
          'variables': { $exists: true },
          isVisible: true,
          'cesium.style': { $exists: true },
          'cesium.template': { $exists: true }
        }))
        // Check for each layer if it uses the target unit and templated style uses the unit system or not
        geoJsonlayers = geoJsonlayers.filter(layer => {
          const unit = _.intersection(units, _.map(layer.variables, 'unit'))
          if (_.isEmpty(unit)) return false
          for (const template of layer.cesium.template) {
            if (template.startsWith('style.')) {
              const style = _.get(layer.cesium, template)
              if ((typeof style === 'string') && style.includes('Units')) return true
            }
          }
          return false
        })
        // Then retrieve the engine layers and update
        geoJsonlayers.forEach(layer => {
          // Retrieve the layer
          const dataSource = this.getCesiumLayerByName(geoJsonlayer.name)
          dataSource.updateGeoJson()
        })
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
    },
    selectFeaturesForPostProcess (effect, layerName, featureIds) {
      // Make sure post process is enabled
      const stage = this.getPostProcessStage(effect)
      if (!stage) return
      // Make sure layer exists
      const layer = this.getCesiumLayerByName(layerName)
      if (!layer) return
      // Expect layer to be a datasource
      if (!layer.entities) return

      const ids = Array.isArray(featureIds) ? featureIds : [ featureIds ]
      const primitives = []
      ids.forEach((id) => {
        // Lookup entity based on featureId
        const entity = layer.entities.getById(id)
        if (!entity) return
        // Lookup associated primitive
        const primitive = findPrimitiveForEntity(entity, this.viewer)
        if (!primitive) return

        primitives.push(primitive)
      })

      stage.selected = primitives
    }
  },
  created () {
    this.registerCesiumConstructor(this.createCesiumGeoJsonLayer)
    this.$events.on('time-current-time-changed', this.onCurrentTimeChangedGeoJsonLayers)
    this.$events.on('units-changed', this.onDefaultUnitChangedGeoJsonLayers)
    this.$engineEvents.on('layer-shown', this.onLayerShownGeoJsonLayers)
    this.$engineEvents.on('layer-removed', this.onLayerRemovedGeoJsonLayers)
    // Map of currently updated layers to avoid reentrance with real-time events as
    // we are not able to perform in place update and required to pull the data
    this.updatingGeoJsonData = {}
    // Cache where we'll store geojson data for in memory layers we'll hide
    this.geojsonCache = {}
  },
  beforeUnmount () {
    this.$events.off('time-current-time-changed', this.onCurrentTimeChangedGeoJsonLayers)
    this.$events.off('units-changed', this.onDefaultUnitChangedGeoJsonLayers)
    this.$engineEvents.off('layer-shown', this.onLayerShownGeoJsonLayers)
    this.$engineEvents.off('layer-removed', this.onLayerRemovedGeoJsonLayers)

    this.geojsonCache = {}
  }
}
