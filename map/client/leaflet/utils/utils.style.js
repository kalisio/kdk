import _ from 'lodash'
import logger from 'loglevel'
import chroma from 'chroma-js'
import moment from 'moment'
import L from 'leaflet'
import { Time, Units, utils as kdkCoreUtils } from '../../../../core/client/index.js'
import { getFeatureStyleType } from '../../utils/utils.features.js'
import { convertStyle, convertSimpleStyleToPointStyle, convertSimpleStyleToLineStyle, convertSimpleStyleToPolygonStyle,
         PointStyleTemplateMappings, LineStyleTemplateMappings, PolygonStyleTemplateMappings } from '../../utils/utils.style.js'
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

const LineStyleToLeafletPath = {
  color: 'color',
  width: 'weight',
  opacity: 'opacity',
  cap: 'lineCap',
  join: 'lineJoin',
  dashArray: 'dashArray',
  dashOffset: 'dashOffset',
  pane: 'pane'
}

const PolygonStyleToLeafletPath = {
  color: 'fillColor',
  opacity: 'fillOpacity',
  rule: 'fillRule',
  pane: 'pane'
}

// TODO: to be removed when updating 3D style
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

export function createMarkerFromPointStyle (latlng, style) {
  if (!latlng) {
    logger.warn(`[KDK] 'latlng' should be defined`)
    return
  }
  return L.shapeMarker(latlng, style)
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
  const type = getFeatureStyleType(feature)
  if (leafletOptions.pane && !_.has(style, `${type}.pane`)) _.set(style, `${type}.pane`, leafletOptions.pane)
  if (leafletOptions.shadowPane && !_.has(style, `${type}.shadowPane`)) _.set(style, `${type}.shadowPane`, leafletOptions.shadowPane)
  return style
}

export function getDefaultPointStyle (feature, options, engine, engineStylePath = 'style.point') {
  const engineStyle = _.get(engine, engineStylePath, {})
  const layerStyle = options ? _.get(options.leaflet || options, 'layerPointStyle') : {}
  const featureStyle = feature.style ? _.get(feature, 'style', {}) : convertSimpleStyleToPointStyle(feature.properties)
  const style = Object.assign({}, engineStyle, layerStyle, featureStyle)
  processStyle({ style: { point: style } }, feature, options, PointStyleTemplateMappings)
  return style
}

export function getDefaultLineStyle (feature, options, engine, engineStylePath = 'style.line') {
  const engineStyle = _.get(engine, engineStylePath, {})
  const layerStyle = options ? _.get(options.leaflet || options, 'layerLineStyle') : {}
  const featureStyle = feature.style ? _.get(feature, 'style', {}) : convertSimpleStyleToLineStyle(feature.properties)
  const style = Object.assign({}, engineStyle, layerStyle, featureStyle)
  processStyle({ style: { line: style } }, feature, options, LineStyleTemplateMappings)
  return convertLineStyleToLeafletPath(style)
}

export function getDefaultPolygonStyle (feature, options, engine, engineStylePath = 'style.polygon') {
  const engineStyle = _.get(engine, engineStylePath, {})
  const layerStyle = options ? _.get(options.leaflet || options, 'layerPolygonStyle') : {}
  const featureStyle = feature.style ? _.get(feature, 'style', {}) : convertSimpleStyleToPolygonStyle(feature.properties)
  const style = Object.assign({}, engineStyle, layerStyle, featureStyle)
  processStyle({ style: { polygon: style } }, feature, options, PolygonStyleTemplateMappings)
  return convertPolygonStyleToLeafletPath(style)
}
