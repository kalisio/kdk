import _ from 'lodash'
import logger from 'loglevel'
import chroma from 'chroma-js'
import moment from 'moment'
import L from 'leaflet'
import { Time, Units, utils as kdkCoreUtils } from '../../../../core/client/index.js'
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
  'marker-symbol': 'style.point.shape',
  'marker-size': 'style.point.size',
  'marker-color': 'style.point.color',
  'marker-anchor': 'style.point.anchor',
  'icon-url': 'style.point.icon.url',
  'icon-html': 'style.point.html',
  'icon-color': 'style.point.icon.color',
  'icon-size': 'style.point.icon.size',
  'icon-anchor': 'style.point.anchor',
  'icon-class': 'style.point.icon.classes',
  'icon-opacity': 'style.point.icon.opacity',
  'icon-classes': 'style.point.icon.classes',
  'icon-x-offset': 'style.point.icon.xOffset',
  'icon-y-offset': 'style.point.icon.yOffset',
  'style-line-color': 'color',
  'style-line-width': 'weight',
  'style-line-opacity': 'opacity',
  'style-line-cap': 'lineCap',
  'style-line-join': 'lineJoin',
  'style-line-dash-array': 'dashArray',
  'style-line-dash-offset': 'dashOffset',
  'style-polygon-color': 'fillColor',
  'style-polygon-opacity': 'fillOpacity',
  'style-polygon-rule': 'fillRule',
  'style-polygon-stroke-color': 'color',
  'style-polygon-stroke-width': 'weight',
  'style-polygon-stroke-opacity': 'opacity',
  'style-polygon-stroke-cap': 'lineCap',
  'style-polygon-stroke-join': 'lineJoin',
  'style-polygon-stroke-dash-array': 'dashArray',
  'style-polygon-stroke-dash-offset': 'dashOffset'
}

const SimpleStylePointToPointStyle = {
  fill: 'color',
  'fill-opacity': 'opacity',
  radius: 'radius',
  stroke: 'stroke.color',
  'marker-symbol': 'shape',
  'marker-size': 'size',
  'marker-color': 'color',
  'marker-anchor': 'anchor',
  'stroke-color': 'stroke.color',
  'stroke-opacity': 'stroke.opacity',
  'stroke-width': 'stroke.width',
  'icon-url': 'icon.url',
  'icon-html': 'html',
  'icon-color': 'icon.color',
  'icon-size': 'icon.size',
  'icon-anchor': 'anchor',
  'icon-class': 'icon.classes',
  'icon-opacity': 'icon.opacity',
  'icon-classes': 'icon.classes',
  'icon-x-offset': 'icon.xOffset',
  'icon-y-offset': 'icon.yOffset',
  'icon-rotate': 'icon.rotate',
  'z-index': 'pane',
  pane: 'pane',
}

const PointStyleTemplateMappings = {
  stroke: 'style.point.stroke.color',
  'stroke-color': 'style.point.stroke.color',
  'stroke-opacity': 'style.point.stroke.opacity',
  'stroke-width': 'style.point.stroke.width',
  fill: 'style.point.color',
  'fill-opacity': 'style.point.opacity',
  'fill-color': 'style.point.color',
  weight: 'style.point.stroke.width',
  radius: 'style.point.radius',
  'line-cap': 'style.point.stroke.lineCap',
  'line-join': 'style.point.stroke.lineJoin',
  'dash-array': 'style.point.stroke.dashArray',
  'dash-offset': 'style.point.stroke.dashOffset',
  'marker-symbol': 'style.point.shape',
  'marker-size': 'style.point.size',
  'marker-color': 'style.point.color',
  'marker-anchor': 'style.point.anchor',
  'icon-url': 'style.point.icon.url',
  'icon-html': 'style.point.html',
  'icon-color': 'style.point.icon.color',
  'icon-size': 'style.point.icon.size',
  'icon-anchor': 'style.point.anchor',
  'icon-class': 'style.point.icon.classes',
  'icon-opacity': 'style.point.icon.opacity',
  'icon-classes': 'style.point.icon.classes',
  'icon-x-offset': 'style.point.icon.xOffset',
  'icon-y-offset': 'style.point.icon.yOffset',
  'z-index': 'style.point.pane',
  pane: 'style.point.pane',
}

const SimpleStyleToLineStyle = {
  stroke: 'color',
  'stroke-color': 'color',
  'stroke-opacity': 'opacity',
  'stroke-width': 'width',
  weight: 'width',
  'z-index': 'pane',
  pane: 'pane',
}

