import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { Store } from './store.js'
import { Theme } from './theme.js'
import { Capabilities } from './capabilities.js'
import { LocalStorage } from './local-storage.js'
import { LocalCache } from './local-cache.js'
import { Storage } from './storage.js'
import { TemplateContext } from './template-context.js'
import { Time } from './time.js'
import { Units } from './units.js'
import { Layout } from './layout.js'
import { Filter } from './filter.js'
import { Sorter } from './sorter.js'
import { Document } from './document.js'
import { Exporter } from './exporter.js'
import { Reader } from './reader.js'
import services from './services/index.js'
import * as utils from './utils/index.js'
import * as composables from './composables/index.js'
import * as mixins from './mixins/index.js'
import * as hooks from './hooks/index.js'
import * as readers from './readers/index.js'
import { Schema } from '../common/index.js'

// FIXME: we don't build vue component anymore, they are processed by webpack in the application
// export * from './components'
export { Store }
export { Theme }
export { Capabilities }
export { LocalStorage }
export { LocalCache }
export { Storage }
export { TemplateContext }
export { Time }
export { Units }
export { Layout }
export { Filter }
export { Sorter }
export { Exporter }
export { Reader }
export { services }
export { utils }
export { composables }
export { mixins }
export { hooks }
export * from './api.js'
export * from './events.js'
export * from './i18n.js'
export * from './search.js'
export * from './guards.js'
export * from '../common/index.js'

export default async function initialize () {
  const api = this

  logger.debug('[KDK] initializing core module')

  // Declare the module intiaization states
  Store.set('kdk', { core: { initialized: false }, map: { initialized: false } })

  // Initialize singletons that might be used globally first
  Theme.initialize()
  Time.initialize()
  Units.initialize()
  await Capabilities.initialize()
  // Then services
  api.configure(services)
  // Last, create the models listened by the main layout/pages components
  // You must use the patch method on the store to update those models
  // It is generally done by activity based componentq or through a local settings service
  LocalStorage.initialize()
  LocalCache.initialize()
  Storage.initialize()
  Layout.initialize()
  Filter.initialize()
  Sorter.initialize()
  Document.initialize()
  Exporter.initialize(_.get(config, 'exporter'))
  Schema.initialize(_.get(config, 'schema'))

  // Listen to the 'patched' event on the users
  utils.subscribeToUserChanges()

  // Register the readers
  _.forEach(_.get(config, 'readers.core', []), entry => {
    logger.debug(`[KDK] Registering reader ${entry.reader} for [${entry.mimeTypes}] mime types`)
    Reader.register(entry.mimeTypes, readers[entry.reader])
  })

  // Store the intiaization state
  Store.set('kdk.core.initialized', true)
}
