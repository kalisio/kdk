import { describe, it, expect } from 'vitest'
import { findClosestPaletteColor, getContrastColor, buildColorScale, QuasarPalette } from '../../../../../core/client/utils/utils.colors.js'

describe('utils.colors', () => {
  it('finds the exact palette color when given one of its values', () => {
    expect(findClosestPaletteColor(QuasarPalette.red)).to.equal('red')
  })

  it('finds the closest palette color for an arbitrary color', () => {
    // Slightly off the Quasar 'blue' swatch, should still resolve to 'blue'
    expect(findClosestPaletteColor('#2196f0')).to.equal('blue')
  })

  it('picks a light contrast color for a dark background', () => {
    expect(getContrastColor('#000000')).to.equal('white')
  })

  it('picks a dark contrast color for a light background', () => {
    expect(getContrastColor('#ffffff')).to.equal('black')
  })

  it('builds a color scale from a set of colors', () => {
    const scale = buildColorScale({ colors: ['red', 'blue'] })
    expect(scale(0).hex()).to.equal('#ff0000')
    expect(scale(1).hex()).to.equal('#0000ff')
  })

  it('builds a classed color scale honoring a custom domain', () => {
    const scale = buildColorScale({ colors: ['red', 'blue'], domain: [0, 100], classes: 2 })
    expect(scale(0).hex()).to.equal('#ff0000')
    expect(scale(100).hex()).to.equal('#0000ff')
  })
})
