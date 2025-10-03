import { GeoJsonDataSource, ColorMaterialProperty, ConstantProperty, Math as CesiumMath, HeadingPitchRoll, Quaternion, Cartographic, EllipsoidRhumbLine } from 'cesium'
import _ from 'lodash'
import logger from 'loglevel'
import sift from 'sift'
import { uid } from 'quasar'
import { Time, Units, Events } from '../../../../core.client.js'
import { fetchGeoJson, getFeatureId, processFeatures, getFeatureStyleType, isInMemoryLayer, getGeoJsonFeatures } from '../../utils.js'
import { convertSimpleStyleToPointStyle, convertSimpleStyleToLineStyle, convertSimpleStyleToPolygonStyle } from '../../utils/utils.style.js'
import { convertToCesiumFromSimpleStyle, getPointSimpleStyle, getLineSimpleStyle, getPolygonSimpleStyle, convertToCesiumFromStyle } from '../../cesium/utils/utils.style.js'
import { createPrimitiveWithMovingTexture, getPrimitivesForEntity } from '../../cesium/utils/utils.cesium.js'
import { hasUnitInCesiumLayerTemplate, updateCesiumGeoJsonEntity, GeoJsonCesiumLayerFilters } from '../../cesium/utils/utils.geojson.js'
import * as maths from '../../../../core/client/utils/utils.math.js'

