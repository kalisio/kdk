import _ from 'lodash'
import chroma from 'chroma-js'
import moment from 'moment'
import L from 'leaflet'
import { Time, Units } from '../../../../core/client/index.js'
import { ShapeMarker } from '../ShapeMarker.js'

L.shapeMarker = function (latlng, options) {
  return new ShapeMarker(latlng, options)
}

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
  'marker-type': 'type',
  'marker-symbol': 'shape',
  'marker-size': 'size',
  'marker-color': 'fillColor',
  'marker-anchor': 'anchor',
  'icon-url': 'icon.iconUrl',
  'icon-html': 'icon.html',
  'icon-size': 'icon.iconSize',
  'icon-anchor': 'icon.iconAnchor',
  'icon-class': 'icon.className',
  'icon-color': 'icon.color',
  'icon-opacity': 'icon.opacity',
  'icon-classes': 'icon.classes',
  'icon-x-offset': 'icon.xOffset',
  'icon-y-offset': 'icon.yOffset'
}
export const LeafletStyleOptions = _.values(LeafletStyleMappings)

export function createLeafletIconFromStyle (iconStyle) {
  const iconOptions = iconStyle.options || iconStyle
  let type = 'icon'
  if (iconStyle.html) {
    type = 'divIcon'
    // Remove default background style
    if (!iconOptions.className) _.set(iconOptions, 'className', '')
  }
  return _.get(L, type)(iconOptions)
}

export function createLeafletMarkerFromStyle (latlng, markerStyle, feature) {
  let options
  if (markerStyle) {
    // Retrienve the options
    options = markerStyle.options || markerStyle
    // Retrieve the type
    const type = markerStyle.type || 'shapeMarker'
    if (type !== 'shapeMarker') {
      // parse icon options to create Leaflet icon
      if (markerStyle.icon) {
        const icon = createLeafletIconFromStyle(markerStyle.icon)
        options = Object.assign(_.omit(options, ['icon']), { icon })
      }
      return _.get(L, type || 'marker')(latlng, options)
    }
  }
  return L.shapeMarker(latlng, options)
}

export function convertToLeafletFromSimpleStyleSpec (style, inPlace) {
  if (!style) return {}
  const convertedStyle = (inPlace ? style : {})
  // Compute flags first because if updating in place options in style spec will be replaced
  let isIconSpec = _.has(style, 'icon')
  // First copy any icon spec as not supported by simple style spec
  if (isIconSpec) _.set(convertedStyle, 'icon', _.get(style, 'icon'))
  _.forOwn(style, (value, key) => {
    if (_.has(LeafletStyleMappings, key)) {
      const mapping = _.get(LeafletStyleMappings, key)
      // Specific options
      switch (key) {
        case 'marker-size':
        case 'marker-anchor':
        case 'icon-anchor':
          if (!Array.isArray(value)) value = [value, value]
          _.set(convertedStyle, mapping, value)
          break
        default:
          _.set(convertedStyle, mapping, value)
      }
      if (inPlace) _.unset(style, key)
      // In this case we have a marker with icon spec
      if (mapping.startsWith('icon')) isIconSpec = true
    }
  })
  if (isIconSpec) {
    // Select the right marker type based on icon properties if not already set
    if (!_.has(style, 'marker.type')) {
      if (_.has(style, 'icon-url') || _.has(style, 'icon-html')) _.set(convertedStyle, 'type', 'marker')
      else if (_.has(style, 'icon-classes')) _.set(convertedStyle, 'type', 'shapeMarker')
    }
  }
  // Manage panes to make z-index work for all types of layers,
  // pane name can actually be a z-index value
  if (_.has(convertedStyle, 'pane')) _.set(convertedStyle, 'pane', _.get(convertedStyle, 'pane').toString())
  if (_.has(convertedStyle, 'shadowPane')) _.set(convertedStyle, 'shadowPane', _.get(convertedStyle, 'shadowPane').toString())
  return convertedStyle
}

export function getDefaultMarker (feature, latlng, options, engine) {
  const properties = feature.properties
  const leafletOptions = options.leaflet || options
  const style = Object.assign({},
    _.get(engine, 'pointStyle'),
    leafletOptions.layerStyle,
    convertToLeafletFromSimpleStyleSpec(feature.style || feature.properties))
  // We allow to template style properties according to feature,
  // because it can be slow you have to specify a subset of properties
  const context = { properties, feature, chroma, moment, Units, Time }
  if (leafletOptions.template) {
    // Create the map of variables
    if (options.variables) context.variables = _.reduce(options.variables,
      (result, variable) => Object.assign(result, { [variable.name]: variable }), {})
    leafletOptions.template.forEach(entry => {
      // Perform templating, set using simple spec mapping first then raw if property not found
      _.set(style, _.get(LeafletStyleMappings, entry.property, entry.property), entry.compiler(context))
    })
  }
  // We manage panes for z-index, so we need to forward it to marker options (only if not already defined)
  if (leafletOptions.pane && !style.pane) style.pane = leafletOptions.pane
  if (leafletOptions.shadowPane && !style.shadowPane) style.shadowPane = leafletOptions.shadowPane
  return (latlng ? createLeafletMarkerFromStyle(latlng, style) : style)
}

export function getDefaultStyle (feature, options, engine) {
  const properties = feature.properties
  const leafletOptions = options.leaflet || options
  const style = Object.assign({},
    _.get(engine, 'featureStyle'),
    leafletOptions.layerStyle,
    convertToLeafletFromSimpleStyleSpec(feature.style || feature.properties))

  // We allow to template style properties according to feature,
  // because it can be slow you have to specify a subset of properties
  const context = { properties, feature, chroma, moment, Units, Time }
  if (leafletOptions.template) {
    // Create the map of variables
    if (options.variables) context.variables = _.reduce(options.variables,
      (result, variable) => Object.assign(result, { [variable.name]: variable }), {})
    leafletOptions.template.forEach(entry => {
      // Perform templating, set using simple spec mapping first then raw if property not found
      _.set(style, _.get(LeafletStyleMappings, entry.property, entry.property), entry.compiler(context))
    })
  }
  // We manage panes for z-index, so we need to forward it to marker options (only if not already defined)
  if (leafletOptions.pane && !style.pane) style.pane = leafletOptions.pane
  if (leafletOptions.shadowPane && !style.shadowPane) style.shadowPane = leafletOptions.shadowPane
  return style
}