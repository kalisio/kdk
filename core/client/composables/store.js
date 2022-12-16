import _ from 'lodash'
import { reactive } from 'vue'

// states store
const Store = {}

export function useStore (name, initialStore) {
  // data
  if (!_.has(Store, name)) { // Initialize on first call
    _.set(Store, name, reactive(initialStore || {}))
  }
  const store = _.get(Store, name)

  // functions
  function clear () {
    _.forOwn(store, function (value, key) {
      _.unset(store, key)
    })
  }
  function set (path, value) {
    _.set(store, path, value)
  }
  function get (path, defaultValue) {
    return _.get(store, path, defaultValue)
  }
  function unset (path) {
    _.unset(store, path)
  }
  function has (path) {
    return _.has(store, path)
  }

  // expose
  return {
    Store,
    store,
    clear,
    set,
    get,
    unset,
    has
  }
}
