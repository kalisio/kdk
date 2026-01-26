import _ from 'lodash'
import logger from 'loglevel'
import emailValidator from 'email-validator'
import { Notify, Dialog, Loading, exportFile } from 'quasar'
import { defineAsyncComponent, markRaw } from 'vue'

export * from './utils.account.js'
export * from './utils.actions.js'
export * from './utils.collection.js'
export * from './utils.colors.js'
export * from './utils.content.js'
export * from './utils.files.js'
export * from './utils.items.js'
export * from './utils.locale.js'
export * from './utils.math.js'
export * from './utils.offline.js'
export * from './utils.push.js'
export * from './utils.screen.js'
export * from './utils.services.js'
export * from './utils.shapes.js'
export * from './utils.session.js'
export * from './utils.tags.js'
export * from './utils.time.js'
export * from './utils.tours.js'

Notify.setDefaults({
  position: 'bottom-left',
  timeout: 5000,
  textColor: 'white'
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

export function dataUriToBlob (dataUri) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataUri.split(',')[1])
  // separate out the mime component
  const mimeType = dataUri.split(',')[0].split(':')[1].split(';')[0]
  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)
  // create a view into the buffer
  const ia = new Uint8Array(ab)
  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  // write the ArrayBuffer to a blob, and you're done
  return new Blob([ab], { type: mimeType })
}

// Taken from https://github.com/juanelas/base64
export const base64Encode = function (bytes) {
  bytes = new Uint8Array(bytes)
  const CHUNK_SIZE = 0x8000
  const array = []
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    array.push(String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK_SIZE)))
  }
  return btoa(array.join(''))
}

export function downloadAsBlob (data, filename, mimeType) {
  const blob = new Blob([data], { type: mimeType })
  exportFile(filename, blob)
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

// Function to map kdk icons with QIcon from Quasar
// https://quasar.dev/vue-components/icon#custom-mapping
export function mapIconFunction (iconName) {
  if (iconName.startsWith('kdk:') === true) {
    // we strip the "kdk:" part
    const name = iconName.substring(4)
    // Return the inlined icon
    return { icon: 'img:kdk/' + name }
  }
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
// We don't use ObjectID.isValid as it returns true for any string that contains 12 characters: https://jira.mongodb.org/browse/NODE-4912.
export function isObjectID (id) {
  return (id.length === 24 && checkForHexRegExp.test(id))
}

// Helper function to load a schema
// @schema alias should be added in the quasar.config build section
export async function loadSchema (schemaName) {
  try {
    const schemaModule = await import(`@schemas/${schemaName}.json`)
    return schemaModule.default
  } catch (error) {
    logger.error(error)
  }
}

// Helper function to load a component
// https://vuejs.org/guide/components/async.html
// @components alias should be added in the quasar.config build section
export function loadComponent (componentName) {
  try {
    return markRaw(defineAsyncComponent(() => import(`@components/${componentName}.vue`)))
  } catch (error) {
    logger.error(error)
  }
}
