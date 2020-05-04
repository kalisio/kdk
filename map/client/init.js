import logger from 'loglevel'
import { Platform } from 'quasar'
import { Store, utils as kCoreUtils } from '../../core/client'
import moment from 'moment'

export default function init () {
  const api = this

  logger.debug('Initializing map')

  // Declare the services
  api.declareService('geocoder')

  // Create the models listened by the different components
  // You must use the patch method on the store to update those models
  // It is generally done by activity based componentq or through a local settings service
  // Initialize the nabigation bar
  Store.set('navigationBar', {
    positionIndicator: false,
    locationInput: false,
    actions: {
      before: [],
      after: []
    }
  })
  // Initialize the selection
  Store.set('selection', {
    location: null,
    feature: null,
    layer: null
  })
  // Default time formatting settings
  Store.set('timeFormat', {
    time: {
      short: 'H[h]',
      long: 'HH:mm'
    },
    date: {
      short: 'DD/MM',
      long: 'dddd D'
    },
    year: {
      short: 'YY',
      long: 'YYYY'
    },
    utc: false,
    locale: kCoreUtils.getLocale()
  })
  // Default location formatting settings
  Store.set('locationFormat', 'f')
  // Default view settings
  Store.set('restore', {
    view: true,
    layers: false
  })
  // Default timeline parameters
  Store.set('timeline', {
    step: 60
  })
  // Default timeseries parameters
  Store.set('timeseries', {
    span: 1 // days
  })

  if (!Platform.is.cordova) return
  window.navigationApps = []

  document.addEventListener('deviceready', _ => {
    // Declare the navigation apps
    window.launchnavigator.availableApps((result) => {
      const apps = Object.entries(result)
      apps.forEach((app) => {
        if (app[1]) window.navigationApps.push(app[0])
      })
    }, (error) => logger.warn('Cannot retrieve installed navigation apps: ' + error))
  })
}
