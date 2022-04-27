import _ from 'lodash'
import moment from 'moment'
import emailValidator from 'email-validator'
import config from 'config'
import { Platform, Notify, Dialog, Loading, exportFile } from 'quasar'

Notify.setDefaults({
  position: 'bottom-left',
  timeout: 5000,
  textColor: 'white',
  actions: [{ icon: 'las la-times', color: 'white' }]
})

Loading.setDefaults({
  spinnerColor: 'primary',
  spinnerSize: 140,
  messageColor: 'white',
  customClass: 'full-width'
})

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

export function getAppLocale () {
  const localeConfig = config.locale || {}
  const localeBrowser = getLocale()
  return localeConfig.default || localeBrowser
}

export function getInitials (name) {
  const initials = name.toUpperCase().match(/\b\w/g) || []
  return initials.join('')
}

export function isEmailValid (email) {
  return emailValidator.validate(email)
}

export function createThumbnail (imageDataUri, width, height, quality, callback) {
  const image = document.createElement('img')
  image.onload = function () {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    // set its dimension to target size
    canvas.width = width
    canvas.height = height
    ctx.drawImage(this, 0, 0, width, height)
    callback(canvas.toDataURL('image/jpeg', quality))
  }
  image.src = imageDataUri
}

export function downloadAsBlob (data, filename, mimeType) {
  const blob = new Blob([data], { type: mimeType })
  if (Platform.is.cordova) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
      fs.root.getFile(filename, { create: true, exclusive: false }, (fileEntry) => {
        fileEntry.createWriter((fileWriter) => {
          fileWriter.write(blob)
          cordova.plugins.fileOpener2.open(fileEntry.nativeURL, mimeType)
        })
      })
    })
  } else {
    exportFile(filename, blob)
  }
}

export function toast (options) {
  // We deduce the color from the type as it was not initially supported by Quasar.
  // The built-in type property appeared with Quasar 1.9 so that we should not need this function anymore.
  // However, we have prefered to keep this function for backward compatibility.
  const type = options.type || 'negative'
  // Notify.create returns a function that, when invoked, hides the notification
  return Notify.create(Object.assign({
    color: (type === 'negative' ? 'red' : (type === 'warning' ? 'orange' : 'green'))
  }, _.omit(options, ['type'])))
}

// Simplify Quasar dialog plugin usage with async/await
export async function dialog (options) {
  return new Promise((resolve, reject) => {
    Dialog.create(options)
      .onOk((data) => resolve({ ok: true, data }))
      .onCancel(() => resolve({ cancel: true }))
      .onDismiss(() => resolve({ dismiss: true }))
  })
}

// Extract icon name from a given icon property on a given target object
export function getIconName (object, path = 'icon.name') {
  // Make function work in a generic way, sometimes the provided input is directly the icon name
  const icon = (typeof object === 'object' ? _.get(object, path, '') : object)
  // Check whether the returned icon is an object (can be true in some cases)
  if (typeof icon === 'object') return ''
  // Name icons to ensure backward compatibility with font awesome 4
  return (icon.startsWith('fa-') ? `fas ${icon}` : icon)
}

export function processIcon (object, path = 'icon.name') {
  // Process icons for backward compatibility with font awesome 4
  _.set(object, path, getIconName(object, path))
}

// Transform nested object to dot notation
export function dotify (object) {
  const dotifiedObject = {}
  function recurse (object, current) {
    _.forOwn(object, (value, key) => {
      const newKey = (current ? current + '.' + key : key) // joined key with dot
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

// Regular expression that checks for hex value
const checkForHexRegExp = /^[0-9a-fA-F]{24}$/

// Check if a string is a valid MongoDB Object ID
export function isObjectID (id) {
  return (id.length === 24 && checkForHexRegExp.test(id))
}

// Add UTC offset to timezone name
export function getTimezoneLabel (timezone) {
  const offset = moment().tz(timezone).format('Z')
  return `${timezone} (${offset})`
}
