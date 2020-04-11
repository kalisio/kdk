import _ from 'lodash'
import { Notify, Loading } from 'quasar'

/**
 * This function allow you to modify a JS Promise by adding some status properties.
 * Based on: http://stackoverflow.com/questions/21485545/is-there-a-way-to-tell-if-an-es6-promise-is-fulfilled-rejected-resolved
 * But modified according to the specs of promises : https://promisesaplus.com/
 */
export function createQuerablePromise (promiseOrExecutor) {
  let promise = promiseOrExecutor
  if (typeof promiseOrExecutor === 'function') {
    promise = new Promise(promiseOrExecutor)
  }
  // Don't modify any promise that has been already modified.
  if (promise.isResolved) return promise

  // Set initial state
  let isPending = true
  let isRejected = false
  let isFulfilled = false

  // Observe the promise, saving the fulfillment in a closure scope.
  const result = promise.then(
    (value) => {
      isFulfilled = true
      isPending = false
      return value
    },
    (error) => {
      isRejected = true
      isPending = false
      throw error
    }
  )

  result.isFulfilled = () => { return isFulfilled }
  result.isPending = () => { return isPending }
  result.isRejected = () => { return isRejected }

  return result
}

export const Colors = {
  dark: '#333',
  red: '#f44336',
  pink: '#e91e63',
  purple: '#9c27b0',
  'deep-purple': '#673ab7',
  indigo: '#3f51b5',
  blue: '#2196f3',
  'light-blue': '#03a9f4',
  cyan: '#00bcd4',
  teal: '#009688',
  green: '#4caf50',
  'light-green': '#8bc34a',
  lime: '#cddc39',
  yellow: '#ffeb3b',
  amber: '#ffc107',
  orange: '#ff9800',
  'deep-orange': '#ff5722',
  brown: '#795548',
  grey: '#9e9e9e',
  'blue-grey': '#607d8b'
}

export function getPaletteFromColor (color) {
  return _.findKey(Colors, item => item === color)
}

export function getColorFromPalette (color) {
  return Colors[color]
}

export function getLocale () {
  const locale =
    navigator.language ||
    navigator.languages[0] ||
    navigator.browserLanguage ||
    navigator.userLanguage ||
    navigator.systemLanguage

  if (locale) {
    // see https://www.ietf.org/rfc/bcp/bcp47.txt
    const languageCodes = _.split(locale, '-')
    if (languageCodes.length > 0) return languageCodes[0]
  }
  // return undefined by default
}

export function getInitials (name) {
  const initials = name.toUpperCase().match(/\b\w/g) || []
  return initials.join('')
}

Notify.setDefaults({
  position: 'bottom-left',
  timeout: 5000,
  textColor: 'white',
  actions: [{ icon: 'close', color: 'white' }]
})

Loading.setDefaults({
  spinnerColor: 'primary',
  spinnerSize: 140,
  messageColor: 'white',
  customClass: 'full-width'
})

export function toast (options) {
  const type = options.type || 'negative'
  // Notify.create returns a function that, when invoked, hides the notification
  return Notify.create(Object.assign({
    color: (type === 'negative' ? 'red' : (type === 'warning' ? 'orange' : 'green'))
  }, _.omit(options, ['type'])))
}

// Extract icon name from a given icon property on a given target object
export function getIconName (object, path = 'icon.name') {
  // Make function work in a generic way, sometimes the provided input is directly the icon name
  const icon = (typeof object === 'object' ? _.get(object, path, '') : object)
  // Name icons to ensure backward compatibility with font awesome 4
  return (icon.startsWith('fa-') ? `fas ${icon}` : icon)
}

export function processIcon (object, path = 'icon.name') {
  // Process icons for backward compatibility with font awesome 4
  _.set(object, path, getIconName(object, path))
}

export function dotify (object) {
  var dotifiedObject = {}
  function recurse (object, current) {
    _.forOwn(object, (value, key) => {
      var newKey = (current ? current + '.' + key : key) // joined key with dot
      if (value && typeof value === 'object') {
        recurse(value, newKey) // it's a nested object, so do it again
      } else {
        dotifiedObject[newKey] = value // it's not an object, so set the property
      }
    })
  }

  recurse(object)
  return dotifiedObject
}
