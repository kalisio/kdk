import { ref, shallowRef, readonly } from 'vue'
import { useStore } from './store.js'
import { useSelection } from './selection.js'

const kActivity = shallowRef(null)
const kActivityName = ref(null)

export function useActivity (name) {
  // data
  // state store
  const { store } = useStore(`activities.${name}`)

  // functions
  function setCurrentActivity (activity) {
    kActivityName.value = name
    kActivity.value = activity
  }

  // expose
  return {
    state: store,
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
    const { store } = useStore(`activities.${kActivityName.value}`)

    Object.assign(expose, {
      state: readonly(store),
      ...useSelection(kActivityName.value)
    })
  }
  return expose
}
