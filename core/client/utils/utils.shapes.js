import _ from 'lodash'
import logger from 'loglevel'
import { uid } from 'quasar'
import { getHtmlColor } from './utils.colors.js'

const defaultSize = { width: 24, height: 24 }
const defaultColor = 'black'
const defaultIconSize = 12
const defaultTextSize = 12

function defaultRadiusToSize (r) {
  return { width: r * 2, height: r * 2 }
}

// Predefined shapes
// see https://www.svgrepo.com/ to look for a shape
export const Shapes = {
  circle: {
    viewBox: [0, 0, 100, 100],
    content: '<circle cx="50" cy="50" r="50" />'
  },
  rect: {
    viewBox: [0, 0, 100, 100],
    content: '<rect cx="0" cy="0" width="100" height="100" />',
    radiusToSize: (r) => { return { width: Math.round(r * 2 * 0.9), height: Math.round(r * 2 * 0.9) } }
  },
  'rounded-rect': {
    viewBox: [0, 0, 100, 100],
    content: '<rect cx="0" cy="0" width="100" height="100" rx="20" ry="20" />',
    radiusToSize: (r) => { return { width: Math.round(r * 2 * 0.9), height: Math.round(r * 2 * 0.9) } }
  },
  diamond: {
    viewBox: [0, 0, 100, 100],
    content: '<polygon points="50 0, 100 50, 50 100, 0 50" />',
    radiusToSize: (r) => { return { width: Math.round(r * 2 * 1.2), height: Math.round(r * 2 * 1.2) } }
  },
  triangle: {
    viewBox: [0, 0, 100, 100],
    content: '<polygon points="50 0, 100 100, 0 100" />',
    radiusToSize: (r) => { return { width: Math.round(r * 2 * 1.125), height: Math.round(r * 2 * 1.025) } }
  },
  'triangle-down': {
    viewBox: [0, 0, 100, 100],
    content: '<polygon points="0 0, 100 0, 50 100" />',
    radiusToSize: (r) => { return { width: Math.round(r * 2 * 1.125), height: Math.round(r * 2 * 1.025) } }
  },
  'triangle-left': {
    viewBox: [0, 0, 100, 100],
    content: '<polygon points="0 50, 100 0, 100 100" />',
    radiusToSize: (r) => { return { width: Math.round(r * 2 * 1.025), height: Math.round(r * 2 * 1.125) } }
  },
  'triangle-right': {
    viewBox: [0, 0, 100, 100],
    content: '<polygon points="0 0, 100 50, 0 100" />',
    radiusToSize: (r) => { return { width: Math.round(r * 2 * 1.025), height: Math.round(r * 2 * 1.125) } }
  },
  star: {
    viewBox: [0, 0, 48, 48],
    content: '<path d="m24,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z" />',
    radiusToSize: (r) => { return { width: Math.round(r * 2 * 1.4), height: Math.round(r * 2 * 1.4) } }
  },
  'marker-pin': {
    viewBox: [0, 0, 384, 512],
    content: '<path d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0s192 86 192 192z" />',
    icon: {
      translation: ['-50%', '-70%']
    },
    text: {
      translation: ['-50%', '-70%']
    },
    anchor: 'bottom-center'
  },
  'square-pin': {
    viewBox: [0, 0, 56, 56],
    content: '<path d="M 27.9532 52.3633 C 29.0079 52.3633 29.9923 51.9180 30.9298 50.3008 L 35.2657 43.0586 L 43.0938 43.0586 C 50.0783 43.0586 53.8280 39.1914 53.8280 32.3242 L 53.8280 14.3711 C 53.8280 7.5039 50.0783 3.6367 43.0938 3.6367 L 12.9064 3.6367 C 5.9454 3.6367 2.1720 7.4805 2.1720 14.3711 L 2.1720 32.3242 C 2.1720 39.2148 5.9454 43.0586 12.9064 43.0586 L 20.6407 43.0586 L 24.9766 50.3008 C 25.9142 51.9180 26.8985 52.3633 27.9532 52.3633 Z"/>',
    icon: {
      translation: ['-50%', '-75%']
    },
    text: {
      translation: ['-50%', '-60%']
    },
    anchor: 'bottom-center'
  }
}

