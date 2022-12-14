import * as composables from '../../../core/client/composables/index.js'
import { useSelection } from './selection.js'
import { useProbe } from './probe.js'
import { useHighlight } from './highlight.js'

export function useActivity (name, options = {}) {
  const activity = composables.useActivity(name)
  const selection = useSelection(name, options.selection)
  const probe = useProbe(name, options.probe)
  const highlight = useHighlight(name, options.highlight)

  // Override default fucntion to watch activity changes
  function setCurrentActivity (newActivity) {
    selection.setCurrentActivity(newActivity)
    probe.setCurrentActivity(newActivity)
    highlight.setCurrentActivity(newActivity)
    activity.setCurrentActivity(newActivity)
  }
  // expose
  return {
    ...activity,
    ...selection,
    ...probe,
    ...highlight,
    setCurrentActivity
  }
}

export function useCurrentActivity () {
  const { kActivity, kActivityName, state } = composables.useCurrentActivity()
  // expose
  const expose = {
    kActivity,
    kActivityName
  }
  if (kActivityName.value) {
    Object.assign(expose, {
      state,
      ...useSelection(kActivityName.value),
      ...useProbe(kActivityName.value),
      ...useHighlight(kActivityName.value)
    })
  }
  return expose
}
