import _ from 'lodash'
import { url, string } from '@kalisio/common-core/utilities'

export * from './utils.offline.js'

// Append a parameter value to a given URL
export function addQueryParameter (baseUrl, parameter, value) {
  if (value === undefined) return baseUrl
  return url.addQueryParam(baseUrl, { [parameter]: value })
}

// Build an URL from a given set of parameters
export function buildUrl (baseUrl, parameters) {
  // Preserve the historical no-op behavior of the previous hand-rolled version
  // for empty parameters, unlike common-core's url.addQueryParam which requires
  // a non-empty object
  if (_.isEmpty(parameters)) return baseUrl
  return url.addQueryParam(baseUrl, parameters)
}

// Build an encoded URL from a given set of parameters
// Note: unlike the previous hand-rolled version, buildUrl already percent-encodes
// parameter values, so no additional encoding step is required here
export function buildEncodedUrl (baseUrl, parameters) {
  return buildUrl(baseUrl, parameters)
}

// Remove diacritics
export function makeDiacriticPattern (pattern, options = {}) {
  return string.makeDiacriticPattern(pattern, options)
}
