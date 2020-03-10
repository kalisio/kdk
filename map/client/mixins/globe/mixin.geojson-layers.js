import Cesium from 'cesium/Source/Cesium.js'
import _ from 'lodash'
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
            name: entity.name,
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
    async startRealtimeGeoJsonDataUpdate (dataSource, options) {
      const cesiumOptions = options.cesium
      // If no interval given this is a manual update
      if (!_.has(cesiumOptions, 'interval')) return
      // Setup update timer
      dataSource.updateTimer = setInterval(() => dataSource.updateGeoJson(), cesiumOptions.interval)
      // Launch first update
      await this.updateRealtimeGeoJsonData(dataSource, options)
    },
    stopRealtimeGeoJsonDataUpdate (dataSource) {
      if (!dataSource.updateTimer) return
      clearTimeout(dataSource.updateTimer)
      dataSource.updateTimer = null
    },
    async updateRealtimeGeoJsonData (dataSource, options, geoJson) {
      const featureId = _.get(options, 'featureId')
      const cesiumOptions = options.cesium
      const source = _.get(cesiumOptions, 'source')
      let queryInterval
      if (cesiumOptions.queryInterval) queryInterval = cesiumOptions.queryInterval
      // If query interval not given use 2 x refresh interval as default value
      // this ensures we cover last interval if server/client update processes are not in sync
      if (!queryInterval && cesiumOptions.interval) queryInterval = 2 * cesiumOptions.interval
      // Update function to fetch for new data and update Cesium data source
      if (options.probeService) {
        // If the probe location is given by another service use it on initialization
        if (dataSource.entities.values.length === 0) {
          await this.loadGeoJson(dataSource, this.getProbeFeatures(options), cesiumOptions)
        }
        // Then get last available measures
        const measureSource = new Cesium.GeoJsonDataSource()
        await this.loadGeoJson(measureSource, this.getFeatures(options, queryInterval), cesiumOptions)
        // Then merge with probes
        const probes = dataSource.entities.values
        const measures = measureSource.entities.values
        for (let i = 0; i < probes.length; i++) {
          const probe = probes[i]
          const probeProperties = probe.properties
          for (let j = 0; j < measures.length; j++) {
            const measure = measures[j]
            // When we found a measure for a probe we update it
            if (_.get(probeProperties, featureId).getValue() === _.get(measure.properties, featureId).getValue()) {
              probe.properties = measure.properties
              probe.description = measure.description
            }
          }
        }
      } else if (options.service) { // Check for feature service layers only, in this case update in place
        // If no probe reference, nothing to be initialized
        await this.loadGeoJson(dataSource, this.getFeatures(options, queryInterval), cesiumOptions)
      } else if (geoJson) {
        await this.loadGeoJson(dataSource, geoJson, cesiumOptions)
      } else if (!_.isNil(source)) {
        // Assume source is an URL returning GeoJson
        await this.loadGeoJson(dataSource, fetchGeoJson(source), cesiumOptions)
      }
    },
    async createCesiumRealtimeGeoJsonLayer (dataSource, options) {
      const cesiumOptions = options.cesium
      // Default is to start fetching except if we don't have a source/service => manual update
      const service = _.get(options, 'service')
      const source = _.get(cesiumOptions, 'source')
      const start = _.get(cesiumOptions, 'start', service || source)
      // Add update capabilities
      dataSource.updateGeoJson = async (geoJson) => {
        await this.updateRealtimeGeoJsonData(dataSource, options, geoJson)
        this.applyStyle(dataSource.entities, options)
        if (typeof this.applyTooltips === 'function') this.applyTooltips(dataSource.entities, options)
      }
      // Required to be aware of the removed source
      this.viewer.dataSources.dataSourceRemoved.addEventListener((collection, oldSource) => {
        // Remove update timer
        if (oldSource === dataSource) {
          this.stopRealtimeGeoJsonDataUpdate(dataSource)
        }
      })
      // Launch first update if required
      if (start) await this.startRealtimeGeoJsonDataUpdate(dataSource, options)
    },
    async createCesiumGeoJsonLayer (options) {
      const cesiumOptions = options.cesium
      // Check for valid type
      if (cesiumOptions.type !== 'geoJson') return

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
        // Check for feature service layers
        if (cesiumOptions.realtime) {
          await this.createCesiumRealtimeGeoJsonLayer(dataSource, options)
        } else {
          // Check for feature service layers
          if (options.service) await this.loadGeoJson(dataSource, this.getFeatures(options), cesiumOptions)
          // Assume source is an URL returning GeoJson
          else await this.loadGeoJson(dataSource, fetchGeoJson(source), cesiumOptions)
        }
      }
      this.applyStyle(dataSource.entities, options)
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
      if (typeof this.applyTooltips === 'function') this.applyTooltips(dataSource.entities, options)
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
    }
  },
  created () {
    this.registerCesiumConstructor(this.createCesiumGeoJsonLayer)
    // Perform required conversion from JSON to Cesium objects
    if (this.options.featureStyle) {
      Object.assign(Cesium.GeoJsonDataSource, this.convertFromSimpleStyleSpec(this.options.featureStyle, 'update-in-place'))
    }
  }
}
