import _ from 'lodash'
import config from 'config'
import { ref, shallowRef, readonly, onUnmounted } from 'vue'
import { useStore } from './store.js'
import { useSelection } from './selection.js'

const kActivity = shallowRef(null)
const kActivityName = ref(null)

export function useActivity (name, options = {}) {
  _.defaults(options, { selection: true })

  // data
  // state store
  const activityState = useStore(`store.${name}.state`, options.state)
  // options store
  const activityOptions = useStore(`store.${name}.options`, config[name])

  // functions
  function setCurrentActivity (activity) {
    if (kActivity.value === activity) return
    kActivityName.value = activity ? name : null
    kActivity.value = activity
  }

  // expose
  const expose = {
    state: activityState.store,
    options: activityOptions.store,
    setCurrentActivity
  }
  if (options.selection) {
    Object.assign(expose, {
      ...useSelection(kActivityName.value)
    })
  }

  // Cleanup on destroy
  onUnmounted(() => setCurrentActivity(null))

  return expose
}

export function useCurrentActivity (options = {}) {
  _.defaults(options, { selection: true })
  
  // expose
  const expose = {
    kActivity: readonly(kActivity),
    kActivityName: readonly(kActivityName)
  }
  if (kActivityName.value) {
    const activityState = useStore(`store.${kActivityName.value}.state`)
    const activityOptions = useStore(`store.${kActivityName.value}.options`)

    Object.assign(expose, {
      state: activityState.store,
      options: readonly(activityOptions.store)
    })
    if (options.selection) {
      Object.assign(expose, {
        ...useSelection(kActivityName.value)
      })
    }
  }
  return expose
}
