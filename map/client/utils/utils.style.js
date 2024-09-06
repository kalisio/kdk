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

// Process style expressed with templates in order to generate a non-templated style object for each property value with associated comparison operator.
// It relies on the assumption we have styles for a set of feature property values templated using if statements
// For instance if I want all linear features with property 'A' equals 'V' to be green,
// all linear features with property 'B' equals 'U' to be red, and all others to be blue (default style),
// the 'stroke' style property value once converted to template will be the following:
// if (properties.A === "V") { %>#00FF00<% } else
// if (properties.B === "U") { %>#FF0000<% } else
// { %>#0000FF<% }
// Input contains the layer engine options, possible templated properties, target style type (among 'point', 'line', 'polygon')
// Output consists in a default style object (else case) and a map of styles per property value (if statements)
export function processStyleTemplates (options, properties, styleType, defaultStyle, styles) {
  // First split after the last else statement to get default style values, then split after each if/else statement
  // We will have an array of template statements, actually one for each style property (i.e. stroke-width, marker-color, etc.)
  const templates = {}
  properties.forEach((property, index) => {
    const templateStatements = _.get(options, `style.${styleType}.${property}`).split('} else {')
    templates[property] = templateStatements[0].split(' else ').concat(templateStatements[1])
  })
  // Process default style values
  properties.forEach((property) => {
    // Default style value is contained in the last template statement
    let template = templates[property].pop()
    // Extract it using a regex
    template = template.match(/%>([^<%]+)<%/)[1]
    // Conversion from palette to RGB color is required
    const value = (property.includes('color') ? kdkCoreUtils.getPaletteFromColor(template) : template)
    // Convert to number whenever required
    const n = _.toNumber(value)
    if (_.isFinite(n)) {
      defaultStyle[property] = n
    } else {
      defaultStyle[property] = value
    }
  })
  // Then process all templated if statements
  // As all templates have the same conditional structure use the first template to extract property values
  const templatesStructure = templates[properties[0]]
  for (let index = 0; index < templatesStructure.length; index++) {
    const template = templatesStructure[index]
    // Identify used operator first
    const operators = ['===', '!==', '>', '<']
    const operator = _.find(operators, operator => template.includes(` ${operator} `))
    // Match properties + operator to get property name part
    const propertyNameRegex = new RegExp(`properties.([^${operator}]+)${operator}`, 'g')
    let propertyName = propertyNameRegex.exec(template)[1].trim()
    const isNumber = !propertyName.includes('.toString()')
    propertyName = propertyName.replace('.toString()', '')
    // Split at operator
    let propertyValue = template.split(` ${operator} `)[1]
    // Match until last parenthesis of the if expression to get property value part
    propertyValue = propertyValue.slice(0, propertyValue.indexOf(')'))
    // Omit enclosing quotes for strings
    propertyValue = propertyValue.replaceAll('"', '').trim()
    if (isNumber) propertyValue = _.toNumber(propertyValue)
    const style = { property: propertyName, value: propertyValue, operator }
    properties.forEach(property => {
      // Match %> <% block to get style values, e.g. icon colors/names
      const match = /%>([^<%]+)<%/g.exec(templates[property][index])
      const value = (match ? match[1].trim() : '')
      // Conversion from palette to RGB color is required
      style[property] = (property.includes('color')
        ? kdkCoreUtils.getPaletteFromColor(value)
        : (_.isNumber(value) ? Number(value) : value))
    })
    styles.push(style)
  }
}

// This function performs the opposite process of the previous one
export function generateStyleTemplates (properties, styleType, defaultStyle, styles, dotify = true) {
  const hasStyles = (styles.length > 0)
  const options = {}
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
    // Process all properties, for each property
    properties.forEach((property, index) => {
      // Conversion from palette to RGB color is required
      const value = (property.includes('color')
        ? kdkCoreUtils.getColorFromPalette(style[property])
        : style[property])
      let propertyName = style.property
      let propertyValue = style.value
      const propertyOperator = style.operator
      if (typeof propertyValue !== 'number') {
        propertyName = `${propertyName}.toString()`
        propertyValue = `"${propertyValue}"`
      }
      // Generate style value for given property value
      templates[index] += `if (properties.${propertyName} ${propertyOperator} ${propertyValue}) { %>${value}<% } else `
    })
  })
  // Process default style for each style property
  // If there are some styles based on feature property values it will be the last else statement
  // otherwise it will simply be the sole value in the template expression
  properties.forEach((property, index) => {
    // Conversion from palette to RGB color is required
    const value = (property.includes('color')
      ? kdkCoreUtils.getColorFromPalette(defaultStyle[property])
      : defaultStyle[property])
    // Avoid converting numbers to string on default values
    if (hasStyles) templates[index] += `{ %>${value}<% }`
    else templates[index] = value
  })
  // Set all templates
  properties.forEach((property, index) => {
    // We voluntary use dot notation here by default as this object should be used to update style values using a patch operation
    if (dotify) options[`style.${styleType}.${property}`] = (hasStyles ? `<% ${templates[index]} %>` : templates[index])
    else _.set(options, `style.${styleType}.${property}`, (hasStyles ? `<% ${templates[index]} %>` : templates[index]))
  })
  options.template = (hasStyles ? properties : []).map(property => `style.${styleType}.${property}`)
  return options
}
