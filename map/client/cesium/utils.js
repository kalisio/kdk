import _ from 'lodash'

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
