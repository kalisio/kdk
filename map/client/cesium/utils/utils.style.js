import _ from 'lodash'
import chroma from 'chroma-js'
import moment from 'moment'
import { Color } from 'cesium'
import { Time, Units, TemplateContext } from '../../../../core/client/index.js'
import { convertPointStyleToSimpleStyle, convertLineStyleToSimpleStyle, convertPolygonStyleToSimpleStyle, convertSimpleStyleColors,
  convertSimpleStyleToPointStyle, convertSimpleStyleToLineStyle, convertSimpleStyleToPolygonStyle,
         PointStyleTemplateMappings, LineStyleTemplateMappings, PolygonStyleTemplateMappings } from '../../utils/utils.style.js'
import { Cesium } from './utils.cesium.js'

export const CesiumStyleMappings = {
  stroke: 'stroke',
  'stroke-color': 'stroke',
  'stroke-opacity': 'stroke.alpha',
  'stroke-width': 'strokeWidth',
  fill: 'fill',
  'fill-color': 'fill',
  'fill-opacity': 'fill.alpha',
  'marker-size': 'markerSize',
  'marker-symbol': 'markerSymbol',
  'marker-color': 'markerColor'
}

export const CesiumStyleOptions = _.values(CesiumStyleMappings)
export const CesiumEntityTypes = ['billboard', 'box', 'corridor', 'cylinder', 'ellipse', 'ellipsoid',
  'label', 'model', 'path', 'plane', 'point', 'polygon', 'polyline', 'rectangle', 'wall']

const GeoJsonGeometryTypesToCesiumEntityMappings = {
  Point: 'point',
  LineString: 'polyline',
  Polygon: 'polygon'
}

const StyleToCesiumEntityStyleMappings = {
  altitudeMode: 'heightReference',
  width: 'width',
  color: 'material'
}

const AltitudeModesMappings = {
  clampToGround: 'Cesium.HeightReference.CLAMP_TO_GROUND',
  relativeToGround: 'Cesium.HeightReference.RELATIVE_TO_GROUND',
  absolute: 'Cesium.HeightReference.NONE'
}

export function convertToCesiumFromSimpleStyle (style, inPlace) {
  if (!style) return {}
  const convertedStyle = (inPlace ? style : {})
  _.forOwn(style, (value, key) => {
    if (_.has(CesiumStyleMappings, key)) {
      const mapping = _.get(CesiumStyleMappings, key)
      // Convert from string to color object as required by cesium
      if ((typeof value === 'string') && ['markerColor', 'fill', 'stroke'].includes(mapping)) {
        _.set(convertedStyle, mapping, Color.fromCssColorString(chroma(value).alpha(_.get(convertedStyle, [mapping, 'alpha'], 1)).css()))
      } else {
        _.set(convertedStyle, mapping, value)
      }
      if (inPlace) _.unset(style, key)
    }
  })
  return convertedStyle
}

export function convertToCesiumFromStyle (feature) {
  const style = _.get(feature, 'style', false)
  if (!style || !_.get(feature, 'geometry')) return {}

  let geometryType = _.get(GeoJsonGeometryTypesToCesiumEntityMappings, _.get(feature, 'geometry.type'))
  if (!geometryType) return {}

  const convertedStyle = {}
  const additionalFeatures = []

  const entityStyle = {}
  _.forOwn(style, (value, key) => {
    if ((typeof value === 'string') && ['color'].includes(key)) {
      let cesiumColor = Color.fromCssColorString(value)
      if (_.has(style, 'opacity')) {
        cesiumColor = Color.fromAlpha(cesiumColor, _.get(style, 'opacity'))
      }
      _.set(entityStyle, _.get(StyleToCesiumEntityStyleMappings, key), cesiumColor)
    } else if (key === 'altitudeMode') {
      _.set(entityStyle, _.get(StyleToCesiumEntityStyleMappings, key), _.get(AltitudeModesMappings, value))
      // Clamp to ground is used by polylines
      _.set(entityStyle, 'clampToGround', value === 'clampToGround')
    } else if (key === 'extrude') {
      switch (geometryType) {
        case 'polygon':
          // Extrude from ellipsoid to point height
          _.set(entityStyle, 'extrudedHeight', 0)
          _.set(entityStyle, 'perPositionHeight', true)
          break
        case 'polyline':
          // Convert polyline to wall if extruded
          geometryType = 'wall'
          break
      }
    } else if (key === 'icon') {
      // Convert to billboard if entity has an icon
      geometryType = 'billboard'
      _.set(entityStyle, 'image', _.get(value, 'url'))
    } else {
      const target = _.get(StyleToCesiumEntityStyleMappings, key)
      if (target) _.set(entityStyle, target, value)
    }
  })

  if (geometryType === 'polygon' && !_.has(style, 'extrude') && (!_.has(style, 'altitudeMode') || style.altitudeMode === 'clampToGround')) {
    // Force perPositionHeight to false, for clamped to ground polygons
    _.set(entityStyle, 'perPositionHeight', false)

    // Cesium does not support outlines for clamped to ground polygons, so we convert them to polylines
    // In the case of a clamped to ground filled polygon with outline, the outline will not display
    if (_.get(style, 'opacity') === 0) {
      geometryType = 'polyline'
      _.set(convertedStyle, 'geometry.type', 'LineString')
      _.set(convertedStyle, 'geometry.coordinates', _.get(feature, 'geometry.coordinates[0]'))
      _.set(convertedStyle, 'style.opacity', _.get(style, 'stroke.opacity', 1))
      _.set(entityStyle, 'clampToGround', true)
    } else {
      // Create new feature for oultine
      const polylineFeature = _.cloneDeep(feature)
      _.set(polylineFeature, 'geometry.type', 'LineString')
      _.set(polylineFeature, 'geometry.coordinates', _.get(feature, 'geometry.coordinates[0]'))
      _.set(polylineFeature, 'properties.entityStyle.polyline', entityStyle)
      additionalFeatures.push(polylineFeature)
    }
  }

  _.set(convertedStyle, ['properties', 'entityStyle', geometryType], entityStyle)

  if (['point', 'billboard'].includes(geometryType)) {
    _.set(convertedStyle, 'properties.entityStyle.label', {
      text: _.get(feature, 'properties.name', '').trim(),
      heightReference: _.get(entityStyle, _.get(StyleToCesiumEntityStyleMappings, 'altitudeMode'), 'Cesium.HeightReference.CLAMP_TO_GROUND')
    })
  }

  return { convertedStyle, additionalFeatures }
}

