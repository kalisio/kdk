import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
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
}
