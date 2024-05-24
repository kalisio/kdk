import _ from 'lodash'

export * from './utils.offline.js'

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

// Remove diac
export function makeDiacriticPattern (pattern, options = {}) {
  // List of families of diacritics, the first character in a family is the one without a diacritic
  const diacritics = ['a,á,à,ä,â,ã', 'e,é,ë,è,ê', 'i,í,ï,ì,î', 'o,ó,ö,ò,õ,ô', 'u,ü,ú,ù,û', 'c,ç']
  let result = ''
  // Loop over all pattern characters
  for (const character of pattern) {
    // Iterate over all diacritics to find matching one if any
    const family = diacritics.find(family => {
      // The reverse option is used to allow for any diacristic or
      // the character without a diacristic to be matched by any other one
      if (options.reverse) return family.includes(character)
      // Otherwise by default we allow to match all diacristics
      // for the character without a diacristic but not the other way around
      else return family[0] === character
    })
    // If not a diacritic simply leave as it
    if (!family) result += character
    else result += `[${family}]`
  }
  return result
}
