import _ from 'lodash'
import * as composables from '../../../core/client/composables/index.js'
import { useSelection } from './selection.js'
import { useProbe } from './probe.js'
import { useHighlight } from './highlight.js'

// When creating an activity we are interested by all aspects
export function useActivity (name, exposed = { selection: true, probe: true, highlight: true }) {
  const activity = composables.useActivity(name, exposed)
  // expose
  const expose = {
    ...activity
  }
  if (exposed.selection) {
    Object.assign(expose, {
      ...useSelection(name, _.get(activity, 'options.selection'))
    })
  }
  if (exposed.probe) {
    Object.assign(expose, {
      ...useProbe(name, _.get(activity, 'options.probe'))
    })
  }
  if (exposed.highlight) {
    Object.assign(expose, {
      ...useHighlight(name, _.get(activity, 'options.highlight'))
    })
  }
  return expose
}

// When using current activity we are mainly interested by selection/probe
export function useCurrentActivity (exposed = { selection: true, probe: true }) {
  const { kActivity, kActivityName, state, options } = composables.useCurrentActivity()
  // expose
  const expose = {
    kActivity,
    kActivityName
  }
  if (kActivityName.value) {
    Object.assign(expose, {
      state,
      options
    })
    if (exposed.selection) {
      Object.assign(expose, {
        ...useSelection(kActivityName.value, _.get(options, 'selection'))
      })
    }
    if (exposed.probe) {
      Object.assign(expose, {
        ...useProbe(kActivityName.value, _.get(options, 'probe'))
      })
    }
    if (exposed.highlight) {
      Object.assign(expose, {
        ...useHighlight(kActivityName.value, _.get(options, 'highlight'))
      })
    }
  }
  return expose
}
