import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { api } from './api.js'
import { Store } from './store.js'

// Export singleton
export const Capabilities = {
  async initialize () {
    const capabilities = await window.fetch(api.getConfig('domain') + _.get(config, 'apiPath') + '/capabilities')
    const content = await capabilities.json()
    logger.debug('[KDK] Fetched capabilities:', JSON.stringify(content, null, 4))
    this.content = content
    // Backend might override some defaults in client config
    _.forOwn(_.pick(content, ['gateway']), (value, key) => {
      api.setConfig(key, value)
    })
    // Used to ensure backward compatibility
    Store.set('capabilities.api', content)
    Store.set('capabilities.client', _.pick(config, ['version', 'buildNumber']))
  },
  get (key, defaultValue) {
    if (!this.content) logger.error(new Error('Capabilities must be initialized first'))
    else return _.get(this.content, key, defaultValue)
  }
}
