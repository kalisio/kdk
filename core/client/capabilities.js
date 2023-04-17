import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { api } from './api.js'
import { Store } from './store.js'

// Export singleton
export const Capabilities = {
  initialize () {
    window.fetch(api.getBaseUrl() + _.get(config, 'apiPath') + '/capabilities')
      .then(capabilities => {
        capabilities.json()
          .then(content => {
            logger.debug('[KDK] fetched capabilities:', JSON.stringify(content, null, 4))
            this.content = content
            // TODO: ensure backward compatibility
            Store.set('capabilities.api', content)
            Store.set('capabilities.client', content)
          })
      })
  },
  get (key) {
    if (!this.content) logger.error(new Error('Capabilities must be initialized first'))
    else return _.get(this.content, key)
  }
}
