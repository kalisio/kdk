// Get the unique global symbol to store event listeners on a leaflet object
const LISTENERS_KEY = Symbol.for('leaflet-event-listeners')

// Bind a set of events on given Leaflet object to a vue component
export function bindLeafletEvents (object, events, component, options) {
  object[LISTENERS_KEY] = []
  events.forEach(eventName => {
    const listener = (...args) => {
      if (options) component.$engineEvents.emit(eventName, options, ...args)
      else component.$engineEvents.emit(eventName, ...args)
    }
    object[LISTENERS_KEY].push(listener)
    object.on(eventName, listener)
  })
}

export function unbindLeafletEvents (object, events) {
  const listeners = object[LISTENERS_KEY]
  if (listeners) {
    events.forEach((eventName, index) => {
      object.off(eventName, object[LISTENERS_KEY][index])
    })
    delete object[LISTENERS_KEY]
  }
}

// Leaflet does not really manage touch events, it provides compatibility mapping with mouse events
// but it will not really trigger touch event from the map object, as a consequence we manage this by ourselves
export const TouchEvents = ['touchstart', 'touchmove', 'touchend' ,'touchcancel']

export const LeafletEvents = {
  Map: ['baselayerchange', 'overlayadd', 'overlayremove', 'layeradd', 'layerremove', 'zoomlevelschange',
    'resize', 'unload', 'viewreset', 'load',
    'zoomstart', 'boxzoomstart', 'boxselectionstart', 'movestart',
    'zoom', 'move', 'rotate',
    'zoomend', 'boxzoomend', 'boxselectionend', 'moveend',
    'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'contextmenu',
    'keypress', 'preclick', 'moveend', 'zoomanim', 'fullscreenchange'].concat(TouchEvents),
  Popup: ['add', 'remove'],
  Tooltip: ['add', 'remove'],
  Layer: ['add', 'remove', 'popupopen', 'popupclose', 'tooltipopen', 'tooltipclose'],
  Feature: ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'contextmenu',
    'dragstart', 'dragend', 'drag', 'movestart', 'moveend', 'move'].concat(TouchEvents),
  Cluster: ['spiderfied', 'unspiderfied']
}

