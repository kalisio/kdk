import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'

export const LocalStorage = {
  initialize () {
    this.prefix = _.kebabCase(_.get(config, 'appName', 'kdk'))
    logger.debug(`[KDK] Configuring local storage with prefix: '${this.prefix}'`)
  },
  localKey (key) {
    const keyPrefix = `${this.prefix}-`
    if (_.startsWith(keyPrefix)) return key
    return `${keyPrefix}${key}`
  },
  set (key, value) {
    const jsonValue = JSON.stringify(value)
    window.localStorage.setItem(this.localKey(key), jsonValue)
  },
  get (key, defaultValue) {
    const value = window.localStorage.getItem(this.localKey(key))
    if (_.isNil(value)) {
      logger.debug(`[KDK] Cannot find local storage value with key '${key}'. Returning default value '${defaultValue}'`)
      return defaultValue
    }
    return JSON.parse(value)
  },
  clear (key) {
    window.localStorage.removeItem(this.localKey(key))
  }
}
