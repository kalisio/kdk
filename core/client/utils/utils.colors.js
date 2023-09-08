import _ from 'lodash'

export const Colors = {
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
