import _ from 'lodash'
import { uid, getCssVar } from 'quasar'

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
    radiusToSize: (r) => { return [ Math.round(r * 2 * 0.9), Math.round(r * 2 * 0.9)]}
  },
  'rounded-rect': {
    viewBox: [0, 0, 100, 100],
    content: '<rect cx="0" cy="0" width="100" height="100" rx="20" ry="20" />',
    radiusToSize: (r) => { return [ Math.round(r * 2 * 0.9), Math.round(r * 2 * 0.9)]}
  },
  diamond: {
    viewBox: [0, 0, 100, 100],
    content: '<polygon points="50 0, 100 50, 50 100, 0 50" />',
    radiusToSize: (r) => { return [ Math.round(r * 2 * 1.2), Math.round(r * 2 * 1.2)]}
  },
  triangle: {
    viewBox: [0, 0, 100, 100],
    content: '<polygon points="50 0, 100 100, 0 100" />',
    radiusToSize: (r) => { return [ Math.round(r * 2 * 1.125), Math.round(r * 2 * 1.025)]}
  },
  'triangle-down': {
    viewBox: [0, 0, 100, 100],
    content: '<polygon points="0 0, 100 0, 50 100" />',
    radiusToSize: (r) => { return [ Math.round(r * 2 * 1.125), Math.round(r * 2 * 1.025)]}
  },
  'triangle-left': {
    viewBox: [0, 0, 100, 100],
    content: '<polygon points="0 50, 100 0, 100 100" />',
    radiusToSize: (r) => { return [ Math.round(r * 2 * 1.025), Math.round(r * 2 * 1.125)]}
  },
  'triangle-right': {
    viewBox: [0, 0, 100, 100],
    content: '<polygon points="0 0, 100 50, 0 100" />',
    radiusToSize: (r) => { return [ Math.round(r * 2 * 1.025), Math.round(r * 2 * 1.125)]}
  },
  star: {
    viewBox: [0, 0, 48, 48],
    content: '<path d="m24,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z" />',
    radiusToSize: (r) => { return [ Math.round(r * 2 * 1.4), Math.round(r * 2 * 1.4)]}
  },
  'marker-pin': {
    viewBox: [0, 0, 384, 512],
    content: '<path d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0s192 86 192 192z" />',
    icon: {
      yOffset: '-80%'
    }
  },
  'square-pin': {
    viewBox: [0, 0, 56, 56],
    content: '<path d="M 27.9532 52.3633 C 29.0079 52.3633 29.9923 51.9180 30.9298 50.3008 L 35.2657 43.0586 L 43.0938 43.0586 C 50.0783 43.0586 53.8280 39.1914 53.8280 32.3242 L 53.8280 14.3711 C 53.8280 7.5039 50.0783 3.6367 43.0938 3.6367 L 12.9064 3.6367 C 5.9454 3.6367 2.1720 7.4805 2.1720 14.3711 L 2.1720 32.3242 C 2.1720 39.2148 5.9454 43.0586 12.9064 43.0586 L 20.6407 43.0586 L 24.9766 50.3008 C 25.9142 51.9180 26.8985 52.3633 27.9532 52.3633 Z"/>',
    icon: {
      yOffset: '-80%'
    }
  }
}

const EmptyDiv = '<div />'

function addTagAttribute (tag, attibute, value) {
  return tag.slice(0, -1) + ` ${attibute}="${value}">`
}

function addSvgAttribute (svg, attibute, value) {
  return svg.slice(0, -2) + ` ${attibute}="${value}" />`
}

