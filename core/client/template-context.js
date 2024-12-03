import { useStore } from './composables/store.js'
import { Events } from './events.js'

const { store, set, get, unset, has } = useStore('template-context')

// This is a singleton used to inject data in string template evaluation contexts (lodash)
export const TemplateContext = Object.assign(store, {
  get,
  has,
  unset,
  // Override write methods to send events
  set (path, value) {
    const previousValue = get(path)
    set(path, value)
    Events.emit('template-context-changed', path, value, previousValue)
  }
})
