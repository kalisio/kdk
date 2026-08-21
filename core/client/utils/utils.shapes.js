import _ from 'lodash'
import logger from 'loglevel'
import { ShapeFactory } from '@kalisio/common-graphics'
import { getHtmlColor } from './utils.colors.js'

const defaultSize = { width: 24, height: 24 }
const defaultColor = 'black'
const defaultIconSize = 12
const defaultTextSize = 12

const shapeFactory = new ShapeFactory()

// Curated subset of @kalisio/common-graphics' shape registry exposed by KDK. Keeping these exact
// names (rather than the full registry) preserves existing saved 'shape' values unchanged.
export const Shapes = {
  circle: true,
  rect: true,
  'rounded-rect': true,
  diamond: true,
  triangle: true,
  'triangle-down': true,
  'triangle-left': true,
  'triangle-right': true,
  star: true,
  'marker-pin': true,
  'square-pin': true
}

// Register a custom shape on top of the predefined catalog above, see @kalisio/common-graphics' ShapeFactory.register() for details.
export function registerShape (name, buildFn) {
  shapeFactory.register(name, buildFn)
  Shapes[name] = true
}

/*
  Helper functions
*/
function getSize (size) {
  if (!Array.isArray(size)) return { width: _.toNumber(size), height: _.toNumber(size) }
  return { width: _.toNumber(size[0]), height: _.toNumber(size[1]) }
}

