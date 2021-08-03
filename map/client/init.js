import _ from 'lodash'
import logger from 'loglevel'
import memory from 'feathers-memory'
import { Platform } from 'quasar'
import { Store, utils as kCoreUtils } from '../../core/client'
import { Geolocation } from './geolocation'

function siftMatcher (originalQuery) {
  // Filter out specific operators others than the reserved ones (starting by $),
  // which are already filtered by core matcher
  const keysToOmit = ['geoJson']
  return _.omit(originalQuery, ...keysToOmit)
}

export default function init () {
  const api = this

  logger.debug('Initializing map')

  // Declare the built-in services, others are optional
  api.declareService('geocoder')
  // Declare our matcher
  api.registerMatcher(siftMatcher)
  // Service to support in memory features edition
  // mixin.edit-layers use it when edited layer is not stored
  api.createService('features-edition', {
    service: memory({
      id: '_id',
      paginate: { default: 10 },
      matcher: api.matcher
    })
  })

  // Create the models listened by the different components
  // You must use the patch method on the store to update those models
  // It is generally done by activity based componentq or through a local settings service
  Geolocation.initialize()
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
    step: 60 // 1H
  })
  // Default timeseries parameters
  Store.set('timeseries', {
    span: 1440 // 24H
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
