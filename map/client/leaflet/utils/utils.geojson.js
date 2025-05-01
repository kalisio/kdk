import L from 'leaflet'
import _ from 'lodash'
import 'leaflet-realtime'
import { GradientPath, buildSVGOverlayFromGradientPath } from '../GradientPath.js'

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
      const style = options.style(geojson)
      return properties.svg ? buildSVGOverlayFromGradientPath(geojson, style) : new GradientPath(geojson, style)
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

export function getUpdateFeatureFunction(leafletOptions) {
  return (feature, oldLayer) => {
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

export const GeoJsonLeafletLayerFilters = {
  // Filter to identify layers that require an update at a given frequency
  TimeUpdate: {
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
  },
  // Filter to identify layers with variables affected by a unit change
  UnitUpdate: {
    'leaflet.type': 'geoJson',
    'leaflet.realtime': true,
    // Not sure why but this does not seem to work with sift
    //'variables': { $elemMatch: { unit: { $in: units } } },
    'variables': { $exists: true },
    isVisible: true,
    $or: [{
      'leaflet.style': { $exists: true },
      'leaflet.template': { $exists: true }
    }, {
      'leaflet.tooltip.template': { $exists: true }
    }]
  },
  // Filter to identify layers with tooltip defining a minZoom/maxZoom
  // thus affected by a zoom change
  TooltipUpdate: {
    'leaflet.type': 'geoJson',
    'leaflet.realtime': true,
    isVisible: true,
    // Supported by permanent tooltips only
    'leaflet.tooltip.options.permanent': true,
    $or: [
      { 'leaflet.tooltip.minZoom': { $exists: true } },
      { 'leaflet.tooltip.maxZoom': { $exists: true } }
    ]
  }
}

export function hasUnitInLeafletLayerTemplate(units, layer) {
  const unit = _.intersection(units, _.map(layer.variables, 'unit'))
  if (_.isEmpty(unit)) return false
  if (_.get(layer, 'leaflet.tooltip.template', '').includes('Units')) return true
  for (const template of layer.leaflet.template) {
    if (template.startsWith('style.')) {
      const style = _.get(layer.leaflet, template)
      if ((typeof style === 'string') && style.includes('Units')) return true
    }
  }
  return false
}
