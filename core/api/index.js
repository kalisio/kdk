export * from '@kalisio/kdk-core-api'
// Preserve historical names: default export used to be the app-init function (now named
// 'initialize'), and 'kdk' used to be the app factory (now named 'createApplication')
export { initialize as default, createApplication as kdk } from '@kalisio/kdk-core-api'

// Preserve the historical core/common overrides (see core/common/index.js) through this barrel too
export { addQueryParameter, buildUrl, buildEncodedUrl, makeDiacriticPattern } from '../common/utils.js'
export { makeServiceSnapshot } from '../common/utils.offline.js'