const LineStyleTemplateMappings = {
  stroke: 'style.line.color',
  'stroke-color': 'style.line.color',
  'stroke-opacity': 'style.line.opacity',
  'stroke-width': 'style.line.width',
  weight: 'style.line.width',
  'line-cap': 'style.line.cap',
  'line-join': 'style.line.join',
  'dash-array': 'style.linee.dashArray',
  'dash-offset': 'style.line.dashOffset',
  'z-index': 'style.line.pane',
  pane: 'style.line.pane'
}

const SimpleStyleToPolygonStyle = {
  stroke: 'stroke.color',
  'stroke-color': 'stroke.color',
  'stroke-opacity': 'stroke.opacity',
  'stroke-width': 'sroke.width',
  fill: 'color',
  'fill-color': 'color',  
  'fill-opacity': 'opacity',
  'z-index': 'pane',
  pane: 'pane',
}

const PolygonStyleTemplateMappings = {
  stroke: 'style.polygon.stroke.color',
  'stroke-color': 'style.polygon.stroke.color',
  'stroke-opacity': 'style.polygon.stroke.opacity',
  'stroke-width': 'style.polygon.stroke.width',
  fill: 'style.polygon.color',
  'fill-opacity': 'style.polygon.opacity',
  'fill-color': 'style.polygon.color',
  weight: 'style.polygon.stroke.width',
  'line-cap': 'style.polygon.stroke.cap',
  'line-join': 'style.polygon.stroke.join',
  'dash-array': 'style.polygon.stroke.dashArray',
  'dash-offset': 'style.polygon.stroke.dashOffset',
  'z-index': 'style.polygon.pane',
  pane: 'style.polygon.pane',
}

const LineStyleToLeafletPath = {
  color: 'color',
  width: 'weight',
  opacity: 'opacity',
  cap: 'lineCap',
  join: 'lineJoin',
  dashArray: 'dashArray',
  dashOffset: 'dashOffset'
}

const PolygonStyleToLeafletPath = {
  color: 'fillColor',
  opacity: 'fillOpacity',
  rule: 'fillRule',
}

//export const LeafletStyleOptions = _.values(LeafletStyleMappings)

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

