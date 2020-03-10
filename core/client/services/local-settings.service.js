import _ from 'lodash'
import config from 'config'
import { Store } from '../store'

export default function (name, api, options) {
  const mapping = options.propertyMapping
  const settingsKey = config.appName.toLowerCase() + '-' + (options.settingsKey || 'settings')
  return {

    async get (id) {
      const data = {}
      _.forOwn(mapping, (value, key) => {
        _.set(data, key, Store.get(value))
      })
      return data
    },

    async patch (id, data) {
      _.forOwn(data, (value, key) => {
        if (_.has(mapping, key)) {
          Store.set(mapping[key], value)
        }
      })
      this.saveSettings()
    },

    saveSettings () {
      const data = {}
      _.forOwn(mapping, (value, key) => {
        if (Store.has(value)) {
          _.set(data, key, Store.get(value))
        }
      })
      window.localStorage.setItem(settingsKey, JSON.stringify(data))
    },

    restoreSettings () {
      let settings = window.localStorage.getItem(settingsKey)
      if (!settings) return
      settings = JSON.parse(settings)
      _.forOwn(mapping, (value, key) => {
        if (_.has(settings, key)) {
          Store.set(value, _.get(settings, key))
        }
      })
    }
  }
}
