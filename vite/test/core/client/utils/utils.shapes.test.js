import { describe, it, expect } from 'vitest'
import { createShape, Shapes, registerShape } from '../../../../../core/client/utils/utils.shapes.js'

describe('utils.shapes', () => {
  it('exposes the predefined shape catalog', () => {
    expect(Object.keys(Shapes)).toEqual([
      'circle', 'rect', 'rounded-rect', 'diamond', 'triangle',
      'triangle-down', 'triangle-left', 'triangle-right', 'star', 'marker-pin', 'square-pin'
    ])
  })

  it('renders a shape as an svg wrapped in a sized, positioned div', () => {
    const shape = createShape({ shape: 'circle', color: 'red', size: 24 })
    expect(shape.size).toEqual({ width: 24, height: 24 })
    expect(shape.anchor).toBe('middle-center')
    expect(shape.html).toContain('<div')
    expect(shape.html).toContain('width: 24px; height: 24px;')
    expect(shape.html).toContain('<svg')
    expect(shape.html).toContain('<circle')
  })

  it('builds a strokeless shape without throwing', () => {
    // @kalisio/common-graphics computes margin from the stroke and requires margin > 0,
    // so a shape with no stroke at all is the case most likely to break
    expect(() => createShape({ shape: 'rect', color: 'blue', size: 24 })).not.toThrow()
  })

  it('applies a stroke', () => {
    const shape = createShape({ shape: 'circle', color: 'red', size: 24, stroke: { color: 'black', width: 2 } })
    expect(shape.html).toContain('stroke=')
    expect(shape.html).toContain('stroke-width="2"')
  })

  it('falls back to circle for an unknown shape', () => {
    const shape = createShape({ shape: 'not-a-shape', color: 'red', size: 24 })
    expect(shape.html).toContain('<circle')
  })

  it('uses the bottom-center anchor for a marker-pin', () => {
    const shape = createShape({ shape: 'marker-pin', color: 'blue', size: 32 })
    expect(shape.anchor).toBe('bottom-center')
  })

  // FIXME: Requires @kalisio/common-graphics > 0.9.0 not yet published.
  it('builds a star shape', () => {
    const shape = createShape({ shape: 'star', color: 'red', size: 24 })
    expect(shape.html).toContain('<svg')
    expect(shape.html).not.toContain('<circle')
  })

  // FIXME: Requires @kalisio/common-graphics > 0.9.0 not yet published.
  it('embeds a url-based icon directly into a shape\'s svg', () => {
    const shape = createShape({ shape: 'circle', color: 'red', size: 24, icon: { url: 'http://x/y.png' } })
    expect(shape.html).toContain('<svg')
    expect(shape.html).toContain('<image href="http://x/y.png"')
    expect(shape.html).not.toContain('<img ')
  })

  it('overlays a url-based icon as an img tag when there is no shape', () => {
    const shape = createShape({ shape: 'none', icon: { url: 'http://x/y.png' } })
    expect(shape.html).not.toContain('<svg')
    expect(shape.html).toContain('<img src="http://x/y.png"')
  })

  it('overlays raw html on top of a shape', () => {
    const shape = createShape({ shape: 'circle', color: 'red', size: 24, html: '<b>hi</b>' })
    expect(shape.html).toContain('<svg')
    expect(shape.html).toContain('<b>hi</b>')
  })

  it('renders a classes-based icon with no shape', () => {
    const shape = createShape({ shape: 'none', icon: { classes: 'fas fa-home', color: 'red' } })
    expect(shape.html).not.toContain('<svg')
    expect(shape.html).toContain('<i class="fas fa-home"')
  })

  it('renders a text label with no shape', () => {
    const shape = createShape({ shape: 'none', text: { label: 'hi' } })
    expect(shape.html).toContain('>hi</span>')
  })

  it('warns and returns undefined when no options are given', () => {
    expect(createShape()).toBeUndefined()
  })

  it('registers and builds a custom shape', () => {
    registerShape('__test-shape', () => ({ width: 10, height: 10, margin: 1, shape: '<rect width="10" height="10" fill="green" />' }))
    expect(Shapes['__test-shape']).toBe(true)
    const shape = createShape({ shape: '__test-shape', size: 10 })
    expect(shape.html).toContain('<rect width="10" height="10" fill="green" />')
  })
})