// Custom entity types that can be created from a base entity like eg a polyline
const CustomTypes = ['wall', 'corridor', 'stroke']
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
    // Delay removal of the old primitive to avoid flickering
    setTimeout(() => {
      activity.viewer.scene.primitives.remove(oldCustom.primitive)
      const index = activity.cesiumMaterials.indexOf(oldCustom.material)
      activity.cesiumMaterials.splice(index, 1)
    }, activity.viewerOptions.entityLoadTextureDelay)
  }
  dataSource.primitives.set(id, { primitive, material })
  activity.viewer.scene.primitives.add(primitive)
  activity.cesiumMaterials.push(material)
  // Delay opacity change to avoid white material when texture is not loaded
  setTimeout(() => {
    material.material.uniforms.opacity = 1.0
  }, activity.viewerOptions.entityLoadTextureDelay)
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
      const features = getGeoJsonFeatures(geoJson)
      // Remove mode
      if (_.get(updateOptions, 'remove', false)) {
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

      // We use a separated source in order to load data otherwise Cesium will replace previous ones, causing flickering
      const loadingDataSource = new GeoJsonDataSource()
      loadingDataSource.notFromDrop = true
      await loadingDataSource.load(geoJson, cesiumOptions)
      // Now we process loaded entities to merge with existing ones if any or add new ones
      let entities = loadingDataSource.entities.values
      const animatedFeatures = []
      entities.forEach(entity => {
        // Find matching feature if any and keep track of it as Cesium only keeps properties
        entity.feature = features.find(feature => getFeatureId(feature, options) === entity.id)
        let previousEntity = dataSource.entities.getById(entity.id)
        CustomTypes.forEach(type => {
          previousEntity = previousEntity || dataSource.entities.getById(getCustomEntityId(entity.id, type))
        })
        if (previousEntity) {
          const isAnimatedLayer = _.get(updateOptions, 'duration') && _.get(entity, 'feature') && _.get(previousEntity, 'feature')
          if (isAnimatedLayer) {
            const previousFeature = _.cloneDeep(previousEntity.feature)
            const feature = _.cloneDeep(entity.feature)
            animatedFeatures.push({ feature, previousFeature })
          } else {
            // Update only if not in animation, as data is interpolated between previous and current position
            // Otherwise, we would have jumps in end animation position for this update call
            updateCesiumGeoJsonEntity(entity, previousEntity)
          }
        } else dataSource.entities.add(entity)
      })
      // Remove any entity not existing anymore
      if (_.get(updateOptions, 'removeMissing', cesiumOptions.removeMissing)) {
        const entitiesToRemove = []
        dataSource.entities.values.forEach(entity => {
          const id = entity.id
          if (!loadingDataSource.entities.getById(id)) entitiesToRemove.push(id)
          CustomTypes.forEach(type => {
            const customId = getCustomEntityId(id, type)
            // Take care that in case of a custom entity we add it in addition to or instead the original line
            if (dataSource.entities.getById(customId)) entitiesToRemove.push(customId)
          })
        })
        entitiesToRemove.forEach(id => dataSource.entities.removeById(id))
        // Cleanup custom primitives if needed too
        for (const id of dataSource.primitives.keys()) {
          CustomTypes.forEach(type => {
            const entityId = getOriginalEntityId(id, type)
            if (entityId && !loadingDataSource.entities.contains(entityId))
              removeCustomPrimitiveById(this, dataSource, id)
          })
        }
      }

      if (!_.isEmpty(animatedFeatures) && _.has(this, 'cesiumAnimations')) {
        const animation = Object.assign({}, updateOptions, {
          features: animatedFeatures,
          remainingTime: updateOptions.duration * 1000,
          duration: updateOptions.duration * 1000,
          lastUpdate: Date.now()
        })
        if (animation.animate) {
          _.forOwn(animation.animate, value => {
            _.defaults(value, { easing: { function: 'linear' }, bearing: false })
          })
        }
        this.cesiumAnimations[options.name] = animation
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
            },
            feature: entity.feature
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
              },
              feature: entity.feature
            })
            entitiesToRemove.push(entity)
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
              },
              feature: entity.feature
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
            billboard: billboardImage ? { image: billboardImage } : undefined,
            feature: entity.feature
          })
          entitiesToRemove.push(entity)
        }
        // Clamped to ground polygons with stroke
        // Need to add a new entity for stroke since Cesium does not support it
        if (_.get(entity, 'polygon') && _.get(properties, 'entityStyle.polygon.perPositionHeight') === false) {
          const strokeId = getCustomEntityId(entity.id, 'stroke')
          const { stroke, strokeWidth } = this.convertFromSimpleStyleOrDefaults(properties)
          const nullAltitude = _.every(_.get(entity, 'feature.geometry.coordinates[0]', []), coord => {
            return coord.length > 2 && coord[2] === 0
          })
          if (nullAltitude) {
            const strokeEntity = {
              id: strokeId,
              name: entity.name ? entity.name : strokeId,
              description: entity.description.getValue(0),
              properties: entity.properties.getValue(0),
              polyline: {
                positions: entity.polygon.hierarchy.getValue().positions,
                width: strokeWidth,
                material: stroke,
                clampToGround: true
              },
              feature: entity.feature
            }
            entitiesToAdd.push(strokeEntity)
            if (dataSource.entities.getById(strokeEntity.id)) {
              entitiesToRemove.push(strokeEntity)
            }
          }
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
          // Get original layer options to ensure we have the latest ones while getting features (e.g. filters toggle)
          await this.loadGeoJson(dataSource, await this.getFeatures(Object.assign({}, options, this.getLayerByName(options.name))), options, updateOptions)
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

        let type = getFeatureStyleType(feature)
        if (_.has(feature, 'properties.entityStyle')) {
          // Walls and corridors must be treated as polygons in style editor
          if (_.has(feature, 'properties.entityStyle.wall')) type = 'polygon'
          else if (_.has(feature, 'properties.entityStyle.corridor')) type = 'polygon'
        }
        if (_.get(feature, 'style.extrude')) type = 'polygon'

        if (!_.has(feature, 'style')) {
          // No style means first load
          // Get feature style from properties (simple style)
          const style = type === 'point'
            ? convertSimpleStyleToPointStyle(feature.properties)
            : type === 'line'
              ? convertSimpleStyleToLineStyle(feature.properties)
              : convertSimpleStyleToPolygonStyle(feature.properties)
          _.set(feature, 'style', style)
        }

        // We cannot access data outside the properties object of a feature in Cesium
        // As a consequence we copy back any style information inside
        // We need to convert to simple-style spec as cesium manages this only
        // We also need to merge all styling properties as some entities requires eg both line/polygon style (wall polylines or corridor polygons)
        const stylePerType = {
          point: getPointSimpleStyle(feature, options, engine),
          line: getLineSimpleStyle(feature, options, engine),
          polygon: getPolygonSimpleStyle(feature, options, engine)
        }

        // Apply the style according to the feature type to the end to prevent overriding
        const simpleStyle = Object.assign(...Object.values(stylePerType), stylePerType[type])

        // Manage our extended simple-style spec
        const text = _.get(feature, 'style.text.label')
        if (text) simpleStyle['icon-text'] = text
        if (!feature.properties) feature.properties = simpleStyle
        else Object.assign(feature.properties, simpleStyle)

        const cesiumStyle = convertToCesiumFromStyle(feature, options)
        _.mergeWith(feature, cesiumStyle, (objValue, srcValue) => {
          if (_.isArray(objValue)) return srcValue
        })
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
        this.geojsonCache[name] = await this.toGeoJson(name)
      }
      this.onLayerUpdated(baseLayer, layer, { features: geoJson ? geoJson.features || [geoJson] : [] })
    },
    onLayerUpdated (layer, cesiumLayer, data) {
      this.$emit('layer-updated', layer, cesiumLayer, data)
      this.$engineEvents.emit('layer-updated', layer, cesiumLayer, data)
    },
    onCurrentTimeChangedGeoJsonLayers (time) {
      // Need to update layers that require an update at a given frequency
      const geoJsonlayers = _.values(this.layers).filter(sift(GeoJsonCesiumLayerFilters.TimeUpdate))
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
        let geoJsonlayers = _.values(this.layers).filter(sift(GeoJsonCesiumLayerFilters.UnitUpdate))
        // Check for each layer if it uses the target unit and templated style uses the unit system or not
        geoJsonlayers = geoJsonlayers.filter(layer => {
          return hasUnitInCesiumLayerTemplate(units, layer)
        })
        // Then retrieve the engine layers and update
        geoJsonlayers.forEach(layer => {
          // Retrieve the layer
          const dataSource = this.getCesiumLayerByName(layer.name)
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
    selectFeaturesForPostProcess (effect, layerNames, featureIds) {
      // Make sure post process is enabled
      const stage = this.getPostProcessStage(effect)
      if (!stage) return
      let primitives = []
      // We allow features from multiple layers so that the code is based on arrays
      // but the input can be a single element
      const multipleLayers = Array.isArray(layerNames)
      if (!multipleLayers) {
        layerNames = [layerNames]
        featureIds = [featureIds]
      }
      for (let i = 0; i < layerNames.length; i++) {
        const layerName = layerNames[i]
        const layerIds = featureIds[i]
        // Make sure layer exists
        const layer = this.getCesiumLayerByName(layerName)
        if (!layer) return
        // Expect layer to be a datasource
        if (!layer.entities && !layer.primitives.size) return

        const ids = Array.isArray(layerIds) ? layerIds : [layerIds]
        ids.forEach((id) => {
          // Lookup entity based on featureId
          let entity = layer.entities.getById(id)
          let primitive = layer.primitives.get(id)
          // Take care we also generate IDs based on specific entity types
          CustomTypes.forEach(type => {
            if (entity || primitive) return
            const customId = getCustomEntityId(id, type)
            entity = layer.entities.getById(customId)
            primitive = layer.primitives.get(customId)
          })
          if (entity) {
            // Lookup associated primitive
            primitive = getPrimitivesForEntity(id, this.viewer)
          } else {
            primitive = _.get(primitive, 'primitive')
          }
          if (!primitive) return
          // An entity can have multiple primitives, so we need to handle that
          primitives = _.concat(primitives, _.isArray(primitive) ? primitive : [primitive])
        })
      }

      stage.selected = primitives
    },
    // Note: as this callback is called frequently by the animation system
    // we don't use lodash utility functions like _.get/_.set to improve performances
    getInterpolatedFeatures (t, features, animationOptions) {
      const lerp = (start, end, t) => start + t * (end - start)
      const animatedFeatures = []
      features.forEach(({ feature: currFeature, previousFeature: prevFeature }) => {
        const animatedFeature = _.cloneDeep(currFeature)
        for (const property in animationOptions) {
          const animateProperty = animationOptions[property]
          const easingPropertyFunction = animateProperty.easing.function
          const easingPropertyParameters = animateProperty.easing.parameters || []
          const tEasing = maths[easingPropertyFunction](t, ...easingPropertyParameters)
          if (property === 'geometry') {
            // Store animation information in properties so that we don't need to recompute it for next steps
            if (!currFeature.properties.animation || !currFeature.properties.animation.geometry) {
              if (!currFeature.properties.animation) currFeature.properties.animation = {}
              const startCoordinates = { lon: prevFeature.geometry.coordinates[0], lat: prevFeature.geometry.coordinates[1], alt: prevFeature.geometry.coordinates[2] || null }
              const endCoordinates = { lon: currFeature.geometry.coordinates[0], lat: currFeature.geometry.coordinates[1], alt: currFeature.geometry.coordinates[2] || null }
              currFeature.properties.animation.geometry = {
                startCoordinates,
                endCoordinates
              }
              if (animateProperty.rhumb) {
                try {
                  const start = new Cartographic(startCoordinates.lon, startCoordinates.lat, startCoordinates.alt || 0)
                  const end = new Cartographic(endCoordinates.lon, endCoordinates.lat, endCoordinates.alt || 0)
                  currFeature.properties.animation.geometry.rhumbLine = new EllipsoidRhumbLine(start, end)
                } catch (e) {
                  // Fallback to null if we cannot compute rhumb line (e.g. start = end)
                  currFeature.properties.animation.geometry.rhumbLine = null
                }
              }
            }
            // Interpolate position
            const geometryData = currFeature.properties.animation.geometry
            if (animateProperty.rhumb && currFeature.properties.animation.geometry.rhumbLine) {
              const rhumbLine = currFeature.properties.animation.geometry.rhumbLine
              const destination = rhumbLine.interpolateUsingFraction(tEasing, new Cartographic())
              animatedFeature.geometry.coordinates[0] = destination.longitude
              animatedFeature.geometry.coordinates[1] = destination.latitude
              if (geometryData.startCoordinates.alt !== null && geometryData.endCoordinates.alt !== null) {
                animatedFeature.geometry.coordinates[2] = destination.height
              }
            } else {
              animatedFeature.geometry.coordinates[0] = lerp(geometryData.startCoordinates.lon, geometryData.endCoordinates.lon, tEasing)
              animatedFeature.geometry.coordinates[1] = lerp(geometryData.startCoordinates.lat, geometryData.endCoordinates.lat, tEasing)
              if (geometryData.startCoordinates.alt !== null && geometryData.endCoordinates.alt !== null) {
                animatedFeature.geometry.coordinates[2] = lerp(geometryData.startCoordinates.alt, geometryData.endCoordinates.alt, tEasing)
              }
            }
          } else if (property === 'orientation') {
            // Store animation information in properties so that we don't need to recompute it for next steps
            if (!currFeature.properties.animation || !currFeature.properties.animation.orientation) {
              if (!currFeature.properties.animation) currFeature.properties.animation = {}

              let startOrientation = prevFeature.properties.orientation || [0, 0, 0]
              let endOrientation = currFeature.properties.orientation || [0, 0, 0]
              if (typeof startOrientation === 'string') startOrientation = startOrientation.split(',').map(v => parseFloat(v))
              if (typeof endOrientation === 'string') endOrientation = endOrientation.split(',').map(v => parseFloat(v))

              startOrientation = startOrientation.map(angle => CesiumMath.toRadians(angle))
              startOrientation = new HeadingPitchRoll(...startOrientation)
              startOrientation = Quaternion.fromHeadingPitchRoll(startOrientation)

              endOrientation = endOrientation.map(angle => CesiumMath.toRadians(angle))
              endOrientation = new HeadingPitchRoll(...endOrientation)
              endOrientation = Quaternion.fromHeadingPitchRoll(endOrientation)

              currFeature.properties.animation.orientation = { startOrientation, endOrientation }
            }

            // Interpolate orientation
            const { startOrientation, endOrientation } = currFeature.properties.animation.orientation
            let value = {}
            value = Quaternion.slerp(startOrientation, endOrientation, tEasing, value)
            value = HeadingPitchRoll.fromQuaternion(value)

            animatedFeature.properties.orientation = [value.heading, value.pitch, value.roll].map(v => CesiumMath.toDegrees(v))
          } else {
            const startValue = prevFeature.properties[property]
            const endValue = currFeature.properties[property]
            if (isNaN(startValue) || isNaN(endValue)) return

            let value = 0
            if (animateProperty.bearing) {
              const bearingDifference = (endValue - startValue + 540) % 360 - 180
              value = (startValue + tEasing * bearingDifference + 360) % 360
            } else {
              value = lerp(startValue, endValue, tEasing)
            }
            animatedFeature.properties[property] = value
          }
        }
        animatedFeatures.push(animatedFeature)
      })

      return animatedFeatures
    }
  },
  created () {
    this.registerCesiumConstructor(this.createCesiumGeoJsonLayer)
    Events.on('time-current-time-changed', this.onCurrentTimeChangedGeoJsonLayers)
    Events.on('units-changed', this.onDefaultUnitChangedGeoJsonLayers)
    this.$engineEvents.on('layer-shown', this.onLayerShownGeoJsonLayers)
    this.$engineEvents.on('layer-removed', this.onLayerRemovedGeoJsonLayers)
    // Map of currently updated layers to avoid reentrance with real-time events as
    // we are not able to perform in place update and required to pull the data
    this.updatingGeoJsonData = {}
    // Cache where we'll store geojson data for in memory layers we'll hide
    this.geojsonCache = {}
  },
  beforeUnmount () {
    Events.off('time-current-time-changed', this.onCurrentTimeChangedGeoJsonLayers)
    Events.off('units-changed', this.onDefaultUnitChangedGeoJsonLayers)
    this.$engineEvents.off('layer-shown', this.onLayerShownGeoJsonLayers)
    this.$engineEvents.off('layer-removed', this.onLayerRemovedGeoJsonLayers)

    this.geojsonCache = {}
  }
}
