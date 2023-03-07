import config from 'config'
import { ref, shallowRef, readonly, onUnmounted } from 'vue'
import { useStore } from './store.js'
import { useSelection } from './selection.js'

const kActivity = shallowRef(null)
const kActivityName = ref(null)

export function useActivity (name, exposed = { selection: true }) {
  // data
  // state store
  const state = useStore(`store.${name}.state`)
  // options store
  const options = useStore(`store.${name}.options`, config[name])

  // functions
  function setCurrentActivity (activity) {
    if (kActivity.value === activity) return
    kActivityName.value = activity ? name : null
    kActivity.value = activity
  }

  // expose
  const expose = {
    state: state.store,
    options: options.store,
    setCurrentActivity
  }
  if (exposed.selection) {
    Object.assign(expose, {
      ...useSelection(kActivityName.value)
    })
  }

  // Cleanup on destroy
  onUnmounted(() => setCurrentActivity(null))

  return expose
}

export function useCurrentActivity (exposed = { selection: true }) {
  // expose
  const expose = {
    kActivity: readonly(kActivity),
    kActivityName: readonly(kActivityName)
  }
  if (kActivityName.value) {
    const state = useStore(`store.${kActivityName.value}.state`)
    const options = useStore(`store.${kActivityName.value}.options`)

    Object.assign(expose, {
      state: state.store,
      options: readonly(options.store)
    })
    if (exposed.selection) {
      Object.assign(expose, {
        ...useSelection(kActivityName.value)
      })
    }
  }
  return expose
}