function processStyle (style, feature, options, mappings) {
  if (!options) return
  const cesiumOptions = options.cesium || options
  // We allow to template style properties according to feature,
  // because it can be slow you have to specify a subset of properties
  const context = Object.assign({ properties: feature.properties, feature, chroma, moment, Units, Time }, TemplateContext.get())
  if (cesiumOptions.template) {
    // Create the map of variables
    if (options.variables) context.variables = _.reduce(options.variables,
        (result, variable) => Object.assign(result, { [variable.name]: variable }), {})
    cesiumOptions.template.forEach(entry => {
      _.set(style, _.get(mappings, _.kebabCase(entry.property), entry.property), entry.compiler(context))
    })
  }

  // visibility attribute can be used to hide individual features
  // visibility is true by default but can also be a string when it's
  // a result of a lodash string template evaluation
  let visibility = _.get(style, `style.${type}.visibility`, _.get(style, 'style.visibility', true))
  if (typeof visibility === 'string') visibility = visibility === 'true'
  // The 'kdk-hidden-features' pane is created when the leaflet map is initialized
  // if (!visibility) _.set(style, `style.${type}.pane`, 'kdk-hidden-features')

  return style
}

export function getPointSimpleStyle (feature, options, engine, engineStylePath = 'style.point') {
  const engineStyle = _.get(engine, engineStylePath, {})
  const layerStyle = options ? _.get(options.cesium || options, 'layerPointStyle') : {}
  const featureStyle = feature.style ? _.get(feature, 'style', {}) : convertSimpleStyleToPointStyle(feature.properties)
  const style = _.merge({}, engineStyle, layerStyle, featureStyle)
  processStyle({ style: { point: style } }, feature, options, PointStyleTemplateMappings)
  return convertSimpleStyleColors(convertPointStyleToSimpleStyle(style))
}

export function getLineSimpleStyle (feature, options, engine, engineStylePath = 'style.line') {
  const engineStyle = _.get(engine, engineStylePath, {})
  const layerStyle = options ? _.get(options.cesium || options, 'layerLineStyle') : {}
  const featureStyle = feature.style ? _.get(feature, 'style', {}) : convertSimpleStyleToLineStyle(feature.properties)
  const style = _.merge({}, engineStyle, layerStyle, featureStyle)
  processStyle({ style: { line: style } }, feature, options, LineStyleTemplateMappings)
  return convertSimpleStyleColors(convertLineStyleToSimpleStyle(style))
}

export function getPolygonSimpleStyle (feature, options, engine, engineStylePath = 'style.polygon') {
  const engineStyle = _.get(engine, engineStylePath, {})
  const layerStyle = options ? _.get(options.cesium || options, 'layerPolygonStyle') : {}
  const featureStyle = feature.style ? _.get(feature, 'style', {}) : convertSimpleStyleToPolygonStyle(feature.properties)
  const style = _.merge({}, engineStyle, layerStyle, featureStyle)
  processStyle({ style: { polygon: style } }, feature, options, PolygonStyleTemplateMappings)
  return convertSimpleStyleColors(convertPolygonStyleToSimpleStyle(style))
}

// Helper to convert from string to objects
export function createCesiumObject () {
  const args = Array.from(arguments)
  const constructor = args[0]
  args.shift()
  const Class = _.get(Cesium, constructor)
  // Can be callable, constructable or constant
  let object
  if (typeof Class === 'function') {
    try { object = Class(...args) } catch (error) { /* Simply avoid raising any error */ }
    try { object = new Class(...args) } catch (error) { /* Simply avoid raising any error */ }
  } else object = Class
  return object
}

export function convertToCesiumObjects (style) {
  const mapValue = (value) => {
    if (typeof value === 'object') {
      const type = value.type
      const options = value.options
      if (type && options) {
        const constructor = type.replace('Cesium.', '')
        // Take care to nested objects as constructor arguments
        let args
        if (options.type) {
          // Create argument object
          args = convertToCesiumObjects({ object: options })
          args = args.object
        } else {
          args = convertToCesiumObjects(options)
        }
        if (Array.isArray(options)) return createCesiumObject(constructor, ...args)
        else return createCesiumObject(constructor, args)
      } else return convertToCesiumObjects(value)
    } else if (typeof value === 'string') {
      if (value.startsWith('Cesium.')) {
        const constructor = value.replace('Cesium.', '')
        return createCesiumObject(constructor)
      }
      const n = _.toNumber(value)
      if (_.isFinite(n)) value = n
    }
    return value
  }
  if (typeof style === 'object') {
    if (Array.isArray(style)) return style.map(mapValue)
    else return _.mapValues(style, mapValue)
  } else {
    return _.mapValues({ value: style }, mapValue).value
  }
}