/*
  Helper functions
*/
function addTagAttribute (tag, attibute, value) {
  return tag.slice(0, -1) + ` ${attibute}="${value}">`
}
function addSvgAttribute (svg, attibute, value) {
  return svg.slice(0, -2) + ` ${attibute}="${value}" />`
}

function getSize (size) {
  if (!Array.isArray(size)) return { width: size, height: size }
  return { width: size[0], height: size[1] }
}

/*
 Utility to create a shape with the following options:
  - shape: String | Object - name of the predefined shape or object specifying the following
    - viewBox: svg viewport definition
    - content: svg shape
    - translation: Array - the translation to apply from the center of the shape ['-50%', '-50%']
    - rotation: Number - the rotation to apply in degree
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
    - color: String - the icon color
    - opacity: Number - the icon opacity
    - size: Number - the icon size in pixel - 14
    - translation: Array - the translation to apply from the center of the shape ['-50%', '-50%']
    - rotation: Number - the rotation to apply in degree
  - text: Object specifying a text overlay
    - label: String - the label to display
    - classes: extra classes to apply to the text
    - color: String - the text color
    - size: Number - the font size in pixel - 14
    - translation: Array - the translation to apply from the center of the shape ['-50%', '-50%']
    - rotation: Number - the rotation to apply in degree
  - html: Object specifyinng an html overlay

*/
export function createShape (options) {
  // Check arguments
  if (!options) {
    logger.warn(`[KDK] 'options' argument is required`)
    return
  }
  // Define the anchor
  let anchor = 'middle-center'
  // Define the shape
  let shape
  if (options.shape && options.shape !== 'none') {
    if (typeof options.shape === 'object') shape = options.shape
    else {
      shape = Shapes[options.shape]
      if (!shape) {
        logger.warn(`[KDK] unknown shape '${options.shape}'. Using default shape 'circle'`)
        shape = Shapes['circle']
      }
    }
    anchor = shape.anchor || anchor
  }
  // Define the size
  let size = defaultSize
  if (options.size) {
    size = getSize(options.size)
  } else {
    if (options.radius) {
      const radiusToSize = _.get(shape, 'radiusToSize', defaultRadiusToSize)
      size = radiusToSize(options.radius)
    }
  }
  // Set div container vars
  const extraStyle = _.get(options, 'extraStyle', '')
  const beginDivTag = `<div style="position: relative; width: ${size.width}px; height: ${size.height}px; ${extraStyle}">`
  const endDivTag = '</div>'
  // Render shape
  let beginSvgTag = ''
  let svgShapeContent = ''
  let svgClipPath = ''
  let endSvgTag = ''
  if (shape) {
    const extraShapeStyle = shape.extraStyle || ''
    const translation = shape.translation || [0, 0]
    const rotation = shape.rotation || 0
    beginSvgTag = `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" preserveAspectRatio="none"
                  style="transform: translate(${translation[0]},${translation[1]}) rotate(${rotation}deg); ${extraShapeStyle}">`
    beginSvgTag = addTagAttribute(beginSvgTag, 'viewBox', _.join(shape.viewBox, ' '))
    svgShapeContent = shape.content
    svgClipPath = ''
    endSvgTag = '</svg>'
    // Apply fill style
    const color = getHtmlColor(options.color, defaultColor)
    svgShapeContent = addSvgAttribute(svgShapeContent, 'fill', color)
    if (options.opacity) svgShapeContent = addSvgAttribute(svgShapeContent, 'fill-opacity', options.opacity)
    // Aply stroke style
    if (options.stroke) {
      // Ensure the stroke color is defined and not transparent
      const strokeColor = getHtmlColor(options.stroke.color, defaultColor)
      if (strokeColor !== 'transparent') {
        svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke', strokeColor)
        // draw inner stroke by double the width and clip the shape by itself
        // see https://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn
        const strokeWidth = options.stroke.width || 1
        svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-width', strokeWidth * 2)
        // prevent scaling stroke
        svgShapeContent = addSvgAttribute(svgShapeContent, 'vector-effect', 'non-scaling-stroke')
        // additional properties
        if (options.stroke.cap) svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-linecap', options.stroke.cap)
        if (options.stroke.join) svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-linejoin', options.stroke.join)
        if (options.stroke.dashArray) svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-dasharray', options.stroke.dashArray)
        if (options.stroke.dashOffset) svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-dashoffset', options.stroke.dashOffset)
        const clipId = uid()
        // clip the shape to avoid stroke overflow
        svgShapeContent = addSvgAttribute(svgShapeContent, 'clip-path', `url(#${clipId})`)
        svgClipPath = `<clipPath id="${clipId}">${_.clone(shape.content)}</clipPath>`
      }
    }
  }
  // Render icon 
  let iconTag = ''
  if (options.icon) {
    if (!_.isNil(options.icon.classes) || !_.isNil(options.icon.url)) {
      if (!_.isEmpty(options.icon.classes) || !_.isEmpty(options.icon.url)) {
        let specificStyle = ''
        if (options.icon.url) {
          let iconSize = options.icon.size ? getSize(options.icon.size) : size
          iconTag = `<img src="${options.icon.url}" `
          // handle size
          iconTag += `width=${iconSize.width} height=${iconSize.height} `
        } else {
          iconTag += `<i class="${options.icon.classes}" `
          // handle color
          const color = getHtmlColor(options.icon.color, defaultColor)
          specificStyle += `color: ${color};`
          // handle size
          let iconSize = options.icon.size || defaultIconSize
          specificStyle += `font-size: ${iconSize}px;`
        }
        const opacity = options.icon.opacity || 1
        const translation = options.icon.translation || _.get(shape, 'icon.translation', ['-50%', '-50%'])
        const rotation = options.icon.rotation || _.get(shape, 'icon.rotation', 0)
        iconTag += `style="position: absolute; top: 50%; left: 50%; transform: translate(${translation[0]},${translation[1]}) rotate(${rotation}deg); opacity: ${opacity}; ${specificStyle}"`
        iconTag += '/>'
      }
    } else {
      logger.warn(`[KDK] icon must contain either the 'classes' property or the 'url' property`)
    }
  }
  // Render text 
  let textTag = ''
  if (options.text) {
    if (!_.isNil(options.text.label)) {
      if (!_.isEmpty(options.text.label)) {
        textTag = '<span '
        if (options.text.classes) textTag += `classes="${options.text.classes}" `
        const color = getHtmlColor(options.text.color, defaultColor)
        const textSize = options.text.size || defaultTextSize
        const translation = options.text.translation || _.get(shape, 'text.translation', ['-50%', '-50%'])
        const rotation = options.text.rotation || _.get(shape, 'icon.rotation', 0)
        const extraTextStyle = options.text.extraStyle || ''
        textTag += `style="position: absolute; 5px; top: 50%; left: 50%; transform: translate(${translation[0]},${translation[1]}) rotate(${rotation}deg); color: ${color}; font-size: ${textSize}px; ${extraTextStyle}"`
        textTag += '>'
        textTag += options.text.label
        textTag += '</span>'
      }
    } else {
      logger.warn(`[KDK] text must contain the 'label' property`)
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
    html: beginDivTag + beginSvgTag + svgClipPath + svgShapeContent + endSvgTag + iconTag + textTag + htmlTag + endDivTag,
    size,
    anchor
  }
}

