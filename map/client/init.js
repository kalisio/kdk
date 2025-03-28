import _ from 'lodash'
import config from 'config'
import { reactive } from 'vue'
import logger from 'loglevel'
import { memory } from '@feathersjs/memory'
import { Store, Reader, utils as kdkCoreUtils, hooks as kdkCoreHooks } from '../../core/client/index.js'
import * as kMapHooks from './hooks/index.js'
import { Geolocation } from './geolocation.js'
import { Planets } from './planets.js'
import { Geocoder } from './geocoder.js'
import { Navigator } from './navigator.js'
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
  api.createOfflineFeaturesService = async function (serviceName, options = {}) {
    options = Object.assign(_.omit(options, ['hooks', 'dataPath']), {
      // Set required default hooks and data path for snapshot as the service responds in GeoJson format
      hooks: _.defaultsDeep(_.get(options, 'hooks'), {
        before: {
          all: [kdkCoreHooks.ensureSerializable, kdkCoreHooks.removeServerSideParameters, kMapHooks.removeServerSideParameters],
          create: [kdkCoreHooks.generateId, kMapHooks.referenceCountCreateHook],
          remove: kMapHooks.referenceCountRemoveHook
        },
        after: {
          find: [kMapHooks.geoJsonPaginationHook, kMapHooks.intersectBBoxHook]
        }
      }),
      dataPath: 'features',
      // Here are service options used to manage offline features services
      features: true
    })

    const offlineService = await api.createOfflineService(serviceName, options)
    return offlineService
  }
  return api
}

export default async function init () {
  const api = this
  logger.debug('[KDK] Initializing Map module...')

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
  Geocoder.initialize()
  Navigator.initialize()

  // Then, create the models listened by the different components
  // You must use the patch method on the store to update those models
  // It is generally done by activity based component or through a local settings service

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
    locale: kdkCoreUtils.getLocale()
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
    logger.debug(`[KDK] Registering mime types [${entry.mimeTypes}] to reader ${entry.reader}`)
    Reader.register(entry.mimeTypes, readers[entry.reader])
  })

  // Register additional shapes
  kdkCoreUtils.Shapes.polyline = {
    viewBox: [0, 0, 50, 50],
    content: '<path d="M1 44L17 6L33 44L49 6" />',
    clipPath: false
  }
  kdkCoreUtils.Shapes.polygon = {
    viewBox: [0, 0, 50, 50],
    content: '<path d="M10 40L1 24L5 10L20 1L40 10L49 24L40 40L32 49Z" />'
  }

  // Store the initialization state
  Store.set('kdk.map.initialized', true)
  logger.debug('[KDK] Map module initialized')
}
