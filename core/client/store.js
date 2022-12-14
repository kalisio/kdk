import _ from 'lodash'
import { useStore } from './composables/store.js'
import { Events } from './events.js'

const { store, set, get, unset, has } = useStore('store')

// Export singleton
export const Store = Object.assign(store, {
  get,
  has,
  // Override write methods to send events
  set (path, value) {
    const previousValue = get(path)
    set(path, value)
    const eventName = _.kebabCase(`${path}-changed`)
    Events.emit(eventName, value, previousValue)
  },
  patch (path, value) {
    // Patching should not change the object reference to maintain reactivity
    const previousValue = get(path)
    if (previousValue) {
      Object.assign(previousValue, value)
      this.set(path, previousValue)
    }
  },
  unset (path) {
    unset(path)
    const eventName = _.kebabCase(`${path}-changed`)
    Events.emit(eventName, undefined)
  }
})
