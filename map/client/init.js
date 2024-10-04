import _ from 'lodash'
import { LocalForage } from '@kalisio/feathers-localforage'
import config from 'config'
import { reactive } from 'vue'
import logger from 'loglevel'
import { memory } from '@feathersjs/memory'
import { Store, Reader, utils as kCoreUtils } from '../../core/client/index.js'
import { Geolocation } from './geolocation.js'
import { Planets } from './planets.js'
import * as readers from './readers/index.js'

function siftMatcher (originalQuery) {
  // Filter out specific operators others than the reserved ones (starting by $),
  // which are already filtered by core matcher
  const keysToOmit = ['geoJson']
  return _.omit(originalQuery, ...keysToOmit)
}

// Decorate core API with some of the required features for map
export function setupApi (configuration) {
  const api = this
  // We need to implement time management as our api is sometimes used
  // by layers expecting a Weacast interface
  api.setForecastTime = (time) => {
    api.forecastTime = time
    api.emit('forecast-time-changed', time)
  }
  api.getForecastTime = () => {
    return api.forecastTime
  }
  // We also add some features related to offline mode
  api.createOfflineServiceForView = async function (serviceName, view, options = {}) {
    const services = await LocalForage.getItem('services') || {}

    const service = services[serviceName] || {}
    let views = _.get(service, 'views', [])
    views.push(view)
    _.set(service, 'views', views)
    _.set(service, 'layerService', _.get(options, 'layerService', false))
    _.set(service, 'tiledService', _.get(options, 'tiledService', false))
    _.set(services, serviceName, service)
    await LocalForage.setItem('services', services)
    
    const offlineService = await api.createOfflineService(serviceName, options)
    return offlineService
  }
  return api
}

export default async function init () {
  const api = this

  logger.debug('[KDK] initializing map module')

  // Declare the built-in services, others are optional
  api.declareService('catalog')
  api.declareService('projects')
  api.declareService('features')
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

  // Initialize singletons that might be used globally first
  Geolocation.initialize()
  Planets.initialize()

  // Then, create the models listened by the different components
  // You must use the patch method on the store to update those models
  // It is generally done by activity based componentq or through a local settings service

  // Default time formatting settings
  Store.set('timeFormat', reactive({
    time: reactive({
      short: 'H[h]',
      long: 'HH:mm'
    }),
    date: reactive({
      short: 'DD/MM',
      long: 'dddd D'
    }),
    year: reactive({
      short: 'YY',
      long: 'YYYY'
    }),
    utc: false,
    locale: kCoreUtils.getLocale()
  }))
  // Default location formatting settings
  Store.set('locationFormat', 'f')
  // Default view settings
  Store.set('restore', reactive({
    view: true,
    layers: false
  }))
  // Default timeseries parameters
  Store.set('timeseries', reactive({
    span: 1440, // 24H
    groupBy: 'feature'
  }))

  // Register the readers
  _.forEach(_.get(config, 'readers.map', []), entry => {
    logger.debug(`[KDK] registering mime types [${entry.mimeTypes}] to reader ${entry.reader}`)
    Reader.register(entry.mimeTypes, readers[entry.reader])
  })

  // Store the intiaization state
  Store.set('kdk.map.initialized', true)
}
