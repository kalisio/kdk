import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { api } from './api.js'
import { Store } from './store.js'

// Export singleton
export const Context = {
  serviceName: null,
  service: null,
  initialize () {
    this.serviceName = _.get(config, 'context.service')
    if (!_.isEmpty(this.serviceName)) {
      // initialize the store
      Store.set('context', null)
      logger.debug(`[KDK] Context configured with service '${this.serviceName}'`)
    }
  },
  get () {
    return Store.get('context')
  },
  getId () {
    return _.get(this.get(), '_id')
  },
  getRef () {
    return Store.getRef('context')
  },
  getService () {
    if (_.isEmpty(this.serviceName)) throw new Error('[KDK] Context service undefined !')
    if (this.service) return this.service
    this.service = api.getService(this.serviceName)
    if (_.isNil(this.service)) throw new Error('[KDK] Context service not found !')
    return this.service
  },
  set (context) {
    Store.set('context', context)
  }
}
