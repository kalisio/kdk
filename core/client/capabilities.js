import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { LocalForage } from '@kalisio/feathers-localforage'
import { api } from './api.js'
import { Store } from './store.js'

// Export singleton
export const Capabilities = {
  async initialize () {
    if (api.isDisconnected || api.useLocalFirst) {
      this.content = await LocalForage.getItem('capabilities')
    }
    if (!this.content) {
      const capabilities = await window.fetch(api.getConfig('domain') + _.get(config, 'apiPath') + '/capabilities')
      const content = await capabilities.json()
      logger.debug('[KDK] Fetched capabilities:', content)
      this.content = content
      // Store latest capabilities data for offline mode
      await LocalForage.setItem('capabilities', content)
    }
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
    if (!this.content) logger.error(new Error('Capabilities must be initialized first'))
    else return _.get(this.content, key, defaultValue)
  }
}