export function createLeafletMarkerFromStyle (latlng, markerStyle) {
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

export function createMarkerFromPointStyle (latlng, style) {
  if (!latlng) {
    logger.warn(`[KDK] 'latlng' should be defined`)
    return
  }
  return L.shapeMarker(latlng, style)
}

export function convertToLeafletFromSimpleStyleSpec (style, inPlace) {
  if (!style) return {}
  const leafletStyle = (inPlace ? style : {})
  // Compute flags first because if updating in place options in style spec will be replaced
  let isIconSpec = _.has(style, 'icon')
  // First copy any icon spec as not supported by simple style spec
  if (isIconSpec) _.set(leafletStyle, 'icon', _.get(style, 'icon'))
  _.forOwn(style, (value, key) => {
    if (_.has(LeafletStyleMappings, key)) {
      const mapping = _.get(LeafletStyleMappings, key)
      // Specific options
      switch (key) {
        case 'marker-size':
        case 'marker-anchor':
        case 'icon-anchor':
          if (!Array.isArray(value)) value = [value, value]
          _.set(leafletStyle, mapping, value)
          break
        default:
          _.set(leafletStyle, mapping, value)
      }
      if (inPlace) _.unset(style, key)
      // In this case we have a marker with icon spec
      if (mapping.startsWith('icon')) isIconSpec = true
    }
  })
  if (isIconSpec) {
    // Select the right marker type based on icon properties if not already set
    if (!_.has(style, 'marker.type')) {
      if (_.has(style, 'icon-url') || _.has(style, 'icon-html')) _.set(leafletStyle, 'type', 'marker')
      else if (_.has(style, 'icon-classes')) _.set(leafletStyle, 'type', 'shapeMarker')
    }
  }
  // Manage panes to make z-index work for all types of layers,
  // pane name can actually be a z-index value
  if (_.has(leafletStyle, 'pane')) _.set(leafletStyle, 'pane', _.get(leafletStyle, 'pane').toString())
  if (_.has(leafletStyle, 'shadowPane')) _.set(leafletStyle, 'shadowPane', _.get(leafletStyle, 'shadowPane').toString())
  return leafletStyle
}

function convertStyle (style, mapping) {
  let convertedStyle = {}
  _.forOwn(style, (value, key) => {
    const mappedKey = _.get(mapping, key)
    if (mappedKey) _.set(convertedStyle, mappedKey, value)
  })
  return convertedStyle
}

export function convertSimpleStyleToPointStyle (style) {
  //logger.warn('KDK] SimpleSpec is limited and might be depracated. Consider using Kalisio Style spec instead')
  return style ? convertStyle(style, SimpleStylePointToPointStyle) : {}
}

export function convertSimpleStyleToLineStyle (style) {
  //logger.warn('KDK] SimpleSpec is limited and might be depracated. Consider using Kalisio Style spec instead')  
  return style ? convertStyle(style, SimpleStyleToLineStyle) : {}
}

export function convertSimpleStyleToPolygonStyle (style) {
  //logger.warn('KDK] SimpleSpec is limited and might be depracated. Consider using Kalisio Style spec instead')
  return style ? convertStyle(style, SimpleStyleToPolygonStyle) : {}
}

export function convertLineStyleToLeafletPath (style) {
  if (!style) return
  let leafletStyle = convertStyle(style, LineStyleToLeafletPath)
  // handle quasar color/default if needed
  leafletStyle.color = kdkCoreUtils.getHtmlColor(leafletStyle.color, 'black')
  return leafletStyle
}

export function convertPolygonStyleToLeafletPath (style) {
  if (!style) return
  let leafletStyle = convertStyle(style, PolygonStyleToLeafletPath)
  Object.assign(leafletStyle, convertLineStyleToLeafletPath(style.stroke))
  // handle quasar/default color if needed
  leafletStyle.fillColor = kdkCoreUtils.getHtmlColor(leafletStyle.fillColor, 'black')
  return leafletStyle
}

function processStyle (style, feature, options, mappings) {
  if (!options) return
  const leafletOptions = options.leaflet || options
  // We allow to template style properties according to feature,
  // because it can be slow you have to specify a subset of properties
  const context = { properties: feature.properties, feature, chroma, moment, Units, Time }
  if (leafletOptions.template) {
    // Create the map of variables
    if (options.variables) context.variables = _.reduce(options.variables,
      (result, variable) => Object.assign(result, { [variable.name]: variable }), {})
    leafletOptions.template.forEach(entry => {
      _.set(style, _.get(mappings, _.kebabCase(entry.property), entry.property), entry.compiler(context))
    })
  }
  // We manage panes for z-index, so we need to forward it to marker options (only if not already defined)
  if (leafletOptions.pane && !style.pane) style.pane = leafletOptions.pane
  if (leafletOptions.shadowPane && !style.shadowPane) style.shadowPane = leafletOptions.shadowPane
  return style
}

export function getDefaultPointStyle (feature, options, engine, engineStylePath = 'style.point') {
  const engineStyle = _.get(engine,engineStylePath, {})
  const layerStyle = options ? _.get(options.leaflet || options, 'layerPointStyle') : {}
  const featureStyle = feature.style ? _.get(feature, 'style', {}) : convertSimpleStyleToLineStyle(feature.properties)
  const style = Object.assign({}, engineStyle, layerStyle, featureStyle)
  processStyle({ style: { point: style } }, feature, options, PointStyleTemplateMappings)
  return style
}

export function getDefaultLineStyle (feature, options, engine, engineStylePath = 'style.line') {
  const engineStyle = _.get(engine,engineStylePath, {})
  const layerStyle = options ? _.get(options.leaflet || options, 'layerLineStyle') : {}
  const featureStyle = feature.style ? _.get(feature, 'style', {}) : convertSimpleStyleToLineStyle(feature.properties)
  const style = Object.assign({}, engineStyle, layerStyle, featureStyle)
  processStyle({ style: { line: style } }, feature, options, LineStyleTemplateMappings)
  return convertLineStyleToLeafletPath(style)
}

export function getDefaultPolygonStyle (feature, options, engine, engineStylePath = 'style.polygon') {
  const engineStyle = _.get(engine,engineStylePath, {})
  const layerStyle = options ? _.get(options.leaflet || options, 'layerPolygonStyle') : {}
  const featureStyle = feature.style ? _.get(feature, 'style', {}) : convertSimpleStyleToLineStyle(feature.properties)
  const style = Object.assign({}, engineStyle, layerStyle, featureStyle)
  processStyle({ style: { polygon: style } }, feature, options, PolygonStyleTemplateMappings)
  return convertPolygonStyleToLeafletPath(style)
}
