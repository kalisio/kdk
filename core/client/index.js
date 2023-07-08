import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { Platform, Notify } from 'quasar'
import { Store } from './store.js'
import { LocalStorage } from './local-storage.js'
import { Layout } from './layout.js'
import { Time } from './time.js'
import { Units } from './units.js'
import { Capabilities } from './capabilities.js'
import { Reader } from './reader.js'
import { Storage } from './storage.js'
import { Filter } from './filter.js'
import { Sorter } from './sorter.js'
import services from './services/index.js'
import * as utils from './utils/index.js'
import * as composables from './composables/index.js'
import * as mixins from './mixins/index.js'
import * as hooks from './hooks/index.js'
import * as readers from './readers/index.js'
import { Schema } from '../common/index.js'

// FIXME: we don't build vue component anymore, they are processed by webpack in the application
// export * from './components'

export * from './api.js'
export * from './capabilities.js'
export * from './events.js'
export * from './services/index.js'
export * from './store.js'
export * from './storage.js'
export * from './layout.js'
export * from './theme.js'
export * from './time.js'
export * from './units.js'
export * from './filter.js'
export * from './reader.js'
export * from './sorter.js'
export * from './search.js'
export * from './i18n.js'
export * from './local-storage.js'
export * from './guards.js'
export * from '../common/index.js'
export { utils }
export { composables }
export { mixins }
export { hooks }
export { readers }

export default function init () {
  const api = this

  logger.debug('[KDK] initializing core module')
  // Initialize singletons that might be used globally first
  Time.initialize()
  Units.initialize()
  Capabilities.initialize()
  // Then services
  api.configure(services)
  // Last, create the models listened by the main layout/pages components
  // You must use the patch method on the store to update those models
  // It is generally done by activity based componentq or through a local settings service
  LocalStorage.initialize()
  Storage.initialize()
  Layout.initialize()
  Filter.initialize()
  Sorter.initialize()
  Schema.initialize(_.get(config, 'schema'))
  // Listen to the 'patched' event on the users
  utils.subscribeToUserChanges()

  // Register default readers
  Reader.register('.json', readers.JSONReader)
  Reader.register('.csv', readers.CSVReader)

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
      logger.error('[KDK] unable to reach device information')
      return
    }

    if (window.PushNotification && (typeof window.PushNotification.init === 'function')) {
      const notifier = window.PushNotification.init({
        android: { vibrate: true, sound: true, forceShow: true },
        ios: { alert: true, badge: true, sound: true },
        windows: { }
      })
      notifier.on('registration', async (data) => {
        logger.debug('[KDK] push registrationID changed: ' + data.registrationId)
        // Store the registrationId
        window.device.registrationId = data.registrationId
        // update the user device
        const user = Store.get('user')
        if (user && window.device && window.device.registrationId) {
          const devicesService = api.getService('devices')
          const device = await devicesService.update(window.device.registrationId, window.device)
          logger.debug(`[KDK] device ${device.uuid} updated with the id ${device.registrationId}`)
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
        Notify.create({ 
          type: 'negative',
          message: error.message, 
          timeout: 10000 
        })
      })
    } else {
      logger.debug('[KDK] unable to initialize push plugin')
    }
    api.on('authenticated', async response => {
      const devicesService = api.getService('devices')
      // Only possible if registration ID already retrieved
      if (window.device && window.device.registrationId) {
        const device = await devicesService.update(window.device.registrationId, window.device)
        logger.debug(`[KDK] device ${device.uuid} registered with the id ${device.registrationId}`)
      }
    })
  }, false)
}
