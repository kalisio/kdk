import _ from 'lodash'
import { utils as kdkCoreUtils } from '../../../core/client/index.js'

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

export function convertToCesiumFromSimpleStyleSpec (style, inPlace) {
  if (!style) return {}
  const convertedStyle = (inPlace ? style : {})
  _.forOwn(style, (value, key) => {
    if (_.has(CesiumStyleMappings, key)) {
      const mapping = _.get(CesiumStyleMappings, key)
      _.set(convertedStyle, mapping, value)
      if (inPlace) _.unset(style, key)
      // Convert from string to color object as required by cesium
      if ((typeof value === 'string') && ['markerColor', 'fill', 'stroke'].includes(mapping)) {
        _.set(convertedStyle, mapping, Cesium.Color.fromCssColorString(value))
      }
    }
  })
  return convertedStyle
}

export function convertToCesiumObjects (style) {
  // Helper to convert from string to objects
  function createCesiumObject () {
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

export function convertCesiumHandlerEvent (type) {
  const buttonMapping = {
    left: 0,
    middle: 1,
    right: 2
  }
  const buttonMovement = type.split('_')
  const movement = buttonMovement[1].toLowerCase()
  let button = buttonMovement[0].toLowerCase()
  let name
  if (type.startsWith('PINCH')) name = 'pinch'
  else if (type.endsWith('CLICK')) name = 'click'
  else if (type.endsWith('DOUBLE_CLICK')) name = 'dblclick'
  else if (type.startsWith('WHEEL')) name = 'wheel'
  else name = 'mouse'

  if (name === 'mouse') {
    name += movement
    button = buttonMapping[button]
  } else if (name.endsWith('click')) {
    button = buttonMapping[button]
  } else if (name === 'pinch') {
    name += movement
    button = undefined
  } else {
    button = 1 // wheel
  }

  return { name, button }
}

export function getTextTable (properties) {
  properties = kdkCoreUtils.dotify(properties)
  properties = _.pickBy(properties, value => !_.isNil(value))
  const keys = _.keys(properties)
  let text
  if (keys.length === 0) return null
  else if (keys.length === 1) text = _.get(properties, keys[0])
  else {
    text = keys
      .map(key => key + ': ' + _.get(properties, key))
      .join('\n')
  }
  return text
}
