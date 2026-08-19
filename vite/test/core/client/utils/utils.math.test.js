import { describe, it, expect } from 'vitest'
import { clamp, easeOut } from '../../../../../core/client/utils/utils.math.js'

describe('utils.math', () => {
  it('clamps a value within bounds', () => {
    expect(clamp(5, 0, 3)).to.equal(3)
    expect(clamp(-5, 0, 3)).to.equal(0)
    expect(clamp(1, 0, 3)).to.equal(1)
  })

  it('eases out', () => {
    expect(easeOut(0)).to.equal(0)
    expect(easeOut(1)).to.equal(1)
  })
})
