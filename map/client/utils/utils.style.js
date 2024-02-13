import _ from 'lodash'
import { utils as kdkCoreUtils } from '../../../core/client/index.js'

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
