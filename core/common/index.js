// We faced a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
// We tested the workaround given here https://github.com/babel/babel/issues/2877#issuecomment-270700000 with success so far
import _ from 'lodash'
import * as errors from './errors.js'
import * as permissions from './permissions.js'

export { errors }
export { permissions }

// Append a parameter value to a given URL
export function addQueryParameter (baseUrl, parameter, value) {
  // Check if this is the first parameter to be added or not
  const prefix = (baseUrl.includes('?') ? '&' : '?')
  return `${baseUrl}${prefix}${parameter}=${Array.isArray(value) ? JSON.stringify(value) : value}`
}

// Build an URL from a given set of parameters
export function buildUrl (baseUrl, parameters) {
  let url = baseUrl
  _.forOwn(parameters, function (value, key) {
    url = addQueryParameter(url, key, value)
  })
  return url
}

// Build an encoded URL from a given set of parameters
export function buildEncodedUrl (baseUrl, parameters) {
  return encodeURI(buildEncodedUrl(baseUrl, parameters))
}
