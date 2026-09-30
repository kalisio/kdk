export * from '@kalisio/kdk-core-common'
// Named (not star) re-export: these override the package's own colliding names
// (eg. buildUrl) with the historical kdk behavior implemented in utils.js
export { addQueryParameter, buildUrl, buildEncodedUrl, makeDiacriticPattern } from './utils.js'
export { makeServiceSnapshot } from './utils.offline.js'
