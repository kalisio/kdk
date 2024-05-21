import _ from 'lodash'
import logger from 'loglevel'
import { getCssVar } from 'quasar'
import chroma from 'chroma-js'

export const Colors = {
  white: '#fff',
  dark: '#333',
  red: '#f44336',
  pink: '#e91e63',
  purple: '#9c27b0',
  'deep-purple': '#673ab7',
  indigo: '#3f51b5',
  blue: '#2196f3',
  'light-blue': '#03a9f4',
  cyan: '#00bcd4',
  teal: '#009688',
  green: '#4caf50',
  'light-green': '#8bc34a',
  lime: '#cddc39',
  yellow: '#ffeb3b',
  amber: '#ffc107',
  orange: '#ff9800',
  'deep-orange': '#ff5722',
  brown: '#795548',
  grey: '#9e9e9e',
  'blue-grey': '#607d8b'
}

export function getHtmlColor (color, defaultColor) {
  if (!color) return defaultColor
  return getCssVar(color) || color
}

export function getPaletteFromColor (color) {
  // Check if already a color of the palette
  if (Colors[color]) return color
  else return _.findKey(Colors, item => item === color) || 'white'
}

export function getColorFromPalette (color) {
  // Check if already a RGB color
  if (color.startsWith('#')) return color
  else return Colors[color] || '#ffffff'
}

export function buildColorScale (options) {
  if (!options) {
    logger.warn(`[KDK] buildColorScale: 'options' argument must be defined`)
    return
  }
  let colors = options.colors 
  if (!colors)  {
    // For backward compatibility
    if (options.scale) {
      logger.warn(`[KDK] buildColorScale: please update 'scale' property to 'colors'`)
      colors = options.scale
    } else {
      logger.warn(`[KDK] buildColorScale: no colors defined, using default default colors 'Spectral'`)
      colors = 'Spectral'
    }
  }
  let scale = chroma.scale(colors)
  if (options.classes) {
    if (Array.isArray(options.classes)) {
      // The provided classes implicitly define the domain, then we omit the domain
      scale = scale.classes(options.classes)
    }
    else {
      // In this case, we need to take into account an optional domain
      if (options.domain) scale = scale.domain(options.domain).classes(options.classes)
      else scale = scale.classes(options.classes)
    }
  } else {
    // No classes defined, we need to take into account an optional domain
    if (options.domain) scale = scale.domain(options.domain)
  }
  return scale
}