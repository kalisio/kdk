import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'

const createStorage = (storage) => ({
  initialize () {
    this.prefix = _.get(config, 'appSlug', _.kebabCase(_.get(config, 'appName', 'kdk')))
    logger.debug(`[KDK] ${storage === window.localStorage ? 'LocalStorage' : 'SessionStorage'} initialized with prefix: '${this.prefix}'`)
  },
  localKey (key) {
    const keyPrefix = `${this.prefix}-`
    if (_.startsWith(key, keyPrefix)) return key
    return `${keyPrefix}${key}`
  },
  set (key, value) {
    storage.setItem(this.localKey(key), JSON.stringify(value))
  },
  has (key) {
    return !_.isNil(storage.getItem(this.localKey(key)))
  },
  get (key, defaultValue) {
    const value = storage.getItem(this.localKey(key))
    if (_.isNil(value)) {
      logger.debug(`[KDK] Cannot find storage value with key '${key}'. Returning default value '${defaultValue}'`)
      return defaultValue
    }
    return JSON.parse(value)
  },
  clear (key) {
    storage.removeItem(this.localKey(key))
  }
})

export const LocalStorage = createStorage(window.localStorage)
export const SessionStorage = createStorage(window.sessionStorage)
