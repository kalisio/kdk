import _ from 'lodash'

export const LeafletStyleMappings = {
  'z-index': 'pane',
  pane: 'pane',
  stroke: 'color',
  'stroke-color': 'color',
  'stroke-opacity': 'opacity',
  'stroke-width': 'weight',
  fill: 'fillColor',
  'fill-opacity': 'fillOpacity',
  'fill-color': 'fillColor',
  weight: 'weight',
  radius: 'radius',
  'line-cap': 'lineCap',
  'line-join': 'lineJoin',
  'dash-array': 'dashArray',
  'dash-offset': 'dashOffset',
  'marker-size': 'icon.options.iconSize',
  'marker-symbol': 'icon.options.iconUrl',
  'marker-color': 'icon.options.markerColor',
  'marker-type': 'type',
  'icon-color': 'icon.options.iconColor',
  'icon-size': 'icon.options.iconSize',
  'icon-anchor': 'icon.options.iconAnchor',
  'icon-classes': 'icon.options.iconClasses',
  'icon-html': 'icon.options.html',
  'icon-class': 'icon.options.className',
  'icon-x-offset': 'icon.options.iconXOffset',
  'icon-y-offset': 'icon.options.iconYOffset'
}
export const LeafletStyleOptions = _.values(LeafletStyleMappings)

// Get the unique global symbol to store event listeners on a leaflet object
const LISTENERS_KEY = Symbol.for('leaflet-event-listeners')
// Bind a set of events on given Leaflet object to a vue component
export function bindLeafletEvents (object, events, component, options) {
  object[LISTENERS_KEY] = []
  events.forEach(eventName => {
    const listener = (...args) => {
      if (options) component.$emit(eventName, options, ...args)
      else component.$emit(eventName, ...args)
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

export const LeafletEvents = {
  Map: ['baselayerchange', 'overlayadd', 'overlayremove', 'layeradd', 'layerremove', 'zoomlevelschange',
    'resize', 'unload', 'viewreset', 'load', 'zoomstart', 'movestart', 'zoom', 'move', 'zoomend', 'moveend',
    'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'contextmenu',
    'keypress', 'preclick', 'moveend', 'zoomanim', 'fullscreenchange'],
  Popup: ['add', 'remove'],
  Tooltip: ['add', 'remove'],
  Layer: ['add', 'remove', 'popupopen', 'popupclose', 'tooltipopen', 'tooltipclose'],
  Feature: ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'contextmenu',
    'dragstart', 'dragend', 'drag', 'movestart', 'moveend', 'move']
}

export function getHtmlTable (properties) {
  properties = _.pickBy(properties, value => !_.isNil(value))
  const keys = _.keys(properties)
  let html
  if (keys.length === 0) return null
  else if (keys.length === 1) html = _.get(properties, keys[0])
  else {
    const borderStyle = ' style="border: 1px solid black; border-collapse: collapse;"'
    html = '<table' + borderStyle + '>'
    html += keys
      .map(key => '<tr' + borderStyle + '><th' +
        borderStyle + '>' + key + '</th><th>' + _.get(properties, key) + '</th></tr>')
      .join('')
    html += '</table>'
  }
  return html
}
