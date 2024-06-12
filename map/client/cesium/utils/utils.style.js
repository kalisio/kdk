import _ from 'lodash'
import chroma from 'chroma-js'
import moment from 'moment'
import { Color } from 'cesium'
import { Time, Units } from '../../../../core/client/index.js'
import { convertPointStyleToSimpleStyle, convertLineStyleToSimpleStyle, convertPolygonStyleToSimpleStyle, convertSimpleStyleColors,
         convertSimpleStyleToPointStyle, convertSimpleStyleToLineStyle, convertSimpleStyleToPolygonStyle,
         PointStyleTemplateMappings, LineStyleTemplateMappings, PolygonStyleTemplateMappings } from '../../utils/utils.style.js'
import { Cesium } from './utils.cesium.js'

export const CesiumStyleMappings = {
  stroke: 'stroke',
  'stroke-color': 'stroke',
  'stroke-opaciy': 'stroke.alpha',
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

export function convertToCesiumFromSimpleStyle (style, inPlace) {
  if (!style) return {}
  const convertedStyle = (inPlace ? style : {})
  _.forOwn(style, (value, key) => {
    if (_.has(CesiumStyleMappings, key)) {
      const mapping = _.get(CesiumStyleMappings, key)
      _.set(convertedStyle, mapping, value)
      if (inPlace) _.unset(style, key)
      // Convert from string to color object as required by cesium
      if ((typeof value === 'string') && ['markerColor', 'fill', 'stroke'].includes(mapping)) {
        _.set(convertedStyle, mapping, Color.fromCssColorString(value))
      }
    }
  })
  return convertedStyle
}

function processStyle (style, feature, options, mappings) {
  if (!options) return
  const cesiumOptions = options.cesium || options
  // We allow to template style properties according to feature,
  // because it can be slow you have to specify a subset of properties
  const context = { properties: feature.properties, feature, chroma, moment, Units, Time }
  if (cesiumOptions.template) {
    // Create the map of variables
    if (options.variables) context.variables = _.reduce(options.variables,
      (result, variable) => Object.assign(result, { [variable.name]: variable }), {})
    cesiumOptions.template.forEach(entry => {
      _.set(style, _.get(mappings, _.kebabCase(entry.property), entry.property), entry.compiler(context))
    })
  }
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
