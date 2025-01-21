import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { shallowRef, toRef, shallowReactive, readonly, onBeforeUnmount } from 'vue'
import { useStore } from './store.js'
import { useSelection } from './selection.js'

const CurrentActivityContext = shallowReactive({
  activity: null,
  name: null,
  state: null,
  config: null
})
const CurrentActivity = shallowRef(null)

export function useActivity (name, options = {}) {
  _.defaults(options, { selection: true })

  // configure the context
  CurrentActivityContext.name = name
  CurrentActivityContext.state = useStore(`store.${name}.state`, options.state).store
  CurrentActivityContext.config = useStore(`store.${name}.options`, config[name]).store

  // functions
  function setCurrentActivity (activity) {
    if (CurrentActivityContext.activity === activity) return
    if (activity) {
      CurrentActivityContext.activity = activity
      CurrentActivity.value = activity
      logger.debug('[KDK] Current activity set to', activity)  
    } else {
      CurrentActivityContext.activity = null
      CurrentActivity.value = null
      logger.debug('[KDK] Current activity cleared')
    }
  }

  // hooks
  onBeforeUnmount(() => {
    CurrentActivityContext.name = null
    CurrentActivityContext.state = null
    CurrentActivityContext.config = null
    setCurrentActivity(null)
  })

  // expose
  const expose = {
    CurrentActivityContext,
    setCurrentActivity
  }
  if (options.selection) {
    Object.assign(expose, {
      ...useSelection(name)
    })
  }
  return expose
}

export function useCurrentActivity (options = {}) {
  _.defaults(options, { selection: true })

  // expose
  const expose = {
    CurrentActivityContext,
    CurrentActivity,
    kActivity: readonly(CurrentActivity),
    kActivityName: readonly(toRef(CurrentActivityContext, 'name'))
  }
  if (CurrentActivityContext.name) {
    if (options.selection) {
      Object.assign(expose, {
        ...useSelection(CurrentActivityContext.name)
      })
    }
  }
  return expose
}
