import _ from 'lodash'
import { onUnmounted } from 'vue'
import * as composables from '../../../core/client/composables/index.js'
import { useSelection } from './selection.js'
import { useProbe } from './probe.js'
import { useHighlight } from './highlight.js'

// When creating an activity we are interested by all aspects
export function useActivity (name, options = {}) {
  _.defaults(options, { selection: true, probe: true, highlight: true })
  
  const coreActivity = composables.useActivity(name, options)
  let selection, probe, highlight

  // expose
  const expose = {
    ...coreActivity
  }
  if (options.selection) {
    selection = useSelection(name, _.get(coreActivity, 'options.selection'))
    Object.assign(expose, {
      ...selection
    })
  }
  if (options.probe) {
    probe = useProbe(name, _.get(coreActivity, 'options.probe'))
    Object.assign(expose, {
      ...probe
    })
  }
  if (options.highlight) {
    highlight = useHighlight(name, _.get(coreActivity, 'options.highlight'))
    Object.assign(expose, {
      ...highlight
    })
  }

  // functions
  function setCurrentActivity (activity) {
    coreActivity.setCurrentActivity(activity)
    if (selection) selection.setCurrentActivity(activity)
    if (probe) probe.setCurrentActivity(activity)
    if (highlight) highlight.setCurrentActivity(activity)
  }

  // Cleanup on destroy
  onUnmounted(() => setCurrentActivity(null))

  return Object.assign(expose, {
    setCurrentActivity
  })
}

// When using current activity we are mainly interested by selection/probe
export function useCurrentActivity (options = {}) {
  _.defaults(options, { selection: true, probe: true })

  const { kActivity, kActivityName, state: activityState, options: activityOptions } = composables.useCurrentActivity()
  // expose
  const expose = {
    kActivity,
    CurrentActivity: kActivity,
    kActivityName,
    CurrentActivityName: kActivityName
  }
  if (kActivityName.value) {
    Object.assign(expose, {
      state: activityState,
      options: activityOptions
    })
    if (options.selection) {
      Object.assign(expose, {
        ...useSelection(kActivityName.value, _.get(options, 'selection'))
      })
    }
    if (options.probe) {
      Object.assign(expose, {
        ...useProbe(kActivityName.value, _.get(options, 'probe'))
      })
    }
    if (options.highlight) {
      Object.assign(expose, {
        ...useHighlight(kActivityName.value, _.get(options, 'highlight'))
      })
    }
  }
  return expose
}
