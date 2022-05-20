import logger from 'loglevel'
import { Platform } from 'quasar'
import { Store } from './store.js'
import { Layout } from './layout.js'
import { Time } from './time.js'
import { Units } from './units.js'
import { Reader } from './reader.js'
import { Filter } from './filter.js'
import { Sorter } from './sorter.js'
import { Search } from './search.js'
import services from './services/index.js'
import * as utils from './utils.js'
import * as mixins from './mixins/index.js'
import * as hooks from './hooks/index.js'
import { CSVReader, JSONReader } from './readers/index.js'

// We faced a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
// We tested the workaround given here https://github.com/babel/babel/issues/2877#issuecomment-270700000 with success so far

// FIXME: we don't build vue component anymore, they are processed by webpack in the application template
// export * from './components'

export * from './events.js'
export * from './api.js'
export * from './services/index.js'
export * from './store.js'
export * from './layout.js'
export * from './theme.js'
export * from './time.js'
export * from './units.js'
export * from './filter.js'
export * from './reader.js'
export * from './sorter.js'
export * from './search.js'
export * from './guards.js'
export * from '../common/index.js'
export { utils }
export { mixins }
export { hooks }

export default function init () {
  const api = this

  logger.debug('Initializing core')
  // Initialize singletons that might be used globally first
  Time.initialize()
  Units.initialize()
  // Then services
  api.configure(services)
  // Last, create the models listened by the main layout/pages components
  // You must use the patch method on the store to update those models
  // It is generally done by activity based componentq or through a local settings service
  Layout.initialize()
  Filter.initialize(api)
  Sorter.initialize()
  Search.initialize(api)
  Store.set('topPane', { content: null, mode: undefined, filter: {}, visible: false })
  Store.set('leftPane', { content: null, mode: undefined, filter: {}, visible: false })
  Store.set('rightPane', { content: null, mode: undefined, filter: {}, visible: false })
  Store.set('bottomPane', { content: null, mode: undefined, filter: {}, visible: false })
  Store.set('page', { content: null, mode: undefined, filter: {}, sticky: undefined })
  Store.set('window', { widgets: [], filter: {}, position: [0, 0], size: [0, 0], current: '', widgetActions: [] })
  Store.set('fab', { actions: [], filter: {} })

  // Listen to the 'patched' event on the users
  const users = api.getService('users')
  users.on('patched', user => {
    // Check whether we need to update the current user
    if (user._id === Store.get('user._id')) {
      Store.patch('user', user)
    }
  })

  // Register default readers
  Reader.register('.json', JSONReader)
  Reader.register('.csv', CSVReader)

  // -----------------------------------------------------------------------
  // | After this we should only have specific cordova initialisation code |
  // -----------------------------------------------------------------------
  if (!Platform.is.cordova) return

  /* NOT SURE IF THIS IS REQUIRED
  let permissionsPlugin = cordova.plugins.permissions
  const notificationPermissions = [
    permissionsPlugin.INTERNET,
    permissionsPlugin.ACCESS_NETWORK_STATE,
    permissionsPlugin.WAKE_LOCK,
    permissionsPlugin.VIBRATE
  ]

  function permissionsError() {
    const message = 'Required permissions for push notifications are missing or have been rejected, the application will not work as expected'
    logger.error(message)
    utils.toast({
      message,
      timeout: 10000
    })
  }
  function permissionsCheckSuccess(status) {
    // Request again if not given
    if (!status.hasPermission) {
      permissionsPlugin.requestPermissions(notificationPermissions, status => { if (!status.hasPermission) permissionsError() }, permissionsError)
    }
  }
  */

  document.addEventListener('deviceready', _ => {
    // Check for permissions, will launch permission request on failure
    // NOT SURE IF THIS IS REQUIRED
    // permissionsPlugin.hasPermission(notificationPermissions, permissionsCheckSuccess, null)
    if (!window.device) {
      logger.error('Unable to reach device information')
      return
    }

    const notifier = window.PushNotification.init({
      android: { vibrate: true, sound: true, forceShow: true },
      ios: { alert: true, badge: true, sound: true },
      windows: { }
    })
    notifier.on('registration', async (data) => {
      logger.debug('Push registrationID changed: ' + data.registrationId)
      // Store the registrationId
      window.device.registrationId = data.registrationId
      // update the user device
      const user = Store.get('user')
      if (user && window.device && window.device.registrationId) {
        const devicesService = api.getService('devices')
        const device = await devicesService.update(window.device.registrationId, window.device)
        logger.debug(`device ${device.uuid} updated with the id ${device.registrationId}`)
      }
    })
    notifier.on('notification', (data) => {
      // data.message,
      // data.title,
      // data.count,
      // data.sound,
      // data.image,
      // data.additionalData
    })
    notifier.on('error', (error) => {
      logger.error(error)
      utils.toast({
        message: error.message,
        timeout: 10000
      })
    })
    api.on('authenticated', async response => {
      const devicesService = api.getService('devices')
      // Only possible if registration ID already retrieved
      if (window.device && window.device.registrationId) {
        const device = await devicesService.update(window.device.registrationId, window.device)
        logger.debug(`device ${device.uuid} registered with the id ${device.registrationId}`)
      }
    })
  }, false)
}
