import _ from 'lodash'
import { getCssVar } from 'quasar'
import { utils as kdkCoreUtils } from '../../../core/client/index.js'

export const IconStyleToSimpleStyle = {
  size: 'marker-size',
  color: 'marker-color',
  url: 'marker-symbol'
}

export const PointStyleToSimpleStyle = {
  shape: 'marker-symbol',
  size: 'marker-size',
  color: 'marker-color',
  'icon.url': 'marker-symbol'
}

export const SimpleStyleToPointStyle = {
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
  'icon': 'icon.url',
  'icon-url': 'icon.url',
  'icon-html': 'html',
  'icon-color': 'icon.color',
  'icon-size': 'icon.size',
  'icon-anchor': 'anchor',
  'icon-class': 'icon.classes',
  'icon-opacity': 'icon.opacity',
  'icon-classes': 'icon.classes',
  'icon-translate': 'icon.translate',
  'icon-rotate': 'icon.rotate',
  'z-index': 'pane',
  pane: 'pane',
}

export const PointStyleTemplateMappings = {
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
  'icon-translate': 'style.point.icon.translate',
  'z-index': 'style.point.pane',
  pane: 'style.point.pane',
}

export const LineStyleToSimpleStyle = {
  color: 'stroke',
  width: 'stroke-width',
  opacity: 'stroke-opacity'
}

export const SimpleStyleToLineStyle = {
  stroke: 'color',
  'stroke-color': 'color',
  'stroke-opacity': 'opacity',
  'stroke-width': 'width',
  'dash-array': 'dashArray',
  'dash-offset': 'dashOffset',
  weight: 'width',
  'z-index': 'pane',
  pane: 'pane',
}

export const LineStyleTemplateMappings = {
  stroke: 'style.line.color',
  'stroke-color': 'style.line.color',
  'stroke-opacity': 'style.line.opacity',
  'stroke-width': 'style.line.width',
  weight: 'style.line.width',
  'line-cap': 'style.line.cap',
  'line-join': 'style.line.join',
  'dash-array': 'style.line.dashArray',
  'dash-offset': 'style.line.dashOffset',
  'z-index': 'style.line.pane',
  pane: 'style.line.pane'
}

export const PolygonStyleToSimpleStyle = {
  color: 'fill',
  opacity: 'fill-opacity'
}

export const SimpleStyleToPolygonStyle = {
  stroke: 'stroke.color',
  'stroke-color': 'stroke.color',
  'stroke-opacity': 'stroke.opacity',
  'stroke-width': 'stroke.width',
  fill: 'color',
  'fill-color': 'color',  
  'fill-opacity': 'opacity',
  'z-index': 'pane',
  pane: 'pane',
}

export const PolygonStyleTemplateMappings = {
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

export const SimpleStyleNumbers = ['marker-size', 'stroke-width', 'stroke-opacity', 'fill-opacity']

export const DefaultStyle = {
  isVisible: true,
  isSelectable: true,
  point: {
    color: 'red',
    opacity: 0.5,
    size: 24,
    shape: 'circle',
    stroke: {
      color: 'red',
      width: 3,
      opacity: 1
    },
    icon: {
      classes: '',
      color: 'black',
      opacity: 1,
      size: 12
    }
  },
  line: {
    color: 'red',
    width: 3,
    opacity: 1
  },
  polygon: {
    color: 'red',
    opacity: 0.5,
    stroke: {
      color: 'red',
      width: 3,
      opacity: 1
    }
  },
  leaflet: {
    cluster: { disableClusteringAtZoom: 18 }
  },
  cesium: {
    cluster: { pixelRange: 80 }
  }
}

// Map properties of a given style according to given mapping, performing number conversion if required
export function convertStyle (style, mapping, asNumber = []) {
  let convertedStyle = {}
  _.forOwn(style, (value, key) => {
    const mappedKey = _.get(mapping, key)
    if (mappedKey) _.set(convertedStyle, mappedKey, asNumber.includes(mappedKey) ? _.toNumber(value) : value)
  })
  return convertedStyle
}

export function convertSimpleStyleColors (style) {
  // Convert from quasar color palette to actual color
  _.forOwn(style, (value, key) => {
    if (['stroke', 'fill', 'marker-color'].includes(key)) {
      const color = getCssVar(value)
      if (color) _.set(style, key, color)
    }
  })
  return style
}

export function convertPointStyleToSimpleStyle (style) {
  return style ? Object.assign(convertStyle(style.icon, IconStyleToSimpleStyle, SimpleStyleNumbers), convertStyle(style, PointStyleToSimpleStyle, SimpleStyleNumbers)) : {}
}

export function convertSimpleStyleToPointStyle (style) {
  return style ? convertStyle(style, SimpleStyleToPointStyle) : {}
}

export function convertLineStyleToSimpleStyle (style) {
  return style ? convertStyle(style, LineStyleToSimpleStyle, SimpleStyleNumbers) : {}
}

export function convertSimpleStyleToLineStyle (style) {
  //logger.warn('KDK] SimpleSpec is limited and might be depracated. Consider using Kalisio Style spec instead')  
  return style ? convertStyle(style, SimpleStyleToLineStyle) : {}
}

export function convertPolygonStyleToSimpleStyle (style) {
  return style ? Object.assign(convertStyle(style, PolygonStyleToSimpleStyle, SimpleStyleNumbers), convertLineStyleToSimpleStyle(style.stroke)) : {}
}

export function convertSimpleStyleToPolygonStyle (style) {
  //logger.warn('KDK] SimpleSpec is limited and might be depracated. Consider using Kalisio Style spec instead')
  return style ? convertStyle(style, SimpleStyleToPolygonStyle) : {}
}

// Only gets the default style from templates
// Meaning the values in the last else statement
export function getDefaultStyleFromTemplates(options) {
  const out = {}
  options = kdkCoreUtils.dotify(options)
  _.forIn(options, (value, key) => {
    if (!_.isString(value)) {
      _.set(out, key, value)
      return
    }
    const match = value.match(/} else { %>(.*)<% } %>/)
    if (match) {
      _.set(out, key, match[1])
    } else {
      _.set(out, key, value)
    }
  })
  return out
}