/*
 Utility to create a shape with the following options:
  - shape: String - name of a predefined shape (see the 'Shapes' export), or 'none'
  - size : Array - [width, height] of the maker
  - radius: Number - the radius to compute a "visual" size. If the size is defined, the radius is omitted.
  - color: String - the fill color
  - opacity: Number - the fill opacity
  - stroke: Object specifying the stroke properties
    - color: String - the stroke color
    - width: Number - the stroke width - 0
    - opacity: Number - the stroke opacity - 1
    - cap: String - the stroke linecap - 'butt'
    - join: String - the stroke linejoin - 'miter'
    - dashArray: String - the stroke dasharray - 'none'
    - dashOffset: Number - the stroke dashoffset - 0
  - icon: Object specifying an icon overlay, can also be a custom L.Icon object instance
    - classes: String - the icon class
    - url: String - the icon url
    - color: String - the icon color (classes only, ignored when shape is set with a url icon)
    - opacity: Number - the icon opacity (only applied when shape is 'none', ignored otherwise)
    - size: Number - the icon size in pixel - 14
  - text: Object specifying a text overlay
    - label: String - the label to display
    - classes: extra classes to apply to the text
    - color: String - the text color
    - size: Number - the font size in pixel - 14
  - html: Object specifying an html overlay

  Note: unlike the previous implementation, icon/text rotation and translation overrides,
  the 'symbol' icon type and custom inline shape objects are no longer supported, as the
  underlying @kalisio/common-graphics shape renderer has no equivalent.
*/
export function createShape (options) {
  // Check arguments
  if (!options) {
    logger.warn('[KDK] \'options\' argument is required')
    return
  }
  let anchor = 'middle-center'
  let size = defaultSize
  // Render shape, delegating classes-based icon and text overlays to the shape renderer as it
  // embeds them directly into the generated SVG
  let svgContent = ''
  const hasShape = options.shape && options.shape !== 'none'
  const hasUrlIcon = options.icon && !_.isEmpty(options.icon.url)
  const hasClassesIcon = options.icon && !_.isEmpty(options.icon.classes)
  const hasText = options.text && !_.isEmpty(options.text.label)
  if (hasShape) {
    let shapeName = options.shape
    if (typeof shapeName !== 'string' || !shapeFactory.has(shapeName)) {
      logger.warn(`[KDK] unknown shape '${options.shape}'. Using default shape 'circle'`)
      shapeName = 'circle'
    }
    const params = { shape: shapeName }
    if (options.size) params.size = [getSize(options.size).width, getSize(options.size).height]
    else if (options.radius) params.radius = options.radius
    params.color = options.color ? getHtmlColor(options.color) : 'none'
    if (!_.isNil(options.opacity)) params.opacity = options.opacity
    if (options.stroke) {
      const strokeColor = getHtmlColor(options.stroke.color, defaultColor)
      if (strokeColor !== 'transparent') {
        params.stroke = {
          color: strokeColor,
          width: options.stroke.width || 1,
          opacity: options.stroke.opacity,
          dashArray: options.stroke.dashArray,
          dashOffset: options.stroke.dashOffset,
          lineCap: options.stroke.cap,
          lineJoin: options.stroke.join
        }
      }
    }
    // classes take priority over url when both are given, mirroring common-graphics' own
    // toSVGIconElement priority
    if (hasClassesIcon) {
      params.icon = {
        classes: options.icon.classes,
        color: getHtmlColor(options.icon.color, defaultColor),
        size: options.icon.size || defaultIconSize
      }
    } else if (hasUrlIcon) {
      params.icon = {
        url: options.icon.url,
        size: options.icon.size || defaultIconSize
      }
    }
    if (hasText) {
      params.text = {
        label: options.text.label,
        color: getHtmlColor(options.text.color, defaultColor),
        size: options.text.size || defaultTextSize
      }
    }
    const shape = shapeFactory.build(params)
    size = { width: shape.width, height: shape.height }
    anchor = shape.anchor || anchor
    svgContent = shape.toSVG()
  } else if (options.size) {
    size = getSize(options.size)
  } else if (options.radius) {
    size = { width: options.radius * 2, height: options.radius * 2 }
  }
  // Set div container vars
  const extraStyle = _.get(options, 'extraStyle', '')
  const idAttr = _.get(options, 'id') ? `id=${options.id}` : ''
  const beginDivTag = `<div ${idAttr} style="position: relative; width: ${size.width}px; height: ${size.height}px; ${extraStyle}">`
  const endDivTag = '</div>'
  // When there is a shape, the icon is embedded directly into its SVG by common-graphics (see
  // params.icon above). Without one, there is nothing to embed it into, so render it as a manual
  // overlay instead
  let iconTag = ''
  if ((hasUrlIcon || hasClassesIcon) && !hasShape) {
    let specificStyle = ''
    if (hasUrlIcon) {
      const iconSize = options.icon.size ? getSize(options.icon.size) : size
      iconTag = `<img src="${options.icon.url}" `
      iconTag += `width=${iconSize.width} height=${iconSize.height} `
    } else {
      iconTag += `<i class="${options.icon.classes}" `
      const color = getHtmlColor(options.icon.color, defaultColor)
      specificStyle += `color: ${color};`
      const iconSize = options.icon.size || defaultIconSize
      specificStyle += `font-size: ${iconSize}px;`
    }
    const opacity = options.icon.opacity || 1
    iconTag += `style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); opacity: ${opacity}; ${specificStyle}"`
    iconTag += '/>'
  } else if (options.icon && !hasUrlIcon && !hasClassesIcon) {
    logger.warn('[KDK] icon must contain either the \'classes\' property or the \'url\' property')
  }
  // Render text, when there is no shape to embed it into
  let textTag = ''
  if (options.text && !hasShape) {
    if (hasText) {
      textTag = '<span '
      if (options.text.classes) textTag += `classes="${options.text.classes}" `
      const color = getHtmlColor(options.text.color, defaultColor)
      const textSize = options.text.size || defaultTextSize
      const extraTextStyle = options.text.extraStyle || ''
      textTag += `style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); color: ${color}; font-size: ${textSize}px; ${extraTextStyle}"`
      textTag += '>'
      textTag += options.text.label
      textTag += '</span>'
    } else {
      logger.warn('[KDK] text must contain the \'label\' property')
    }
  }
  // Render html
  let htmlTag = ''
  if (options.html) {
    htmlTag = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">'
    htmlTag += options.html
    htmlTag += '</div>'
  }
  return {
    html: beginDivTag + svgContent + iconTag + textTag + htmlTag + endDivTag,
    size,
    anchor
  }
}
