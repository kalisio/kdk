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