// Generates style templates based on multiple conditions
// defaultStyle is the default style to be used if no condition is met
// styles is an array of objects containing conditions and values
// it must me in the form:
// [{
//   conditions: [{ booleanOperator: String, property: String, comparisonOperator: String, value: String|Number|Array<String> }, ...],
//   values: Object => This object is the style to be applied when the conditions are met
// }, ...]
export function generateStyleTemplates (defaultStyle, styles, dotify = true) {
  const hasStyles = (styles.length > 0)
  const options = {}
  const properties = _.keys(kdkCoreUtils.dotify(_.pick(DefaultStyle, ['point', 'line', 'polygon'])))
  const templates = properties.map(property => '')
  // Process all styles, a style is a matching feature property value associated with a style property values.
  // It is expressed as a if statement in the final template expression of the style property.
  // For instance if I want all linear features with property 'A' equals 'V' to be green,
  // all linear features with property 'B' equals 'U' to be red, and all others to be blue (default style),
  // the 'stroke' style property value once converted to template will be the following:
  // if (properties.A === "V") { %>#00FF00<% } else
  // if (properties.B === "U") { %>#FF0000<% } else
  // { %>#0000FF<% }
  styles.forEach(style => {
    let predicate = ''
    // Generate predicate from conditions
    style.conditions.forEach((condition, index) => {
      const boolOp = index === 0 ? '' : condition.booleanOperator === 'and' ? ' && ' : ' || '
      const name = typeof condition.value !== 'number' ? `${condition.property}.toString()` : condition.property
      if (['in', 'nin'].includes(condition.comparisonOperator)) {
        const value = condition.value.map(v => typeof v !== 'number' ? `"${v}"` : v).join(',')
        const not = condition.comparisonOperator === 'nin' ? '!' : ''
        predicate += `${boolOp}${not}[${value}].includes(properties.${name})`
      } else {
        const compOp = { eq: '===', ne: '!==', gt: '>', gte: '>=', lt: '<', lte: '<=' }[condition.comparisonOperator]
        const value = typeof condition.value !== 'number' ? `"${condition.value}"` : condition.value
        predicate += `${boolOp}properties.${name} ${compOp} ${value}`
      }
    })

    // Process all properties, for each property
    properties.forEach((property, index) => {
      if (!_.has(style.values, property)) return
      // Conversion from palette to RGB color is required
      const value = (property.includes('color')
        ? kdkCoreUtils.getColorFromPalette(_.get(style.values, property))
        : _.get(style.values, property))
      // Generate style value for given property value
      templates[index] += `if (${predicate}) { %>${value}<% } else `
    })
  })
  // Process default style for each style property
  // If there are some styles based on feature property values it will be the last else statement
  // otherwise it will simply be the sole value in the template expression
  properties.forEach((property, index) => {
    if (!_.has(defaultStyle, property)) return
    // Conversion from palette to RGB color is required
    const value = (property.includes('color')
      ? kdkCoreUtils.getColorFromPalette(_.get(defaultStyle, property))
      : _.get(defaultStyle, property))
    // Avoid converting numbers to string on default values
    if (hasStyles) templates[index] += `{ %>${value}<% }`
    else templates[index] = value
  })
  // Set all templates
  properties.forEach((property, index) => {
    if (!_.has(defaultStyle, property)) return
    // We voluntary use dot notation here by default as this object should be used to update style values using a patch operation
    if (dotify) options[`style.${property}`] = (hasStyles ? `<% ${templates[index]} %>` : templates[index])
    else _.set(options, `style.${property}`, (hasStyles ? `<% ${templates[index]} %>` : templates[index]))
  })
  options.template = (hasStyles ? properties : []).map(property => `style.${property}`)
  return options
}

// Extract conditions in the form :
// [{ booleanOperator: String, property: String, comparisonOperator: String, value: String|Number|Array<String> }, ...]
// from a filter query
export function filterQueryToConditions (query) {
  const deepParseQuery = (subquery, conditions, nextBooleanOperator = null) => {
    if (!subquery) return
    const nextBoolOp = _.keys(subquery)[0]
    let property
    let comparisonOperator
    let value
    if (nextBoolOp === '$and' || nextBoolOp === '$or') {
      property = _.keys(subquery[nextBoolOp][0])[0]
      comparisonOperator = _.keys(subquery[nextBoolOp][0][property])[0]
      value = subquery[nextBoolOp][0][property][comparisonOperator]
    } else {
      property = _.keys(subquery)[0]
      comparisonOperator = _.keys(subquery[property])[0]
      value = subquery[property][comparisonOperator]
    }

    conditions.push({
      index: conditions.length,
      booleanOperator: nextBooleanOperator ? nextBooleanOperator.replace('$', '') : nextBooleanOperator,
      property: property.replace('properties.', ''),
      comparisonOperator: comparisonOperator.replace('$', ''),
      value
    })

    if (nextBoolOp === '$and' || nextBoolOp === '$or') {
      deepParseQuery(subquery[nextBoolOp][1], conditions, nextBoolOp)
    }
  }

  const conditions = []
  deepParseQuery(query, conditions)
  return conditions
}
