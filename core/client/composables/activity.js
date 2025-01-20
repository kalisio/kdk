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

  // functions
  function setCurrentActivity (activity) {
    logger.debug('[KDK] Setting current activity to', activity)
    if (CurrentActivityContext.activity === activity) return
    CurrentActivityContext.activity = activity ? activity : null
    CurrentActivityContext.name = activity ? name : null
    CurrentActivityContext.state = activity ? useStore(`store.${name}.state`, options.state).store : null
    CurrentActivityContext.config = activity ? useStore(`store.${name}.options`, config[name]).store : null
    CurrentActivity.value = activity ? activity : null
    if (activity) logger.debug('[KDK] Current activity set to', name)
    else logger.debug('[KDK] Current activity cleared')
  }

  // hooks
  onBeforeUnmount(() => setCurrentActivity(null))

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
