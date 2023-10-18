import L from 'leaflet'
import _ from 'lodash'
import sift from 'sift'
import logger from 'loglevel'
import 'leaflet-realtime'
import { Time } from '../../../../core/client/time.js'
import { GradientPath } from '../../leaflet/GradientPath.js'
import { MaskLayer } from '../../leaflet/MaskLayer.js'
import { TiledFeatureLayer } from '../../leaflet/TiledFeatureLayer.js'
import { fetchGeoJson, LeafletEvents, bindLeafletEvents, unbindLeafletEvents, getFeatureId } from '../../utils.map.js'
import * as wfs from '../../../common/wfs-utils.js'

// Override default remove handler for leaflet-realtime due to
// https://github.com/perliedman/leaflet-realtime/issues/177
const Realtime = L.Realtime.extend({
  remove: function (geojson) {
    if (typeof geojson === 'undefined') {
      return L.Layer.prototype.remove.call(this)
    } else {
      return L.Realtime.prototype.remove.call(this, geojson)
    }
  }
})
L.realtime = function (src, options) {
  return new Realtime(src, options)
}

// Override default Leaflet GeoJson utility to manage some specific use cases
const geometryToLayer = L.GeoJSON.geometryToLayer
L.GeoJSON.geometryToLayer = function (geojson, options) {
  const geometry = geojson.geometry
  const properties = geojson.properties
  if (geometry && properties && properties.geodesic) {
    if (geometry.type === 'LineString') {
      return new L.Geodesic([L.GeoJSON.coordsToLatLngs(geometry.coordinates, 0)],
        Object.assign({ steps: 4 }, options.style(geojson)))
    } else if (geometry.type === 'MultiLineString') {
      const coords = geometry.coordinates.map((lineString) => L.GeoJSON.coordsToLatLngs(lineString, 0))
      return new L.Geodesic(coords, Object.assign({ steps: 4 }, options.style(geojson)))
    } else if (geometry.type === 'Point') {
      const layer = new L.GeodesicCircle(L.GeoJSON.coordsToLatLng(geometry.coordinates),
        Object.assign({ fill: true, steps: 360, radius: properties.radius }, options.style(geojson)))
      return layer
    }
  }
  if (geometry && properties && properties.gradient) {
    if (geometry.type === 'LineString') {
      return new GradientPath(geojson, options.style(geojson))
    }
  }
  if (geometry && properties && properties.mask) {
    if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
      return new MaskLayer(geojson, options.style(geojson))
    }
  }
  return geometryToLayer(geojson, options)
}

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
        leafletOptions.updateFeature = function (feature, oldLayer) {
          // A new feature is coming, create it
          if (!oldLayer) return
          // An existing one is found, simply update styling, properties, etc.
          leafletOptions.onEachFeature(feature, oldLayer)
          if (oldLayer.setStyle) {
            // Some vector layers can be used for points, eg circleMarker,
            // in this case we use marker styling instead of lines/polygons styling
            if (feature.geometry.type === 'Point') {
              // FIXME: updating style in place does not seem to work, so for now we recreate the whole marker
              // oldLayer.setStyle(leafletOptions.pointToLayer(feature))
              return
            } else {
              oldLayer.setStyle(leafletOptions.style(feature))
            }
          }
          // We want to restore values that were there till now but are missing
          // from the input feature.
          // Deep for time and runtime
          _.defaultsDeep(feature, _.pick(oldLayer.feature, ['time', 'runTime']))
          // _NOT_ deep for properties, otherwise it'll merge array and object properties between the two
          const oldProps = _.get(oldLayer.feature, 'properties')
          if (oldProps) {
            if (!feature.properties) feature.properties = {}
            _.defaults(feature.properties, oldProps)
          }
          if (oldLayer.setIcon) {
            // FIXME: updating icon in place requires to recreate it anyway, so for now we recreate the whole marker
            // oldLayer.setIcon(_.get(leafletOptions.pointToLayer(feature, oldLayer.getLatLng()), 'options.icon'))
            return
          }
          // And coordinates if not static
          const staticGeometry = _.get(leafletOptions, 'staticGeometry', false)
          if (staticGeometry) return oldLayer
          // The feature is changing its geometry type, recreate it
          const oldType = _.get(oldLayer, 'feature.geometry.type')
          const type = _.get(feature, 'geometry.type')
          if (type !== oldType) return
          const coordinates = feature.geometry.coordinates
          // FIXME: support others geometry types ?
          switch (type) {
            case 'Point':
              oldLayer.setLatLng(L.GeoJSON.coordsToLatLngs(coordinates))
              break
            case 'LineString':
            case 'MultiLineString':
              if (typeof oldLayer.setData === 'function') {
                // Support Gradient Path
                oldLayer.setData(feature)
              } else if (feature.properties.geodesic) {
                // Support geodesic line & linestrings
                const latlngs = type === 'LineString'
                  ? [L.GeoJSON.coordsToLatLngs(coordinates, 0)]
                  : coordinates.map((linestring) => L.GeoJSON.coordsToLatLngs(linestring, 0))
                oldLayer.setLatLngs(latlngs)
              } else {
                oldLayer.setLatLngs(L.GeoJSON.coordsToLatLngs(coordinates, type === 'LineString' ? 0 : 1))
              }
              break
            case 'Polygon':
            case 'MultiPolygon':
              oldLayer.setLatLngs(L.GeoJSON.coordsToLatLngs(coordinates, type === 'Polygon' ? 1 : 2))
              break
          }
          return oldLayer
        }
      }
      // Check for feature service layers
      if (options.service) {
        // We perform manual update
        _.set(leafletOptions, 'start', false)
        // Tell realtime plugin how to update/load data
        if (leafletOptions.tiled) {
          leafletOptions.removeMissing = false
          // Fetching is managed by tiles but even for manual update leaflet realtime require a src
          _.set(leafletOptions, 'source', async (successCallback, errorCallback) => {})
          // Generate fetch function for tiled feature layer
          leafletOptions.featureSource = (baseQuery) => this.getFeatures(_.merge({ baseQuery }, options))
        } else {
          leafletOptions.removeMissing = !options.probeService
          let initialized = !options.probeService // If no probe reference, nothing to be initialized
          _.set(leafletOptions, 'source', async (successCallback, errorCallback) => {
            // FIXME: need to retrieve original layer options as here we get processed options by the underlying engine
            // and eg filtering depends on changing the state of the layer definition object at run time
            options = this.getLayerByName(options.name)
            // If the probe location is given by another service use it on initialization
            if (!initialized) {
              try {
                // Use probes as reference
                successCallback(await this.getProbeFeatures(options))
                initialized = true
              } catch (error) {
                errorCallback(error)
              }
            }
            try {
              // Then update features
              successCallback(await this.getFeatures(options))
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
            return wfs.GetFeature(options.wfs.url, options.wfs.version, options.wfs.layer, searchParams, { xml2json: false })
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
        // min/max zoom are automatically managed on tiled layers by inheriting GridLayer
        // on non-tiled layers we need to use a pane to manage it
        const hasMinZoom = !!_.get(leafletOptions, 'minZoom')
        const hasMaxZoom = !!_.get(leafletOptions, 'maxZoom')
        if (!leafletOptions.tiled && (hasMinZoom || hasMaxZoom)) {
          const pane = { name: options.name }
          if (hasMinZoom) pane.minZoom = _.get(leafletOptions, 'minZoom')
          if (hasMaxZoom) pane.maxZoom = _.get(leafletOptions, 'maxZoom')
          leafletOptions.panes = [pane]
          leafletOptions.pane = options.name
          leafletOptions.shadowPane = options.name
        }
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
        // Merge generic GeoJson options and layer options
        const geoJsonOptions = this.getGeoJsonOptions(options)
        Object.keys(geoJsonOptions).forEach(key => {
          // If layer provided do not override
          if (!_.has(leafletOptions, key)) _.set(leafletOptions, key, _.get(geoJsonOptions, key))
        })
        leafletOptions.layerStyle = this.convertFromSimpleStyleSpec(leafletOptions)
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
          if (leafletOptions.container) layer.once('add', () => leafletOptions.container.addTo(this.map))
          // Add FeatureGroup interface so that layer edition works as well
          layer.toGeoJSON = () => ({ type: 'FeatureCollection', features: _.values(layer._features) })
          layer.clearLayers = () => layer._onNewData(true, { type: 'FeatureCollection', features: [] })
          layer.addLayer = (geoJsonLayer) => layer._onNewData(true, geoJsonLayer.toGeoJSON())
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
          return this.generateStyle('featureStyle', feature, options)
        },
        pointToLayer: (feature, latlng) => {
          return this.generateStyle('markerStyle', feature, latlng, options)
        }
      }

      return geojsonOptions
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
        this.updateLayer(name, geoJson)
      } else {
        // Backward compatibility when third parameter was the remove flag
        const remove = (typeof options === 'boolean' ? options : options.remove)
        const removeMissing = _.get(options, 'removeMissing', layer.options.removeMissing)
        // Check if clustering on top of a realtime layer, in this case we have a top-level container
        let container
        if (typeof layer.getLayers === 'function') {
          container = layer
          layer = container.getLayers().find(layer => layer._container === container)
        }
        /* By default leaflet-realtime only performs add with manual update
          (see https://github.com/perliedman/leaflet-realtime/issues/136)
          but we'd like to perform similarly to automated updates
        */
        if (remove) {
          if (typeof layer.remove !== 'function') return
          let features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
          // Filter features to ensure some have not been already removed
          // FIXME: indeed it seems to causes a bug with clustering, see https://github.com/kalisio/kdk/issues/140
          features = features.filter(feature => layer.getLayer(layer.options.getFeatureId(feature)))
          layer.remove(features)
        } else if (geoJson) {
          if (typeof layer._onNewData === 'function') layer._onNewData(removeMissing, geoJson)
        } else { // Fetch new data or update in place
          if (typeof layer.update === 'function') layer.update()
          else if (typeof layer._onNewData === 'function') layer._onNewData(removeMissing, this.toGeoJson(name))
        }

        // We keep geojson data for in memory layer in a cache since
        // these layers will be destroyed when hidden. We need to be able to restore
        // them when they get shown again
        const baseLayer = this.getLayerByName(name)
        if (this.isInMemoryLayer(baseLayer)) {
          const geojson = layer.toGeoJSON(false)
          this.geojsonCache[name] = geojson
        }
      }
    },
    onLayerUpdated (layer, leafletLayer, data) {
      this.$emit('layer-updated', Object.assign({ layer, leafletLayer }, data))
      this.$engineEvents.emit('layer-updated', Object.assign({ layer, leafletLayer }, data))
    },
    onCurrentTimeChangedGeoJsonLayers (time) {
      const geoJsonlayers = _.values(this.layers).filter(sift({
        'leaflet.type': 'geoJson',
        'leaflet.realtime': true,
        $or: [ // Supported by template URL or time-based features
          { 'leaflet.sourceTemplate': { $exists: true } },
          { service: { $exists: true } }
        ],
        isVisible: true
      }))
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
    onMapZoomChangedGeoJsonLayers () {
      // Need to update layers with tooltip defining a minZoom/maxZoom
      // as we cannot do that in template because tooltip needs to be recreated/destroyed dynamically
      const geoJsonlayers = _.values(this.layers).filter(sift({
        'leaflet.type': 'geoJson',
        'leaflet.realtime': true,
        isVisible: true,
        // Supported by permanent tooltips only
        'leaflet.tooltip.options.permanent': true,
        $or: [
          { 'leaflet.tooltip.minZoom': { $exists: true } },
          { 'leaflet.tooltip.maxZoom': { $exists: true } }
        ]
      }))
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
        if (this.isInMemoryLayer(layer)) {
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
    this.registerLeafletConstructor(this.createLeafletGeoJsonLayer)
    this.$events.on('time-current-time-changed', this.onCurrentTimeChangedGeoJsonLayers)
    this.$engineEvents.on('selected-level-changed', this.onCurrentLevelChangedGeoJsonLayers)
    this.$engineEvents.on('zoomend', this.onMapZoomChangedGeoJsonLayers)
    this.$engineEvents.on('layer-shown', this.onLayerShownGeoJsonLayers)
    this.$engineEvents.on('layer-removed', this.onLayerRemovedGeoJsonLayers)

    // Cache where we'll store geojson data for in memory layers we'll hide
    this.geojsonCache = {}
  },
  beforeUnmount () {
    this.$events.off('time-current-time-changed', this.onCurrentTimeChangedHeatmapLayers)
    this.$engineEvents.off('selected-level-changed', this.onCurrentLevelChangedGeoJsonLayers)
    this.$engineEvents.off('zoomend', this.onMapZoomChangedGeoJsonLayers)
    this.$engineEvents.off('layer-shown', this.onLayerShownGeoJsonLayers)
    this.$engineEvents.off('layer-removed', this.onLayerRemovedGeoJsonLayers)

    this.geojsonCache = {}
  }
}
