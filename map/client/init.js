import _ from 'lodash'
import config from 'config'
import { reactive } from 'vue'
import logger from 'loglevel'
import { memory } from '@feathersjs/memory'
import { Store, Reader, utils as kCoreUtils } from '../../core/client/index.js'
import { Geolocation } from './geolocation.js'
import * as readers from './readers/index.js'

function siftMatcher (originalQuery) {
  // Filter out specific operators others than the reserved ones (starting by $),
  // which are already filtered by core matcher
  const keysToOmit = ['geoJson']
  return _.omit(originalQuery, ...keysToOmit)
}

export default async function init () {
  const api = this

  logger.debug('[KDK] initializing map module')

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

  // Initialize singletons that might be used globally first
  Geolocation.initialize()

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
    span: 1440 // 24H
  }))

  // Register the readers
  _.forEach(_.get(config, 'readers.map', []), reader => {
    logger.debug(`[KDK] registering reader ${reader}`)
    Reader.register(`.${reader}`, readers[`${_.upperCase(reader)}Reader`])
  })

  // Store the intiaization state
  Store.set('kdk.map.initialized', true)
}
