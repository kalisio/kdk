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
        logger.debug('Fetching api capabilities')
        capabilities.json()
          .then(content => {
            this.content = content
            // TODO: ensure backward compatibility
            Store.set('capabilities.api', content)
            Store.set('capabilities.client', content)
          })
      })
  },
  get (key) {
    if (this.content) return _.get(this.content, key)
    logger.debug('Capabilities not initialized')
  }
}
