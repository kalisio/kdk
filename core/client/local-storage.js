import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'

export const LocalStorage = {
  initialize () {
    this.prefix = _.toLower(_.get(config, 'appName', 'kdk'))
    logger.debug(`[KDK] initializing local storage with prefix: ${this.prefix}`)
  },
  localKey (key) {
    return `${this.prefix}-${_.kebabCase(key)}`
  },
  set (key, value) {
    const jsonValue = JSON.stringify(value)
    window.localStorage.setItem(this.localKey(key), jsonValue)
  },
  get (key) {
    const value = window.localStorage.getItem(this.localKey(key))
    if (!value) {
      logger.warn(`[KDK] cannot find local storage value with key ${key}`)
    }
    return JSON.parse(value)
  },
  clear (key) {
    window.localStorage.removeItem(this.localKey(key))
  }
}
