import Cesium from 'cesium/Source/Cesium.js'
import _ from 'lodash'
import moment from 'moment'
import sift from 'sift'
import { fetchGeoJson } from '../../utils'

export default {
  methods: {
    convertFromSimpleStyleSpecOrDefaults (properties) {
      let { stroke, strokeWidth, fill } = this.convertFromSimpleStyleSpec(properties)
      if (!stroke) stroke = Cesium.GeoJsonDataSource.stroke
      if (!strokeWidth) strokeWidth = Cesium.GeoJsonDataSource.strokeWidth
      if (!fill) fill = Cesium.GeoJsonDataSource.fill
      return { stroke, strokeWidth, fill }
    },
    async loadGeoJson (dataSource, geoJson, cesiumOptions) {
      await dataSource.load(geoJson, cesiumOptions)
      // Process specific entities
      const entities = dataSource.entities.values
      const entitiesToAdd = []
      const entitiesToRemove = []
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        const properties = entity.properties.getValue(0)
        // Circles
        const radius = _.get(properties, 'radius')
        const geodesic = _.get(properties, 'geodesic')
        if (radius && geodesic) {
          const { stroke, strokeWidth, fill } = this.convertFromSimpleStyleSpecOrDefaults(properties)
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
          const { stroke, strokeWidth, fill } = this.convertFromSimpleStyleSpecOrDefaults(properties)
          // Simply push the entity, other options like font will be set using styling options
          // This one will come in addition to the original line
          entitiesToAdd.push({
            id: entity.id + '-wall',
            parent: entity,
            name: entity.name,
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
        // Labels
        const text = _.get(properties, 'icon-text')
        if (text) {
          const { stroke, strokeWidth, fill } = this.convertFromSimpleStyleSpecOrDefaults(properties)
          // Simply push the entity, other options like font will be set using styling options
          // This one will replace the original point
          entitiesToAdd.push({
            id: entity.id,
            position: entity.position.getValue(0),
            name: entity.name,
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
    async updateGeoJsonData (dataSource, options, geoJson) {
      const cesiumOptions = options.cesium
      const source = _.get(cesiumOptions, 'source')
      const sourceTemplate = _.get(cesiumOptions, 'sourceTemplate')
      // Update function to fetch for new data and update Cesium data source
      if (options.probeService) {
        // If the probe location is given by another service use it on initialization
        if (dataSource.entities.values.length === 0) {
          await this.loadGeoJson(dataSource, this.getProbeFeatures(options), cesiumOptions)
        }
        // Then get last available measures
        // Update only the first time or when required according to data update interval
        if (!dataSource.lastUpdateTime || !this.shouldSkipFeaturesUpdate(dataSource.lastUpdateTime, options)) {
          dataSource.lastUpdateTime = (this.currentTime ? this.currentTime.clone() : moment.utc())
          const measureSource = new Cesium.GeoJsonDataSource()
          await this.loadGeoJson(measureSource, this.getFeatures(options), cesiumOptions)
          // Then merge with probes
          const probes = dataSource.entities.values
          for (let i = 0; i < probes.length; i++) {
            const probe = probes[i]
            const measure = measureSource.entities.getById(probe.id)
            if (measure) {
              probe.properties = measure.properties
              probe.description = measure.description
            }
          }
        }
      } else if (options.service) { // Check for feature service layers only, in this case update in place
        // If no probe reference, nothing to be initialized
        // Update only the first time or when required according to data update interval
        if (!dataSource.lastUpdateTime || !this.shouldSkipFeaturesUpdate(dataSource.lastUpdateTime, options)) {
          dataSource.lastUpdateTime = (this.currentTime ? this.currentTime.clone() : moment.utc())
          await this.loadGeoJson(dataSource, this.getFeatures(options), cesiumOptions)
        }
      } else if (geoJson) {
        await this.loadGeoJson(dataSource, geoJson, cesiumOptions)
      } else if (sourceTemplate) {
        const sourceToFetch = dataSource.sourceCompiler({ time: this.currentTime || moment.utc() })
        if (!dataSource.lastFetchedSource || (dataSource.lastFetchedSource !== sourceToFetch)) {
          dataSource.lastFetchedSource = sourceToFetch
          await this.loadGeoJson(dataSource, fetchGeoJson(sourceToFetch), cesiumOptions)
        }
      } else if (!_.isNil(source)) {
        // Assume source is an URL returning GeoJson
        await this.loadGeoJson(dataSource, fetchGeoJson(source), cesiumOptions)
      }
      this.applyStyle(dataSource.entities, options)
      if (typeof this.applyTooltips === 'function') this.applyTooltips(dataSource.entities, options)
    },
    async createCesiumRealtimeGeoJsonLayer (dataSource, options) {
      const cesiumOptions = options.cesium
      // Add update capabilities
      dataSource.updateGeoJson = async (geoJson) => {
        await this.updateGeoJsonData(dataSource, options, geoJson)
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
      // Cesium expect id to be in a 'id' property
      const featureId = _.get(options, 'featureId')
      options.processor = (feature) => {
        feature.id = _.get(feature, 'properties.' + featureId, _.get(feature, featureId))
      }
      if (this.options.cluster) {
        if (cesiumOptions.cluster) Object.assign(cesiumOptions.cluster, this.options.cluster)
        else cesiumOptions.cluster = Object.assign({}, this.options.cluster)
      }
      // Merge generic GeoJson options and layer options
      const geoJsonOptions = this.getGeoJsonOptions(options)
      Object.keys(geoJsonOptions).forEach(key => {
        // If layer provided do not override
        if (!_.has(cesiumOptions, key)) _.set(cesiumOptions, key, geoJsonOptions[key])
      })
      // Optimize templating by creating compilers up-front
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
      this.convertFromSimpleStyleSpec(cesiumOptions, 'update-in-place')
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
      return this.options.featureStyle || {}
    },
    async updateLayer (name, geoJson) {
      // Retrieve the layer
      const layer = this.getCesiumLayerByName(name)
      if (!layer) return // Cannot update invisible layer
      if (typeof layer.updateGeoJson === 'function') layer.updateGeoJson(geoJson)
    },
    onCurrentTimeChangedGeoJsonLayers (time) {
      const geoJsonlayers = _.values(this.layers).filter(sift({
        'cesium.type': 'geoJson',
        'cesium.realtime': true,
        $or: [ // Supported by template URL or time-based features
          { 'cesium.sourceTemplate': { $exists: true } },
          { service: { $exists: true }, variables: { $exists: true } }
        ],
        isVisible: true
      }))
      geoJsonlayers.forEach(async geoJsonlayer => {
        // Retrieve the layer
        const dataSource = this.getCesiumLayerByName(geoJsonlayer.name)
        // Then update
        dataSource.updateGeoJson()
      })
    }
  },
  created () {
    this.registerCesiumConstructor(this.createCesiumGeoJsonLayer)
    // Perform required conversion from JSON to Cesium objects
    if (this.options.featureStyle) {
      Object.assign(Cesium.GeoJsonDataSource, this.convertFromSimpleStyleSpec(this.options.featureStyle, 'update-in-place'))
    }
    this.$on('current-time-changed', this.onCurrentTimeChangedGeoJsonLayers)
  },
  beforeDestroy () {
    this.$off('current-time-changed', this.onCurrentTimeChangedHeatmapLayers)
  }
}
