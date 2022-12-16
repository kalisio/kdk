import _ from 'lodash'
import * as composables from '../../../core/client/composables/index.js'
import { useSelection } from './selection.js'
import { useProbe } from './probe.js'
import { useHighlight } from './highlight.js'

export function useActivity (name) {
  const activity = composables.useActivity(name)
  const selection = useSelection(name, _.get(activity, 'options.selection'))
  const probe = useProbe(name, _.get(activity, 'options.probe'))
  const highlight = useHighlight(name, _.get(activity, 'options.highlight'))

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
  const { kActivity, kActivityName, state, options } = composables.useCurrentActivity()
  // expose
  const expose = {
    kActivity,
    kActivityName
  }
  if (kActivityName.value) {
    Object.assign(expose, {
      state,
      options,
      ...useSelection(kActivityName.value, _.get(options, 'selection')),
      ...useProbe(kActivityName.value, _.get(options, 'probe')),
      ...useHighlight(kActivityName.value, _.get(options, 'highlight'))
    })
  }
  return expose
}
