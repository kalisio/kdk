import _ from 'lodash'
import L from 'leaflet'
import { utils as kCoreUtils } from '../../../core/client'

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
  properties = kCoreUtils.dotify(properties)
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

export function tile2key (coords) {
  // JS Number.MAX_SAFE_INTEGER = 2^53 - 1, so 53 bits available
  // put z value on  5 bits (0 - 32)
  // put y value on 24 bits (0 - 16777216)
  // put x value on 24 bits (0 - 16777216)
  // shift y by 5 bits (* 32)
  // shift x by 5+24 bits (* 536870912)
  return (coords.x * 536870912) + (coords.y * 32) + coords.z
}

export function key2tile (key) {
  // JS Number.MAX_SAFE_INTEGER = 2^53 - 1, so 53 bits available
  // put z value on  5 bits (0 - 32)
  // put y value on 24 bits (0 - 16777216)
  // put x value on 24 bits (0 - 16777216)
  // shift y by 5 bits (* 32)
  // shift x by 5+24 bits (* 536870912)
  const x = Math.floor(key / 536870912)
  const y = Math.floor((key - (x * 536870912)) / 32)
  const p = L.point(x, y)
  p.z = key - ((x * 536870912) + (y * 32))
  return p
}

export function tileSetContainsParent (tileset, coords) {
  const triplet = {
    x: coords.x,
    y: coords.y,
    z: coords.z
  }

  while (triplet.z > 1) {
    const tilekey = tile2key(triplet)
    if (tileset.has(tilekey)) return true

    triplet.x = Math.floor(triplet.x / 2)
    triplet.y = Math.floor(triplet.y / 2)
    triplet.z -= 1
  }

  return false
}

export function getParentTileInTileSet (tileset, coords) {
  const triplet = {
    x: coords.x,
    y: coords.y,
    z: coords.z
  }

  triplet.x = Math.floor(triplet.x / 2)
  triplet.y = Math.floor(triplet.y / 2)
  triplet.z -= 1

  while (triplet.z > 1) {
    const tilekey = tile2key(triplet)
    if (tileset.has(tilekey)) return triplet

    triplet.x = Math.floor(triplet.x / 2)
    triplet.y = Math.floor(triplet.y / 2)
    triplet.z -= 1
  }

  return undefined
}

export function computeIdealMaxNativeZoom (gridLayer, dataSetBounds, dataSetTileSize) {
  // compute optimal maxNativeZoom value to ensure
  // the smallest leaflet tile will approximately match a dataset tile

  // compute tile size farthest from equator
  const nw = dataSetBounds.getNorthWest()
  let z = 1
  while (true) {
    const nwPoint = gridLayer._map.project(nw, z)
    const coords = nwPoint.unscaleBy(gridLayer.getTileSize())
    coords.x = Math.floor(coords.x)
    coords.y = Math.floor(coords.y)
    coords.z = z

    const tileBounds = gridLayer._tileCoordsToBounds(coords)
    const tileWidth = tileBounds.getEast() - tileBounds.getWest()
    const tileHeight = tileBounds.getNorth() - tileBounds.getSouth()
    if (tileWidth < dataSetTileSize.lng || tileHeight < dataSetTileSize.lat) break

    z += 1
  }

  return Math.max(1, z - 1)
}
