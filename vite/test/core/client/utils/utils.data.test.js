import { describe, it, expect } from 'vitest'
import { dataUriToBlob, base64Encode } from '../../../../../core/client/utils/utils.data.js'

describe('utils.data', () => {
  it('encodes a string to base64', () => {
    expect(base64Encode('hello')).to.equal('aGVsbG8=')
  })

  it('encodes byte-like values to base64', () => {
    const bytes = new Uint8Array([104, 101, 108, 108, 111])
    expect(base64Encode(bytes)).to.equal('aGVsbG8=')
  })

  it('converts a data URI to a Blob with the right size and MIME type', () => {
    const blob = dataUriToBlob('data:text/plain;base64,aGVsbG8=')
    expect(blob).to.be.instanceOf(Blob)
    expect(blob.type).to.equal('text/plain')
    expect(blob.size).to.equal(5)
  })
})
