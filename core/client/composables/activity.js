import _ from 'lodash'
import config from 'config'
import { ref, shallowRef, readonly, onBeforeUnmount } from 'vue'
import { useStore } from './store.js'
import { useSelection } from './selection.js'

const CurrentActivity = shallowRef(null)
const CurrentActivityName = ref(null)

export function useActivity (name, options = {}) {
  _.defaults(options, { selection: true })

  // data
  // state store
  const activityState = useStore(`store.${name}.state`, options.state)
  // options store
  const activityOptions = useStore(`store.${name}.options`, config[name])

  // functions
  function setCurrentActivity (activity) {
    if (CurrentActivity.value === activity) return
    CurrentActivity.value = activity ? name : null
    CurrentActivity.value = activity
  }

  // expose
  const expose = {
    state: activityState.store,
    options: activityOptions.store,
    setCurrentActivity
  }
  if (options.selection) {
    Object.assign(expose, {
      ...useSelection(CurrentActivityName.value)
    })
  }

  // Cleanup on destroy
  onBeforeUnmount(() => setCurrentActivity(null))

  return expose
}

export function useCurrentActivity (options = {}) {
  _.defaults(options, { selection: true })

  // expose
  const expose = {
    CurrentActivity: readonly(CurrentActivity),
    kActivity: readonly(CurrentActivity),
    CurrentActivityName: readonly(CurrentActivityName),
    kActivityName: readonly(CurrentActivityName)
  }
  if (CurrentActivityName.value) {
    const activityState = useStore(`store.${CurrentActivity.value}.state`)
    const activityOptions = useStore(`store.${CurrentActivity.value}.options`)

    Object.assign(expose, {
      state: activityState.store,
      options: readonly(activityOptions.store)
    })
    if (options.selection) {
      Object.assign(expose, {
        ...useSelection(CurrentActivity.value)
      })
    }
  }
  return expose
}
