import _ from 'lodash'
import config from 'config'
import { Store } from '../store.js'
import { Events } from '../events.js'

export default function (name, api, options) {
  const mapping = options.propertyMapping
  // We will emit also an event for all top level properties in case of nested ones
  // This simplifies event management for some listeners instead of listening to all nested properties
  const rootPaths = _.uniq(_.values(mapping).map(path => path.split('.')[0]))
  const settingsKey = config.appName.toLowerCase() + '-' + (options.settingsKey || 'settings')
  return {

    async get (id) {
      const data = {}
      _.forOwn(mapping, (value, key) => {
        if (value) {
          _.set(data, key, Store.get(value))
        }
      })
      return data
    },

    async patch (id, data) {
      const previousRootValues = rootPaths.map(rootPath => Store.get(rootPath))
      _.forOwn(data, (value, key) => {
        if (_.get(mapping, key)) {
          Store.set(mapping[key], value)
        }
      })
      rootPaths.forEach((rootPath, index) => {
        const eventName = _.kebabCase(`${rootPath}-changed`)
        Events.emit(eventName, Store.get(rootPath), previousRootValues[index])
      })
      this.saveSettings()
    },

    saveSettings () {
      const data = {}
      _.forOwn(mapping, (value, key) => {
        if (value && Store.has(value)) {
          _.set(data, key, Store.get(value))
        }
      })
      window.localStorage.setItem(settingsKey, JSON.stringify(data))
    },

    restoreSettings () {
      let settings = window.localStorage.getItem(settingsKey)
      if (!settings) return
      settings = JSON.parse(settings)
      // Backward compatibility when changed utc mode to timezone setting
      if (_.get(settings, 'utc') && _.has(mapping, 'timezone') && !_.get(settings, 'timezone')) {
        _.set(settings, 'timezone', 'UTC')
      }
      _.forOwn(mapping, (value, key) => {
        if (value && _.has(settings, key)) {
          Store.set(value, _.get(settings, key))
        }
      })
    },

    getSettingsMapping () {
      return mapping
    }
  }
}
