import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { LocalCache } from './local-cache.js'
import { api } from './api.js'
import { Store } from './store.js'

// Export singleton
export const Capabilities = {
  async initialize () {
    // Try to fetch cached data if any
    const content = await LocalCache.getItem('capabilities')
    // If browser has detected an offline state then go for cached data
    if (api.isDisconnected || (api.useLocalFirst && content)) {
      this.content = content
    } else {
      // Otherwise try to fetch capabilities from server, no response will assume an offline state as well
      try {
        const capabilities = await window.fetch(api.getConfig('domain') + _.get(config, 'apiPath') + '/capabilities')
        this.content = await capabilities.json()
        // Store latest capabilities data for offline mode
        await LocalCache.setItem('capabilities', this.content)
      } catch (error) {
        this.content = content
      }
    }
    logger.debug('[KDK] Capabilities initialized with content:', this.content)
    if (!this.content) return
    // Backend might override some defaults in client config
    _.forOwn(_.pick(this.content, ['gateway']), (value, key) => {
      api.setConfig(key, value)
    })
    // Used to ensure backward compatibility
    Store.set('capabilities.api', this.content)
    Store.set('capabilities.client', _.pick(config, ['version', 'buildNumber']))
  },
  get (key, defaultValue) {
    if (!this.content) logger.error(new Error('[KDK] Capabilities must be initialized first'))
    else return _.get(this.content, key, defaultValue)
  }
}
