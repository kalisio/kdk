import config from 'config'
import { ref, shallowRef, readonly } from 'vue'
import { useStore } from './store.js'
import { useSelection } from './selection.js'

const kActivity = shallowRef(null)
const kActivityName = ref(null)

export function useActivity (name) {
  // data
  // state store
  const state = useStore(`activities.${name}.state`)
  // options store
  const options = useStore(`activities.${name}.options`, config[name])

  // functions
  function setCurrentActivity (activity) {
    kActivityName.value = name
    kActivity.value = activity
  }

  // expose
  return {
    state: state.store,
    options: options.store,
    setCurrentActivity,
    ...useSelection(name)
  }
}

export function useCurrentActivity () {
  // expose
  const expose = {
    kActivity: readonly(kActivity),
    kActivityName: readonly(kActivityName)
  }
  if (kActivityName.value) {
    const state = useStore(`activities.${kActivityName.value}.state`)
    const options = useStore(`activities.${kActivityName.value}.options`)

    Object.assign(expose, {
      state: readonly(state.store),
      options: readonly(options.store),
      ...useSelection(kActivityName.value)
    })
  }
  return expose
}
