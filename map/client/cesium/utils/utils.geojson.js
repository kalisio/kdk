import _ from 'lodash'

export const GeoJsonCesiumLayerFilters = {
  // Filter to identify layers that require an update at a given frequency
  TimeUpdate: {
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
  },
  // Filter to identify layers with variables affected by a unit change
  UnitUpdate: {
    'cesium.type': 'geoJson',
    'cesium.realtime': true,
    // Not sure why but this does not seem to work with sift
    //'variables': { $elemMatch: { unit: { $in: units } } },
    'variables': { $exists: true },
    isVisible: true,
    $or: [{
      'cesium.style': { $exists: true },
      'cesium.template': { $exists: true }
    }, {
      'cesium.tooltip.template': { $exists: true }
    }]
  }
}

export function updateCesiumGeoJsonEntity (source, destination) {
  destination.position = source.position
  destination.orientation = source.orientation
  destination.properties = source.properties
  destination.description = source.description
  if (source.feature) destination.feature = source.feature
  // Points
  if (source.billboard) destination.billboard = source.billboard
  // Lines
  if (source.polyline) destination.polyline = source.polyline
  // Polygons
  if (source.polygon) destination.polygon = source.polygon
}

export function hasUnitInCesiumLayerTemplate(units, layer) {
  const unit = _.intersection(units, _.map(layer.variables, 'unit'))
  if (_.isEmpty(unit)) return false
  if (_.get(layer, 'cesium.tooltip.template', '').includes('Units')) return true
  for (const template of layer.cesium.template) {
    if (template.startsWith('style.')) {
      const style = _.get(layer.cesium, template)
      if ((typeof style === 'string') && style.includes('Units')) return true
    }
  }
  return false
}
