import _ from 'lodash'
import { ref, readonly, reactive } from 'vue'
import { Store } from '../store.js'

// states store
const toggleStates = reactive({})

export function useAction (props) {
  // data
  const isToggled = ref(null)

  // functions
  function toggle () {
    isToggled.value = !isToggled.value
    // cache the value if required
    const cache = _.get(props, 'toggle.cache')
    if (cache) {
      if (typeof cache === 'string') {
        // use global store
        const tokens = cache.split('.')
        const property = _.last(tokens)
        const path = _.dropRight(tokens).join('.')
        Store.patch(path, { [property]: isToggled.value })
      } else if (typeof cache === 'boolean') {
        // use local store
        toggleStates[props.id] = isToggled.value
      }
    }
  }

  // immmediate
  const cache = _.get(props, 'toggle.cache')
  if (cache) {
    if (typeof cache === 'string') {
      // use global store
      isToggled.value = Store.get(cache, false)
    } else if (typeof cache === 'boolean') {
      // use local store
      if (cache) isToggled.value = _.get(toggleStates, props.id, false)
    }
  } else {
    isToggled.value = props.toggled
  }

  // exposed
  return {
    isToggled: readonly(isToggled),
    toggle
  }
}
