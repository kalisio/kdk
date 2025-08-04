import L from 'leaflet'
import _ from 'lodash'
import sift from 'sift'
import logger from 'loglevel'
import { point, rhumbDistance, rhumbBearing, rhumbDestination, getType } from '@turf/turf'
import { Time, Units, Events, utils as kdkCoreUtils } from '../../../../core.client.js'
import { getUpdateFeatureFunction, hasUnitInLeafletLayerTemplate, GeoJsonLeafletLayerFilters } from '../../leaflet/utils/utils.geojson.js'
import { MaskLayer } from '../../leaflet/MaskLayer.js'
import { TiledFeatureLayer } from '../../leaflet/TiledFeatureLayer.js'
import { 
  fetchGeoJson, getGeoJsonFeatures, LeafletEvents, bindLeafletEvents, unbindLeafletEvents, getFeatureId, isInMemoryLayer, getFeatureStyleType,
  convertSimpleStyleToPointStyle, convertSimpleStyleToLineStyle, convertSimpleStyleToPolygonStyle, createMarkerFromPointStyle
} from '../../utils.map.js'
import * as maths from '../../../../core/client/utils/utils.math.js'
import * as wfs from '../../../common/wfs-utils.js'

export const geojsonLayers = {
  emits: [
    'layer-updated'
  ],
  methods: {
    processRealtimeGeoJsonLayerOptions (options) {
      const leafletOptions = options.leaflet || options
      // Alter type as required by the plugin
      leafletOptions.type = 'realtime'
      // We first need to create an underlying container and setup Id function
      _.set(leafletOptions, 'getFeatureId', (feature) => {
        return getFeatureId(feature, options)
      })
      const container = _.get(leafletOptions, 'container')
      // If container given and not already instanciated, do it
      if (typeof container === 'string') {
        leafletOptions.container = this.createLeafletLayer({ type: container })
      }
      // Custom update function to ensure dynamic styling works as expected
      if (!_.has(leafletOptions, 'updateFeature')) {
        leafletOptions.updateFeature = getUpdateFeatureFunction(leafletOptions)
      }
      // Check for feature service layers
      if (options.service) {
        // FIXME: need to retrieve original layer options as here we get processed options by the underlying engine
        // and eg filtering depends on changing the state of the layer definition object at run time
        options = this.getLayerByName(options.name)
        // We perform manual update
        _.set(leafletOptions, 'start', false)
        // Tell realtime plugin how to update/load data
        if (leafletOptions.tiled) {
          leafletOptions.removeMissing = false
          // Fetching is managed by tiles but even for manual update leaflet realtime require a src
          _.set(leafletOptions, 'source', async (successCallback, errorCallback) => {})
          // Generate fetch functions for tiled feature layer
          leafletOptions.probeSource = (baseQuery) => this.getProbeFeatures(_.merge({ baseQuery }, options))
          leafletOptions.featureSource = (baseQuery) => this.getFeatures(_.merge({ baseQuery }, options))
        } else {
          leafletOptions.removeMissing = !options.probeService
          let initialized = !options.probeService // If no probe reference, nothing to be initialized
          _.set(leafletOptions, 'source', async (successCallback, errorCallback) => {
            // If the probe location is given by another service use it on initialization
            if (!initialized) {
              try {
                // Use probes as reference
                const geoJson = await this.getProbeFeatures(options)
                // When probes are fetched, we flag them with a 'measureRequestIssued' property that we may use in dynamic styling
                const features = getGeoJsonFeatures(geoJson)
                features.forEach(feature => { feature.measureRequestIssued = true })
                successCallback(geoJson)
                initialized = true
              } catch (error) {
                errorCallback(error)
              }
            }
            try {
              // Then update features
              const geoJson = await this.getFeatures(options)
              successCallback(geoJson)
            } catch (error) {
              errorCallback(error)
            }
          })
        }
      } else if (options.wfs) {
        // Features are fetched from a WFS connection
        _.set(leafletOptions, 'start', false)
        _.set(leafletOptions, 'source', async (successCallback, errorCallback) => {})

        if (leafletOptions.tiled) {
          leafletOptions.removeMissing = false
          // Generate fetch function for tiled feature layer
          leafletOptions.featureSource = (query) => {
            const searchParams = Object.assign({
              OUTPUTFORMAT: options.wfs.outputFormat, // request as geojson
              SRSNAME: 'EPSG:4326', // result in 4326
              BBOX: `${query.south},${query.west},${query.north},${query.east},urn:ogc:def:crs:EPSG::4326` // request bbox
            }, options.wfs.searchParams)
            return wfs.GetFeature(options.wfs.url, options.wfs.version, options.wfs.layer, searchParams, options.wfs.headers, { xml2json: false })
          }
        }
      } else if (_.has(leafletOptions, 'sourceTemplate')) {
        const sourceCompiler = _.template(_.get(leafletOptions, 'sourceTemplate'))
        let lastFetchedSource
        // Tell realtime plugin how to update/load data
        _.set(leafletOptions, 'source', async (successCallback, errorCallback) => {
          try {
            const sourceToFetch = sourceCompiler({ time: Time.getCurrentTime() })
            if (!lastFetchedSource || (lastFetchedSource !== sourceToFetch)) {
              lastFetchedSource = sourceToFetch
              successCallback(await fetchGeoJson(sourceToFetch, options))
            }
          } catch (error) {
            errorCallback(error)
          }
        })
        // We perform manual update
        _.set(leafletOptions, 'start', false)
      } else if (!_.has(leafletOptions, 'source')) {
        _.set(leafletOptions, 'start', false)
        // Even for manual update leaflet realtime require a src
        _.set(leafletOptions, 'source', async (successCallback, errorCallback) => {})
      }
    },
    async processGeoJsonLayerOptions (options) {
      const leafletOptions = options.leaflet || options
      const dataSource = _.get(leafletOptions, 'source')
      if (_.isNil(dataSource)) {
        // Empty valid GeoJson
        _.set(leafletOptions, 'source', { type: 'FeatureCollection', features: [] })
      } else if (typeof dataSource === 'string') { // URL ? If so load data
        let data
        // Check for feature service layers
        if (options.service) {
          data = await this.getFeatures(options)
        } else { // Otherwise standard HTTP
          data = await fetchGeoJson(dataSource, options)
        }
        _.set(leafletOptions, 'source', data)
      }
    },
    processClusterLayerOptions (options) {
      const leafletOptions = options.leaflet || options
      const clusterOptions = Object.assign({ type: 'markerClusterGroup' }, leafletOptions.cluster)
      // Transfer pane if any
      if (leafletOptions.pane) clusterOptions.clusterPane = leafletOptions.pane
      leafletOptions.container = this.createLeafletLayer(clusterOptions)
      bindLeafletEvents(leafletOptions.container, LeafletEvents.Cluster, this, options)
    },
    async createLeafletGeoJsonLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid type
      if (leafletOptions.type !== 'geoJson') return

      try {
        // Min/Max zoom are automatically managed on tiled layers by inheriting GridLayer
        // but on non-tiled layers we need to use a pane to manage it.
        // However, as we'd like to be able to easily control layer display order we create a pane for each layer by default anyway.
        const hasMinZoom = !!_.get(leafletOptions, 'minZoom')
        const hasMaxZoom = !!_.get(leafletOptions, 'maxZoom')
        const hasZIndex = !!_.get(leafletOptions, 'zIndex')
        const name = options.name
        // Default pane will be automatically used for Leaflet vector layers (ie polygons/lines)
        const layerPane = { name }
        if (hasMinZoom) layerPane.minZoom = _.get(leafletOptions, 'minZoom')
        if (hasMaxZoom) layerPane.maxZoom = _.get(leafletOptions, 'maxZoom')
        if (hasZIndex) layerPane.zIndex = _.get(leafletOptions, 'zIndex')
        const panes = _.get(leafletOptions, 'panes', [])
        if (!_.find(panes, { name: layerPane.name })) panes.push(layerPane)
        // Set layer to use its default pane as target
        // Avoid erasing any existing pane, if so the pane should have been created taken into account the layer zIndex up-front
        if (!_.has(leafletOptions, 'pane')) leafletOptions.pane = layerPane.name
        if (!_.has(leafletOptions, 'shadowPane')) leafletOptions.shadowPane = layerPane.name
        // Make default pane available to styles as well as eg shape markers are created from here
        for (const type of ['point', 'line', 'polygon']) {
          _.set(leafletOptions, `style.${type}.pane`, layerPane.name)
          _.set(leafletOptions, `style.${type}.shadowPane`, layerPane.name)
        }
        // If we only use this default pane all elements of a layer will be affected to this pane.
        // We prefer the markers and their shadows to be affected to different panes than others elements like Leaflet does by default.
        // This is notably required if we'd like to be able to control the rendering order of the elements with bringToFront/bringToBack functions.
        // Except if a z-index is specified as in this case the user wants to control the order by himself
        if (!hasZIndex) {
          // No z-index means that the pane will use the default for overlays in Leaflet which is 400
          // so that we use the default for markers and shadows in Leaflet as well.
          if (!_.find(panes, { name: `${name}-markers` })) panes.push(Object.assign({ name: `${name}-markers`, zIndex: 600 }, _.omit(layerPane, ['name'])))
          if (!_.find(panes, { name: `${name}-shadows` })) panes.push(Object.assign({ name: `${name}-shadows`, zIndex: 500 }, _.omit(layerPane, ['name'])))
          // Avoid erasing any existing pane, if so the pane should have been created taken into account the layer zIndex up-front
          if (!_.has(leafletOptions, 'shadowPane')) leafletOptions.shadowPane = `${name}-shadows`
          // Make panes available to styles as eg shape markers are created from here
          _.set(leafletOptions, 'style.point.pane', `${name}-markers`)
          _.set(leafletOptions, 'style.point.shadowPane', `${name}-shadows`)
        }
        leafletOptions.panes = panes
        // If not explicitely disable use defaults for clustering
        if (!_.has(leafletOptions, 'cluster') && _.get(this, 'activityOptions.engine.cluster')) {
          // Merge existing config or create a new one on layer
          if (leafletOptions.cluster) Object.assign(leafletOptions.cluster, _.get(this, 'activityOptions.engine.cluster'))
          else leafletOptions.cluster = Object.assign({}, _.get(this, 'activityOptions.engine.cluster'))
        }
        // Specific case of clustered layer where we first need to create an underlying group
        if (leafletOptions.cluster) {
          this.processClusterLayerOptions(options)
        }
        // Specific case of realtime layer
        if (leafletOptions.realtime) {
          this.processRealtimeGeoJsonLayerOptions(options)
        } else {
          await this.processGeoJsonLayerOptions(options)
        }
        // Optimize templating by creating compilers up-front
        const layerStyleTemplate = _.get(leafletOptions, 'template')
        if (layerStyleTemplate) {
          // We allow to template style properties according to feature, because it can be slow you have to specify a subset of properties
          leafletOptions.template = layerStyleTemplate.map(property => ({
            property, compiler: _.template(_.get(leafletOptions, property))
          }))
        }
        const popupTemplate = _.get(leafletOptions, 'popup.template')
        if (popupTemplate) {
          leafletOptions.popup.compiler = _.template(popupTemplate)
        }
        const tooltipTemplate = _.get(leafletOptions, 'tooltip.template')
        if (tooltipTemplate) {
          leafletOptions.tooltip.compiler = _.template(tooltipTemplate)
        }
        // Optimize styling by creating color scales up-front
        const variables = _.get(options, 'variables', [])
        variables.forEach(variable => {
          if (_.has(variable, 'chromajs')) {
            variable.colorScale = kdkCoreUtils.buildColorScale(_.get(variable, 'chromajs'))
          }
        })
        // Convert and store the style
        if (leafletOptions.style) {
          leafletOptions.layerPointStyle = _.get(leafletOptions.style, 'point')
          leafletOptions.layerLineStyle = _.get(leafletOptions.style, 'line')
          leafletOptions.layerPolygonStyle = _.get(leafletOptions.style, 'polygon')
        } else {
          leafletOptions.layerPointStyle = convertSimpleStyleToPointStyle(leafletOptions)
          leafletOptions.layerLineStyle = convertSimpleStyleToLineStyle(leafletOptions)
          leafletOptions.layerPolygonStyle = convertSimpleStyleToPolygonStyle(leafletOptions)
        }
        // Merge generic GeoJson options and layer options
        const geoJsonOptions = this.getGeoJsonOptions(options)
        Object.keys(geoJsonOptions).forEach(key => {
          // If layer provided do not override execpt for the style 
          // Indeed the style property must be overriden to install the Leaflet function style
          if (!_.has(leafletOptions, key) || (key === 'style')) _.set(leafletOptions, key, _.get(geoJsonOptions, key))
        })
        // Create the layer
        let layer = this.createLeafletLayer(options)
        // Specific case of realtime layer where the underlying container also need to be added to map
        if (leafletOptions.realtime) {
          // Build associated tile layer and bind required events
          if (leafletOptions.tiled) {
            // In our options minZoom/maxZoom can be set to false
            // but Leaflet only expect it if fixed to a given number
            const hasMinZoom = !!_.get(leafletOptions, 'minZoom')
            const hasMaxZoom = !!_.get(leafletOptions, 'maxZoom')
            const zoomLevelsToOmit = []
            if (!hasMinZoom) zoomLevelsToOmit.push('minZoom')
            if (!hasMaxZoom) zoomLevelsToOmit.push('maxZoom')
            const tiledLayer = new TiledFeatureLayer(_.omit(leafletOptions, zoomLevelsToOmit))
            tiledLayer.setup(this, options)
            layer.tiledLayer = tiledLayer
            layer.on('add', () => tiledLayer.addTo(this.map))
            layer.on('remove', () => tiledLayer.removeFrom(this.map))
          }
          // Bind event
          layer.on('update', (data) => this.onLayerUpdated(options, layer, data))
          // We launch a first update to initialize data
          layer.update()
        } else {
          // Specific case of clustered layer where the group is added instead of the geojson layer
          if (leafletOptions.cluster && leafletOptions.container) {
            leafletOptions.container.addLayer(layer)
            layer = leafletOptions.container
          }
        }
        // Specific case of time dimension layer where we embed the underlying geojson layer
        if (leafletOptions.timeDimension) {
          layer = this.createLeafletLayer(Object.assign({ type: 'timeDimension.layer.geoJson', source: layer }, leafletOptions.timeDimension))
        }
        return layer
      } catch (error) {
        logger.error(error)
        return null
      }
    },
    getGeoJsonOptions (options = {}) {
      const geojsonOptions = {
        onEachFeature: (feature, layer) => {
          // Need to restone event listeners as context has changed
          unbindLeafletEvents(layer, LeafletEvents.Feature)
          // Check for custom onEachFeature function
          if (typeof this.onLeafletFeature === 'function') this.onLeafletFeature(feature, layer, options)
          // Then for tooltip/popup
          // First remove previous popup if any
          if (layer.getPopup()) layer.unbindPopup()
          const popup = this.generateStyle('popup', feature, layer, options)
          if (popup) {
            // Because we build a new popup we need to restore previous state
            const wasOpen = (layer.getPopup() && layer.isPopupOpen())
            layer.bindPopup(popup)
            bindLeafletEvents(layer.getPopup(), LeafletEvents.Popup, this, options)
            if (wasOpen) layer.openPopup()
          }
          // First remove previous tooltip if any
          if (layer.getTooltip()) layer.unbindTooltip()
          const tooltip = this.generateStyle('tooltip', feature, layer, options, this.map.getZoom())
          if (tooltip) {
            // Because we build a new tooltip we need to restore previous state
            const wasOpen = (layer.getTooltip() && layer.isTooltipOpen())
            layer.bindTooltip(tooltip)
            bindLeafletEvents(layer.getTooltip(), LeafletEvents.Tooltip, this, options)
            if (wasOpen) layer.openTooltip()
          }
          bindLeafletEvents(layer, LeafletEvents.Feature, this, options)
        },
        style: (feature) => {
          const styleType = getFeatureStyleType(feature)
          if (!styleType) {
            logger.warn(`[KDK] cannot get a style type from the feature of geometry type ${feature.geometry.type}`)
            return
          }
          return this.generateStyle(styleType, feature, options, _.get(this, `activityOptions.engine.style.${styleType}`), this.map.getZoom())
        },
        pointToLayer: (feature, latlng) => {
          const style = this.generateStyle('point', feature, options, _.get(this, 'activityOptions.engine.style.point'), this.map.getZoom())
          if (!style) {
            logger.warn('[KDK] cannot generate point style from a feature')
            return
          }
          return createMarkerFromPointStyle(latlng, style)
        }
      }
      return geojsonOptions
    },
    getUpdateAnimation(name, layer, options, geoJson) {
      const { duration, removeMissing, animate } = options
      const animatedProperties = _.keys(animate)
      animatedProperties.forEach(property => {
        _.defaultsDeep(animate, {
          [property]: { easing: { function: 'linear' }, bearing: false }
        })
      })
      const features = getGeoJsonFeatures(geoJson)
      features.forEach(feature => {
        const previousLayer = layer.getLayer(layer.options.getFeatureId(feature))
        const previousFeature = (previousLayer ? previousLayer.feature : null)
        if (previousFeature) {
          // Remove reference to previous feature otherwise it will create a reference tree that will grow as timle passes by
          // and that will never be clear by garbage collector unless the layer is destroyed
          delete previousFeature['previousFeature']
          feature.previousFeature = previousFeature
          const startLongitude = feature.previousFeature.geometry.coordinates[0]
          const startLatitude = feature.previousFeature.geometry.coordinates[1]
          const endLongitude = feature.geometry.coordinates[0]
          const endLatitude = feature.geometry.coordinates[1]
          const rhumbStart = point([startLongitude, startLatitude])
          const rhumbEnd = point([endLongitude, endLatitude])
          Object.assign(feature, {
            rhumbStart,
            rhumbEnd,
            rhumbBearing: rhumbBearing(rhumbStart, rhumbEnd),
            rhumbDistance: rhumbDistance(rhumbStart, rhumbEnd)
          })
        }
      })
      // Note: as this callback is called frequently by the animation system
      // we don't use lodash utility functions like _.get/_.set to improve performances
      return (timestamp) => {
        // Initialize animation time origin
        if (!options.startTime) options.startTime = timestamp
        const { id, startTime, fps } = options
        const elapsedSinceStart = timestamp - startTime
        // If we target a specific frame rate check if we need to update or not
        if (fps && options.lastTime) {
          const elapsedSinceLastFrame = timestamp - options.lastTime
          const fpsInterval = 1000 / fps
          if (elapsedSinceLastFrame < fpsInterval) {
            options.id = requestAnimationFrame(options.step)
            // For debug purpose only, avoid flooding the browser
            //logger.debug('[KDK] Skipping update layer animation frame')
            return
          } else {
            // For debug purpose only, avoid floodign the browser
            //logger.debug('[KDK] Drawing update layer animation frame')
          }
        }
        // Else animate if animation not yet finished
        const percent = Math.abs(elapsedSinceStart / (1000 * duration))
        if (percent <= 1) {
          const animatedFeatures = []
          features.forEach(feature => {
            if (!feature.previousFeature) {
              animatedFeatures.push(feature)
              return
            }
            const endLongitude = feature.geometry.coordinates[0]
            const endLatitude = feature.geometry.coordinates[1]
            let dLongitude = endLongitude, dLatitude = endLatitude
            if (animate.geometry) {
              const easingGeometryFunction = animate.geometry.easing.function
              const easingGeometryParameters = animate.geometry.easing.parameters || []
              const percentGeometry = maths[easingGeometryFunction](percent, ...easingGeometryParameters)
              if (animate.geometry.rhumb) {
                const destination = rhumbDestination(feature.rhumbStart, percentGeometry * feature.rhumbDistance, feature.rhumbBearing)
                dLongitude = destination.geometry.coordinates[0]
                dLatitude = destination.geometry.coordinates[1]
              } else {
                const startLongitude = feature.previousFeature.geometry.coordinates[0]
                const startLatitude = feature.previousFeature.geometry.coordinates[1]
                dLongitude = startLongitude + percentGeometry * (endLongitude - startLongitude)
                dLatitude = startLatitude + percentGeometry * (endLatitude - startLatitude)
              }
            }
            const properties = {}
            const previousFeatureProperties = feature.previousFeature.properties || {}
            const featureProperties = feature.properties || {}
            animatedProperties.forEach(property => {
              // Skip geometry as specifically managed above
              if (property === 'geometry') return
              const animateProperty = animate[property]
              const easingPropertyFunction = animateProperty.easing.function
              const easingPropertyParameters = animateProperty.easing.parameters || []
              const percentProperty = maths[easingPropertyFunction](percent, ...easingPropertyParameters)
              const startValue = previousFeatureProperties[property]
              const endValue = featureProperties[property]
              let dValue = startValue + percentProperty * (endValue - startValue)
              if (animateProperty.bearing) {
                // Take care to animate using the shortest "path", eg from 355° to 5° avoid running counterclockwise
                // First computes the smallest angle difference, either clockwise or counterclockwise.
                const bearingDifference = (endValue - startValue + 540) % 360 - 180
                // Then normalize the final result to be between 0 and 360
                dValue = (startValue + percentProperty * bearingDifference + 360) % 360
              }
              properties[property] = dValue
            })
            animatedFeatures.push({
              type: feature.type,
              geometry: {
                type: feature.geometry.type,
                coordinates: [dLongitude, dLatitude]
              },
              properties: Object.assign({}, featureProperties, properties),
              style: feature.style
            })
          })
          layer._onNewData(_.isNil(removeMissing) ? layer.options.removeMissing : removeMissing, animatedFeatures)
          options.lastTime = timestamp
          options.id = requestAnimationFrame(options.step)
        } else {
          delete options.id
        }
      }
    },
    updateLayer (name, geoJson, options = {}) {
      // Retrieve the layer
      let layer = this.getLeafletLayerByName(name)
      if (!layer) return // Cannot update invisible layer
      if (!_.get(layer, 'options.realtime')) {
        logger.warn(`Impossible to update non-realtime layer ${name}`)
        return // Cannot update non-realtime layer
      }
      const replace = _.get(options, 'replace', false)
      if (replace) {
        // Replace given features, we first remove them to add them back afterwards
        this.updateLayer(name, geoJson, { remove: true })
        // Avoid infinite regression by removing the replace option
        this.updateLayer(name, geoJson, _.omit(options, ['replace']))
      } else {
        // Backward compatibility when third parameter was the remove flag
        const remove = (typeof options === 'boolean' ? options : options.remove)
        const removeMissing = _.get(options, 'removeMissing', layer.options.removeMissing)
        // Check if clustering on top of a realtime layer, in this case we have a top-level container
        let container
        if (layer instanceof L.MarkerClusterGroup) {
          container = layer
          layer = container.getLayers().find(layer => layer._container === container)
        }
        /* By default leaflet-realtime only performs add with manual update
          (see https://github.com/perliedman/leaflet-realtime/issues/136)
          but we'd like to perform similarly to automated updates
        */
        if (remove) {
          if (typeof layer.remove !== 'function') return
          let features = getGeoJsonFeatures(geoJson)
          // Filter features to ensure some have not been already removed
          // FIXME: indeed it seems to causes a bug with clustering, see https://github.com/kalisio/kdk/issues/140
          features = features.filter(feature => layer.getLayer(layer.options.getFeatureId(feature)))
          layer.remove(features)
        } else if (geoJson) {
          if (typeof layer._onNewData === 'function') {
            let duration = _.get(options, 'duration', 0)
            const features = (Array.isArray(geoJson) ? geoJson : (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson]))
            // Nothing to animate in this case
            if (duration && (features.length === 0)) {
              duration = 0
            }
            if (duration && _.some(features, feature => (getType(feature) !== 'Point'))) {
              logger.warn(`Impossible to animate layer ${name} as it does not contain only point geometries`)
              duration = 0
            }
            if (duration) {
              // For debug purpose only, avoid flooding the browser
              //logger.debug(`Calling updateLayer(${name}) with`, options)
              _.defaultsDeep(options, {
                animate: {
                  geometry: { easing: { function: 'linear' }, rhumb: false }
                }
              })
              // Stop any scheduled animation on the same layer
              const frameId = _.get(this.updateAnimations, `${name}.id`)
              if (!_.isNil(frameId)) cancelAnimationFrame(frameId)
              options.step = this.getUpdateAnimation(name, layer, options, geoJson)
              options.id = requestAnimationFrame(options.step)
              _.set(this.updateAnimations, name, options)
            } else {
              _.unset(this.updateAnimations, name)
              layer._onNewData(removeMissing, geoJson)
            }
          }
        } else { // Fetch new data or update in place
          if (layer.tiledLayer) layer.tiledLayer.redraw()
          else if (typeof layer.update === 'function') layer.update()
          else if (typeof layer._onNewData === 'function') layer._onNewData(removeMissing, this.toGeoJson(name))
        }

        // We keep geojson data for in memory layer in a cache since
        // these layers will be destroyed when hidden. We need to be able to restore
        // them when they get shown again
        const baseLayer = this.getLayerByName(name)
        if (isInMemoryLayer(baseLayer)) {
          const geojson = layer.toGeoJSON(false)
          this.geojsonCache[name] = geojson
        }
      }
    },
    onLayerUpdated (layer, leafletLayer, data) {
      this.$emit('layer-updated', layer, leafletLayer, data)
      this.$engineEvents.emit('layer-updated', layer, leafletLayer, data)
    },
    onCurrentTimeChangedGeoJsonLayers (time) {
      // Need to update layers that require an update at a given frequency
      const geoJsonlayers = _.values(this.layers).filter(sift(GeoJsonLeafletLayerFilters.TimeUpdate))
      geoJsonlayers.forEach(async geoJsonlayer => {
        // Retrieve the layer
        const layer = this.getLeafletLayerByName(geoJsonlayer.name)
        // Update only the first time or when required according to data update interval
        if (!layer.lastUpdateTime || !this.shouldSkipFeaturesUpdate(layer.lastUpdateTime, geoJsonlayer)) {
          layer.lastUpdateTime = Time.getCurrentTime().clone()
          if (layer.tiledLayer) {
            layer.tiledLayer.redraw()
          } else {
            layer.update()
          }
        }
      })
    },
    onCurrentLevelChangedGeoJsonLayers (level) {
      // Retrieve the layer associated to current level sélection
      let layer = this.selectableLevelsLayer
      if (layer) {
        const type = _.get(layer, `${this.engine}.type`)
        // Check if of right type
        if (type === 'geoJson') {
          // Retrieve the engine layer and update
          layer = this.getLeafletLayerByName(layer.name)
          if (layer.tiledLayer) {
            layer.tiledLayer.redraw()
          } else {
            layer.update()
          }
        }
      }
    },
    onDefaultUnitChangedGeoJsonLayers (units) {
      _.forOwn(units.default, (unit, quantity) => {
        const units = _.map(Units.getUnits(quantity), 'name')
        // Need to update layers with variables affected by the unit change,
        // ie which style depends on it
        let geoJsonlayers = _.values(this.layers).filter(sift(GeoJsonLeafletLayerFilters.UnitUpdate))
        // Check for each layer if it uses the target unit and templated style uses the unit system or not
        geoJsonlayers = geoJsonlayers.filter(layer => {
          return hasUnitInLeafletLayerTemplate(units, layer)
        })
        // Then retrieve the engine layers and update
        geoJsonlayers.forEach(layer => {
          layer = this.getLeafletLayerByName(layer.name)
          if (layer.tiledLayer) {
            layer.tiledLayer.redraw()
          } else {
            layer.update()
          }
        })
      })
    },
    onMapZoomChangedGeoJsonLayers () {
      // Need to update layers with tooltip defining a minZoom/maxZoom
      // as we cannot do that in template because tooltip needs to be recreated/destroyed dynamically
      const geoJsonlayers = _.values(this.layers).filter(sift(GeoJsonLeafletLayerFilters.TooltipUpdate))
      geoJsonlayers.forEach(async geoJsonlayer => {
        // Retrieve the layer
        const layer = this.getLeafletLayerByName(geoJsonlayer.name)
        const minZoom = _.get(geoJsonlayer, 'leaflet.tooltip.minZoom')
        const maxZoom = _.get(geoJsonlayer, 'leaflet.tooltip.maxZoom')
        const zoom = this.map.getZoom()
        let showTooltips = true
        if (maxZoom && zoom > maxZoom) showTooltips = false
        if (minZoom && zoom < minZoom) showTooltips = false
        // Update only when required according to zoom level
        if (layer.showTooltips !== showTooltips) {
          // Tag layer to know it has been updated
          layer.showTooltips = showTooltips
          this.updateLayer(geoJsonlayer.name, this.toGeoJson(geoJsonlayer.name))
        }
      })
    },
    onLayerShownGeoJsonLayers (layer, engineLayer) {
      // Check if we have cached geojson data for this layer
      const cachedGeojson = this.geojsonCache[layer.name]
      if (cachedGeojson) {
        if (isInMemoryLayer(layer)) {
          // Restore geojson data for in-memory layers that was hidden
          // Directly deal with the leaflet layer instead of calling updateLayer, we are just restoring data
          // Handle case where there's clustering on top (cf. updateLayer)
          if (engineLayer instanceof L.MarkerClusterGroup) {
            const container = engineLayer
            engineLayer = container.getLayers().find(layer => layer._container === container)
          }
          engineLayer._onNewData(false, cachedGeojson)
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
    this.registerLeafletConstructor(this.createLeafletGeoJsonLayer)
    Events.on('time-current-time-changed', this.onCurrentTimeChangedGeoJsonLayers)
    this.$engineEvents.on('selected-level-changed', this.onCurrentLevelChangedGeoJsonLayers)
    Events.on('units-changed', this.onDefaultUnitChangedGeoJsonLayers)
    this.$engineEvents.on('zoomend', this.onMapZoomChangedGeoJsonLayers)
    this.$engineEvents.on('layer-shown', this.onLayerShownGeoJsonLayers)
    this.$engineEvents.on('layer-removed', this.onLayerRemovedGeoJsonLayers)

    // Used to store animation options when animating a layer
    this.updateAnimations = {}
    // Cache where we'll store geojson data for in memory layers we'll hide
    this.geojsonCache = {}
  },
  beforeUnmount () {
    Events.off('time-current-time-changed', this.onCurrentTimeChangedGeoJsonLayers)
    this.$engineEvents.off('selected-level-changed', this.onCurrentLevelChangedGeoJsonLayers)
    Events.off('units-changed', this.onDefaultUnitChangedGeoJsonLayers)
    this.$engineEvents.off('zoomend', this.onMapZoomChangedGeoJsonLayers)
    this.$engineEvents.off('layer-shown', this.onLayerShownGeoJsonLayers)
    this.$engineEvents.off('layer-removed', this.onLayerRemovedGeoJsonLayers)

    this.geojsonCache = {}
  }
}
