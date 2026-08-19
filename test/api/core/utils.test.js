import chai from 'chai'
import chailint from 'chai-lint'
import { addQueryParameter, buildUrl, buildEncodedUrl, makeDiacriticPattern } from '../../../core/common/utils.js'

const { util, expect } = chai

describe('core:utils', () => {
  before(() => {
    chailint(chai, util)
  })

  it('adds a query parameter to a URL without one', () => {
    expect(addQueryParameter('http://kalisio.xyz/api', 'p', 1)).to.equal('http://kalisio.xyz/api?p=1')
  })

  it('adds a query parameter to a URL that already has one', () => {
    expect(addQueryParameter('http://kalisio.xyz/api?a=1', 'b', 2)).to.equal('http://kalisio.xyz/api?a=1&b=2')
  })

  it('builds a URL from a set of parameters', () => {
    expect(buildUrl('http://kalisio.xyz/api', { a: 1, b: 'two' })).to.equal('http://kalisio.xyz/api?a=1&b=two')
  })

  it('leaves the URL untouched when no parameters are given', () => {
    expect(buildUrl('http://kalisio.xyz/api', {})).to.equal('http://kalisio.xyz/api')
    expect(buildUrl('http://kalisio.xyz/api')).to.equal('http://kalisio.xyz/api')
  })

  it('builds an encoded URL from a set of parameters', () => {
    expect(buildEncodedUrl('http://kalisio.xyz/api', { a: 'é' })).to.equal('http://kalisio.xyz/api?a=%C3%A9')
  })

  it('builds a diacritic-insensitive pattern', () => {
    expect(makeDiacriticPattern('are')).to.equal('[aáàäâã]r[eéëèê]')
    // Characters without a diacritic family are left untouched
    expect(makeDiacriticPattern('xyz')).to.equal('xyz')
  })

  it('leaves already-accented characters untouched by default', () => {
    expect(makeDiacriticPattern('árë')).to.equal('árë')
  })
})
