import _ from 'lodash'
import { Events } from './events.js'
import { reactive } from 'vue'

// Export singleton
export const Store = reactive({
  set (path, value) {
    const previousValue = this.get(path)
    _.set(this, path, value)
    const eventName = _.kebabCase(`${path}-changed`)
    Events.emit(eventName, value, previousValue)
  },
  get (path, defaultValue) {
    return _.get(this, path, defaultValue)
  },
  patch (path, value) {
    // Patching should not change the object reference to maintain reactivity
    const previousValue = this.get(path)
    if (previousValue) {
      Object.assign(previousValue, value)
      this.set(path, previousValue)
    }
  },
  unset (path) {
    _.unset(this, path)
    const eventName = _.kebabCase(`${path}-changed`)
    Events.emit(eventName, undefined)
  },
  has (path) {
    return _.has(this, path)
  }
})
