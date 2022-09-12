import _ from 'lodash'
import { ref, readonly, reactive } from 'vue'
import { Store } from '../store.js'

const toggleStates = reactive({})

export function useAction (props) {
  // data
  const isToggled = ref(null)
  // functions
  function toggle () {
    isToggled.value = !isToggled.value
    // cache the value
    if (props.toggle && props.toggle.store) {
      Store.patch(props.toggle.store.path, { [props.toggle.store.property]: isToggled.value })
    } else {
      toggleStates[props.id] = isToggled.value
    }
  }
  // immmediate
  if (_.has(props, 'toggled')) isToggled.value = props.toggled
  else {
    // try to retrieve a cached value
    if (props.toggle && props.toggle.store) {
      isToggled.value = Store.get(`${props.toggle.store.path}.${props.toggle.store.property}`, false)
    } else {
      isToggled.value = _.get(toggleStates, props.id, false)
    }
  } 
  // exposed
  return { 
    isToggled: readonly(isToggled),
    toggle
  }
}