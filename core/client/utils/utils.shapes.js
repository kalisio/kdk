import _ from 'lodash'
import { uid } from 'quasar'

const shapes = {
  circle: {
    viewBox: "0 0 100 100",
    content: '<circle cx="50" cy="50" r="50" />'
  },
  rect: {
    viewBox: '0 0 100 100',
    content: '<rect cx="0" cy="0" width="100" height="100" />'
  },
  'rounded-rect': {
    viewBox: '0 0 100 100',
    content: '<rect cx="0" cy="0" width="100" height="100" rx="20" ry="20" />'
  },
  diamond: {
    viewBox: '0 0 100 100',
    content: '<polygon points="50 0, 100 50, 50 100, 0 50" />'
  },
  triangle: {
    viewBox: '0 0 100 100',
    content: '<polygon points="50 0, 100 100, 0 100" />'
  },
  'triangle-down': {
    viewBox: '0 0 100 100',
    content: '<polygon points="0 0, 100 0, 50 100" />'
  },
  'triangle-left': {
    viewBox: '0 0 100 100',
    content: '<polygon points="0 50, 100 0, 100 100" />'
  }, 
  'triangle-right': {
    viewBox: '0 0 100 100',
    content: '<polygon points="0 0, 100 50, 0 100" />'
  },  
  star: {
    viewBox: '0 0 48 48',
    content: '<path d="m24,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z" />'
  },
  'marker-pin': {
    viewBox: '0 0 384 512',
    content: '<path d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0s192 86 192 192z" />',
    icon: {
      yOffset: '-80%'
    }
  },
  'square-pin': {
    viewBox: '5 0 45 50',
    content: '<path d="M45 1h-40v40h15.093l5.439 8.05 5.44-8.05h14.028z" />'
  }
}

function addTagAttribute (tag, attibute, value) {
  return tag.slice(0, -1) + ` ${attibute}="${value}">`
}

function addSvgAttribute (svg, attibute, value) {
  return svg.slice(0, -2) + ` ${attibute}="${value}" />`
}

/*
 Utility to create a shape with the following options:
  - type: String | Object : name of the predefined shape object specifyinfg the viewBox and the content
  - width : Number
  - height : Number
  - fill: String - the fill color
  - fillOpacity: Number - the fill opacity
  - stroke: String - the stroke color
  - strokeWidth: Number - the stroke width - 0
  - strokeLineCap: String - the stroke line-cap - 'butt'
  - strokeLineJoin: String - the stroke line-join - 'miter'
  - icon: Object specifying an icon overlay
    - class: String - the icon class
    - color: String - the icon color
    - size: Number - the icon size in pixel - 14
    - xOffset: String - the x offset from the center of the shape - '-50%'
    - yOffset: String - the y offset from the center of the shape - '-50%'
*/
export function createShape (options) {
  let shape
  const width = options.width || 24
  const height = options.height || 24
  // div container
  const beginDivTag = `<div style="position: relative; width: ${width}px; height: ${height}px;">`
  const endDivTag = '</div>'
  // svg shape
  let beginSvgTag = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" preserveAspectRatio="none">`
  let svgShapeContent = ''
  let svgClipPath = ''
  const endSvgTag = '</svg>'
  // check shape property
  if (!options.shape) {
    console.warn('[KDK] property \'shape\' must be defined')
    return beginDivTag + endDivTag
  }
  if (typeof options.shape === 'object') {
    // use custom shape
    shape = options.shape
    beginSvgTag = addTagAttribute(beginSvgTag, 'viewBox', shape.viewBox)
    svgShapeContent = shape.content
  } else if (typeof options.shape === 'string') {
    // use predefined shape
    shape = shapes[options.shape]
    console.log(shape, options.shape)
    if (shape) {
      console.log(shape)
      beginSvgTag = addTagAttribute(beginSvgTag, 'viewBox', shape.viewBox)
      svgShapeContent = shape.content
    } else {
      console.warn(`[KDK] unknow shape ${options.shape}`)
      return beginDivTag + endDivTag
    }
  } else {
    console.warn('[KDK] invalid \'shape\' property type')
    return beginDivTag + endDivTag
  }
  // apply style      
  if (options.fill) svgShapeContent = addSvgAttribute(svgShapeContent, 'fill', options.fill)
  if (options.fillOpacity) svgShapeContent = addSvgAttribute(svgShapeContent, 'fill-opacity', options.fillOpacity)
  const strokeWidth = options.strokeWidth || 0
  if (options.stroke && options.strokeWidth > 0) {
    svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke', options.stroke)
    // prevent scaling stroke
    svgShapeContent = addSvgAttribute(svgShapeContent, 'vector-effect', 'non-scaling-stroke')
    // draw inner stroke by double the width and clip the shape by itself
    // see https://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn
    svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-width', strokeWidth * 2)
    //if (options.strokeLineCap) svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-linecap', options.strokeLineCap)
    //if (options.strokeLinejoin) svgShapeContent = addSvgAttribute(svgShapeContent, 'stroke-linejoin', options.strokeLineJoin)
    const clipId = uid()
    svgShapeContent = addSvgAttribute(svgShapeContent, 'clip-path', `url(#${clipId})`)
    svgClipPath = `<clipPath id="${clipId}">${_.clone(svgShapeContent)}</clipPath>`
    console.log(svgClipPath)
  }
  // add icon overlay
  let iconTag = ''
  if (options.icon) {
    iconTag = '<i '
    iconTag += `class="${options.icon.class}" `
    const color = options.icon.color || 'white'
    const size = options.icon.size || 16
    const xOffset = options.icon.xOffset || _.get(shape, 'icon.xOffset', '-50%')
    const yOffset = options.icon.yOffset || _.get(shape, 'icon.yOffset', '-50%')
    iconTag += `style="position: absolute; top: 50%; left: 50%; transform: translate(${xOffset},${yOffset}); color: ${color}; font-size: ${size}px;"`
    iconTag += '/>'
  }
  console.log(svgShapeContent)
  return beginDivTag + beginSvgTag + svgClipPath + svgShapeContent + endSvgTag + iconTag + endDivTag
}