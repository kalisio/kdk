import L from 'leaflet'
import _ from 'lodash'
import sift from 'sift'
import logger from 'loglevel'
import lineOffset from '@turf/line-offset'
import turfbbox from '@turf/bbox'
import 'leaflet-realtime'
import { Time, Units, utils as kdkCoreUtils } from '../../../../core.client.js'
import { GradientPath } from '../../leaflet/GradientPath.js'
import { MaskLayer } from '../../leaflet/MaskLayer.js'
import { TiledFeatureLayer } from '../../leaflet/TiledFeatureLayer.js'
import { 
  fetchGeoJson, LeafletEvents, bindLeafletEvents, unbindLeafletEvents, getFeatureId, isInMemoryLayer, getFeatureStyleType,
  convertSimpleStyleToPointStyle, convertSimpleStyleToLineStyle, convertSimpleStyleToPolygonStyle, createMarkerFromPointStyle
} from '../../utils.map.js'
import * as wfs from '../../../common/wfs-utils.js'

// Build a svgOverlay leaflet layer
// geojson geometry must be a line string, with gradient information
// The svg element will be populated with coordinates in spherical mercator
// The svg overlay will be placed in the map covering the bbox of the geojson
function gradientPath2SVG (geojson) {
  const defs = []  // We'll push every linearGradient we need here
  const lines = [] // and every line segment we need here
  const gradient = geojson.properties.gradient
  const bbox = turfbbox(geojson)
  // Grow the bbox a bit because we use it to position the svgOverlay. If it matches exaclty
  // it'll crop the svg lines when using a big stroke-width, they'll exceed the geojson bbox ...
  const width = bbox[2] - bbox[0]
  const height = bbox[3] - bbox[1]
  bbox[0] -= width * 0.1
  bbox[1] -= height * 0.1
  bbox[2] += width * 0.1
  bbox[3] += height * 0.1

  // Create an id suffix to make linearGradient ids unique
  const idSuffix = `${bbox.join('_')}_${gradient.length}`
  // Project geojson coordinates to spherical mercator
  const latlngs = L.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates)
  const coordinates = latlngs.map((latlng) => L.Projection.SphericalMercator.project(latlng))
  for (let i = 0; i < gradient.length - 1; ++i) {
    // Reverse y, svg origin is top left
    const p0 = [coordinates[i].x, -coordinates[i].y]
    const p1 = [coordinates[i+1].x, -coordinates[i+1].y]
    // The linear gradient to apply on the current segment
    defs.push(`<linearGradient gradientUnits="userSpaceOnUse" x1="${p0[0]}" y1="${p0[1]}" x2="${p1[0]}" y2="${p1[1]}" id="gradient${i}_${idSuffix}"><stop offset="0" stop-color="${gradient[i]}"/><stop offset="1" stop-color="${gradient[i+1]}"/></linearGradient>`)
    // The associated line segment, vector-effect="non-sclaing-stroke" make it so stroke-width is a final pixel value, independent of zoom level
    // lines.push(`<line x1="${p0[0]}" y1="${p0[1]}" x2="${p1[0]}" y2="${p1[1]}" stroke="url(#gradient${i}_${idSuffix})" vector-effect="non-scaling-stroke"/>`)
    // Use paths instead because leaflet CSS defines 'pointer' cursor only on 'path' elements, not lines
    lines.push(`<path d="M ${p0[0]} ${p0[1]} L ${p1[0]} ${p1[1]}" stroke="url(#gradient${i}_${idSuffix})" vector-effect="non-scaling-stroke" class="leaflet-interactive"/>`)
  }

  // Compute the svg extent we must map in the svgOverlay (= the projected geojson bbox)
  const b0 = L.Projection.SphericalMercator.project(L.GeoJSON.coordsToLatLng(bbox.slice(0, 2)))
  const b1 = L.Projection.SphericalMercator.project(L.GeoJSON.coordsToLatLng(bbox.slice(2, 4)))
  const min = { x: Math.min(b0.x, b1.x), y: Math.min(-b0.y, -b1.y) }
  const max = { x: Math.max(b0.x, b1.x), y: Math.max(-b0.y, -b1.y) }

  // Create svg HTML element
  var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
  // Viewbox is used to define which part of the svg must be displayed in it's html element
  svgElement.setAttribute('viewBox', `${min.x} ${min.y} ${max.x-min.x} ${max.y-min.y}`)
  // svg html content, round linecap + stroke-width
  svgElement.innerHTML = `<g stroke-linecap="round" stroke-width="${geojson.properties.weight}"><defs>${defs.join('')}</defs>${lines.join('')}</g>`
  var svgElementBounds = [ [ bbox[1], bbox[0] ], [ bbox[3], bbox[2] ] ];
  // TODO: interactive should be set to false, and layer.addInteractiveTarget(layer._image) should be called, but it needs the map
  // we don't want 'leaflet-interactive' class on the svg html element because it requests 'pointer' cursor
  // but we want the map to know about interactive targets
  const layer = L.svgOverlay(svgElement, svgElementBounds, { interactive: true })
  const opacity = _.get(geojson.properties, 'opacity')
  if (opacity !== undefined)
    layer.setOpacity(opacity)
  layer.getCenter = () => L.latLng((bbox[1]+bbox[3])/2,(bbox[0]+bbox[2])/2)
  return layer
}

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
// Override default Polyline simplify function to manage offset
const simplifyPoints = L.Polyline.prototype._simplifyPoints
L.Polyline.include({
  _simplifyPoints: function () {
    simplifyPoints.call(this)
    // Offset simplified version 
    if (this.options.offset) {
      // We'd like to ensure a pixel constant offset when zooming
      // Zoom 0 resolution is 156 543 m/pixel at equator in default map tiles,
      // we take latitude into account to account for a convergence factor
      const latitude = this.getBounds().getCenter().lat
      const factor = 156543 / Math.pow(2, this._map.getZoom()) / Math.cos(latitude * Math.PI / 180)
      const offset = Math.max(1, this.options.offset * factor)

      for (let i = 0; i < this._parts.length; i++) {
        let latLngs = this._parts[i].map(point => this._map.layerPointToLatLng(point))
        // Ensure a large enough precision for computation (defaults to 6 in Leaflet)
        const coords = L.GeoJSON.latLngsToCoords(latLngs, 0, false, 12)
        const feature = lineOffset({ type: 'LineString', coordinates: coords }, offset, { units: 'meters' })
        latLngs = L.GeoJSON.coordsToLatLngs(feature.geometry.coordinates, 0)
        this._parts[i] = latLngs.map(latlng => this._map.latLngToLayerPoint(latlng))
      }
    }
  }
})

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
      return properties.svg ? gradientPath2SVG(geojson) : new GradientPath(geojson, options.style(geojson))
    }
  }
  if (geometry && properties && properties.mask) {
    if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
      return new MaskLayer(geojson, options.style(geojson))
    }
  }// Automate Leaflet.PolylineOffset plugin use
  if (geometry && properties && properties.offset) {
    if (geometry.type === 'LineString') {
      options = Object.assign({ offset: properties.offset }, options)
    }
  }
  // As we do so this breaks leaflet-arrowheads plugin
  const layer = geometryToLayer(geojson, options)
  if (geometry && (options.arrowheads || (properties && properties.arrowheads))) {
    if (layer instanceof L.Polyline) layer.arrowheads(options.arrowheads || properties.arrowheads)
  }
  
  return layer
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
          const staticGeometry = _.get(leafletOptions, 'staticGeometry', false)
          // Keep track of previous geometry if we don't want to update it
          // Indeed, styling might depend on it
          if (staticGeometry) feature.geometry = _.get(oldLayer, 'feature.geometry')

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
              // Updating style in place does not seem to work when involving panes
              if (_.get(oldLayer.feature, 'style.pane') !== _.get(feature, 'style.pane')) return
              else oldLayer.setStyle(leafletOptions.style(feature))
            }
          }
          // We want to restore values that were there till now but are missing from the input feature.
          // Deep for time and runtime that might contain objects with variables
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
          // Now update coordinates if not static geometry
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
        const hasZIndex = !!_.get(leafletOptions, 'zIndex')
        if (!leafletOptions.tiled && (hasMinZoom || hasMaxZoom)) {
          const pane = { name: options.name }
          if (hasMinZoom) pane.minZoom = _.get(leafletOptions, 'minZoom')
          if (hasMaxZoom) pane.maxZoom = _.get(leafletOptions, 'maxZoom')
          if (hasZIndex) pane.zIndex = _.get(leafletOptions, 'zIndex')
          leafletOptions.panes = [pane]
          leafletOptions.pane = options.name
          leafletOptions.shadowPane = options.name
          // Make pane available to styles as well as eg shape markers are created from here
          for (const type of ['point', 'line', 'polygon']) {
            if (_.has(leafletOptions, `style.${type}`)) {
              _.set(leafletOptions, `style.${type}.pane`, options.name)
              _.set(leafletOptions, `style.${type}.shadowPane`, options.name)
            }
          }
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
          if (leafletOptions.container) layer.once('add', () => leafletOptions.container.addTo(this.map))
          // Add FeatureGroup interface so that layer edition works as well
          layer.toGeoJSON = () => ({ type: 'FeatureCollection', features: _.values(layer._features) })
          layer.clearLayers = () => layer._onNewData(true, { type: 'FeatureCollection', features: [] })
          layer.getLayers = () => _.values(layer._featureLayers)
          layer.addLayer = (geoJsonLayer) => layer._onNewData(false, geoJsonLayer.toGeoJSON())
          layer.removeLayer = (geoJsonLayer) => layer.remove(geoJsonLayer.toGeoJSON())
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
          return this.generateStyle(styleType, feature, options, _.get(this, 'activityOptions.engine'))
        },
        pointToLayer: (feature, latlng) => {
          const style = this.generateStyle('point', feature, options, _.get(this, 'activityOptions.engine'))
          if (!style) {
            logger.warn('[KDK] cannot generate point style from a feature')
            return
          }
          return createMarkerFromPointStyle(latlng, style)
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
          let features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
          // Filter features to ensure some have not been already removed
          // FIXME: indeed it seems to causes a bug with clustering, see https://github.com/kalisio/kdk/issues/140
          features = features.filter(feature => layer.getLayer(layer.options.getFeatureId(feature)))
          layer.remove(features)
        } else if (geoJson) {
          if (typeof layer._onNewData === 'function') layer._onNewData(removeMissing, geoJson)
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
      const geoJsonlayers = _.values(this.layers).filter(sift({
        // Possible for realtime layers only
        'leaflet.type': 'geoJson',
        'leaflet.realtime': true,
        $or: [ // Supported by template URL or time-based features service
          { 'leaflet.sourceTemplate': { $exists: true } },
          { service: { $exists: true } }
        ],
        // Skip layers powered by realtime service events
        serviceEvents: { $ne: true },
        // Skip invisible layers
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
    onDefaultUnitChangedGeoJsonLayers (units) {
      _.forOwn(units.default, (unit, quantity) => {
        const units = _.map(Units.getUnits(quantity), 'name')
        // Need to update layers with variables affected by the unit change,
        // ie which style depends on it
        let geoJsonlayers = _.values(this.layers).filter(sift({
          'leaflet.type': 'geoJson',
          'leaflet.realtime': true,
          // Not sure why but this does not seem to work with sift
          //'variables': { $elemMatch: { unit: { $in: units } } },
          'variables': { $exists: true },
          isVisible: true,
          'leaflet.style': { $exists: true },
          'leaflet.template': { $exists: true }
        }))
        // Check for each layer if it uses the target unit and templated style uses the unit system or not
        geoJsonlayers = geoJsonlayers.filter(layer => {
          const unit = _.intersection(units, _.map(layer.variables, 'unit'))
          if (_.isEmpty(unit)) return false
          for (const template of layer.leaflet.template) {
            if (template.startsWith('style.')) {
              const style = _.get(layer.leaflet, template)
              if ((typeof style === 'string') && style.includes('Units')) return true
            }
          }
          return false
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
    this.$events.on('time-current-time-changed', this.onCurrentTimeChangedGeoJsonLayers)
    this.$engineEvents.on('selected-level-changed', this.onCurrentLevelChangedGeoJsonLayers)
    this.$events.on('units-changed', this.onDefaultUnitChangedGeoJsonLayers)
    this.$engineEvents.on('zoomend', this.onMapZoomChangedGeoJsonLayers)
    this.$engineEvents.on('layer-shown', this.onLayerShownGeoJsonLayers)
    this.$engineEvents.on('layer-removed', this.onLayerRemovedGeoJsonLayers)

    // Cache where we'll store geojson data for in memory layers we'll hide
    this.geojsonCache = {}
  },
  beforeUnmount () {
    this.$events.off('time-current-time-changed', this.onCurrentTimeChangedGeoJsonLayers)
    this.$engineEvents.off('selected-level-changed', this.onCurrentLevelChangedGeoJsonLayers)
    this.$events.off('units-changed', this.onDefaultUnitChangedGeoJsonLayers)
    this.$engineEvents.off('zoomend', this.onMapZoomChangedGeoJsonLayers)
    this.$engineEvents.off('layer-shown', this.onLayerShownGeoJsonLayers)
    this.$engineEvents.off('layer-removed', this.onLayerRemovedGeoJsonLayers)

    this.geojsonCache = {}
  }
}
