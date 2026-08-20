import { byte } from '@kalisio/common-core/utilities'

// Convert a data URI (eg data:image/png;base64,...) to a Blob
export function dataUriToBlob (dataUri) {
  return byte.dataUriToBlob(dataUri)
}

// Base64-encode a string or byte-like value (ArrayBuffer, TypedArray, array of numbers)
export function base64Encode (bytes) {
  return byte.toBase64(bytes)
}