/*
 Utility to create a shape with the following options:
  - shape: String | Object - name of the predefined shape or object specifyinfg the viewBox and the content
  - size : Array - [width, height] of the maker
  - radius: Number - the radius to compute a "visual" size
  - color: String - the fill color
  - opacity: Number - the fill opacity
  - stroke: Object specifying the stroke properties
    - color: String - the stroke color
    - width: Number - the stroke width - 0
    - lineCap: String - the stroke linecap - 'butt'
    - lineJoin: String - the stroke linejoin - 'miter'
    - dashArray: String - the stroke dasharray - 'none'
    - dashOffset: Number - the stroke dashoffset - 0
  - icon: Object specifying an icon overlay
    - classes: String - the icon class
    - color: String - the icon color
    - opacity: Number - the icon opacity
    - size: Number - the icon size in pixel - 14
    - xOffset: String - the x offset from the center of the shape - '-50%'
    - yOffset: String - the y offset from the center of the shape - '-50%'
*/
export function createShape (options) {
  // Check arguments
  if (!options) {
    console.warn(`[KDK] 'options' argument is required`)
    return EmptyDiv
  }
  if (!options.shape) {
    console.warn(`[KDK] 'options.shape' property is required`)
    return EmptyDiv
  }
  // Retrieve the shape
  let shape
  if (typeof options.shape === 'object') shape = options.shape
  else {
    shape = Shapes[options.shape]
    if (!shape) {
      console.warn(`[KDK] unknow shape ${options.shape}`)
      return EmptyDiv
    }
  }
  // Define the size
  let width = 24
  let height = 24
  if (options.size) {
    width = options.size[0]
    height = options.size[1]
  } else {
    if (options.radius) {
      if (shape.radiusToSize) {
        const size = shape.radiusToSize(options.radius)
        width = size[0]
        height = size[1]
      } else {
        width = options.radius * 2
        height = options.radius * 2
      }
    }
  }
  // Set div container vars
  const beginDivTag = `<div style="position: relative; width: ${width}px; height: ${height}px;">`
  const endDivTag = '</div>'
  // Set svg shape vars
  let beginSvgTag = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" preserveAspectRatio="none">`
  beginSvgTag = addTagAttribute(beginSvgTag, 'viewBox', _.join(shape.viewBox, ' '))
  let svgShapeContent = shape.content
  let svgClipPath = ''
  const endSvgTag = '</svg>'
  // Apply fill style
  const color = options.color || getCssVar('primary')
  svgShapeContent = addSvgAttribute(svgShapeContent, 'fill', color)
  if (options.opacity) svgShapeContent = addSvgAttribute(svgShapeContent, 'fill-opacity', options.opacity)
  // Aply stroke style
  if (options.stroke) {
    // Ensure the stroke color is defined and not transparent
    const strokeColor = options.stroke.color || 'transparent'
    if (strokeColor !== 'transparent') {
      svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke', strokeColor)
      // draw inner stroke by double the width and clip the shape by itself
      // see https://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn
      const strokeWidth = options.stroke.width || 1
      svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-width', strokeWidth * 2)
      // prevent scaling stroke
      svgShapeContent = addSvgAttribute(svgShapeContent, 'vector-effect', 'non-scaling-stroke')
      // additional properties
      if (options.stroke.lineCap) svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-linecap', options.stroke.lineCap)
      if (options.stroke.linejoin) svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-linejoin', options.stroke.lineJoin)
      if (options.stroke.dashArray) svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-dasharray', options.stroke.dashArray)
      if (options.stroke.dashOffset) svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-dashoffset', options.stroke.dashOffset)
      const clipId = uid()
      // clip the shape to avoid stroke overflow
      svgShapeContent = addSvgAttribute(svgShapeContent, 'clip-path', `url(#${clipId})`)
      svgClipPath = `<clipPath id="${clipId}">${_.clone(shape.content)}</clipPath>`
    }
  }
  // Apply icon style
  let iconTag = ''
  if (options.icon) {
    iconTag = '<i '
    iconTag += `class="${options.icon.classes}" `
    const color = options.icon.color || 'white'
    const opacity = options.icon.opacity || 1
    const size = options.icon.size || 16
    const xOffset = options.icon.xOffset || _.get(shape, 'icon.xOffset', '-50%')
    const yOffset = options.icon.yOffset || _.get(shape, 'icon.yOffset', '-50%')
    iconTag += `style="position: absolute; top: 50%; left: 50%; transform: translate(${xOffset},${yOffset}); color: ${color}; opacity: ${opacity}; font-size: ${size}px;"`
    iconTag += '/>'
  }
  return beginDivTag + beginSvgTag + svgClipPath + svgShapeContent + endSvgTag + iconTag + endDivTag
}

