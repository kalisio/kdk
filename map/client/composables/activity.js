import _ from 'lodash'
import { unref, shallowRef } from 'vue'
import * as composables from '../../../core/client/composables/index.js'
import { useSelection } from './selection.js'
import { useProbe } from './probe.js'
import { useHighlight } from './highlight.js'

const ActivityComposables = {}

// When creating an activity we are interested by all aspects
export function useActivity (name, options = {}) {
  _.defaults(options, { selection: true, probe: true, highlight: true })

  // data
  const coreActivity = composables.useActivity(name, options)
  const { CurrentActivityContext } = coreActivity
  let selection, probe, highlight

  // functions
  function setCurrentActivity (activity) {
    coreActivity.setCurrentActivity(activity)
    if (selection) selection.setCurrentActivity(activity)
    if (probe) probe.setCurrentActivity(activity)
    if (highlight) highlight.setCurrentActivity(activity)
  }

  // expose
  const expose = {
    ...coreActivity
  }
  if (options.selection) {
    selection = useSelection(name, _.get(CurrentActivityContext, 'config.selection'))
    Object.assign(expose, {
      ...selection
    })
  }
  if (options.probe) {
    probe = useProbe(name, _.get(CurrentActivityContext, 'config.probe'))
    Object.assign(expose, {
      ...probe
    })
  }
  if (options.highlight) {
    highlight = useHighlight(name, _.get(CurrentActivityContext, 'config.highlight'))
    Object.assign(expose, {
      ...highlight
    })
  }
  Object.assign(expose, {
    setCurrentActivity
  })
  // Store exposed data and functions so that useCurrentActivity() will return the same context
  _.set(ActivityComposables, name, expose)
  return expose
}

const activityProject = shallowRef(null)

// When using current activity we are mainly interested by selection/probe
export function useCurrentActivity (options = {}) {
  _.defaults(options, { selection: true, probe: true })

  // data
  const coreActivity = composables.useCurrentActivity()
  const { CurrentActivityContext } = coreActivity

  // functions
  function setActivityProject (project) {
    activityProject.value = unref(project)
  }
  function getActivityProject() {
    return activityProject.value
  }

  // expose
  const expose = {
    ...coreActivity,
    setActivityProject,
    getActivityProject
  }
  if (CurrentActivityContext.name) {
    // Retrieved the same exposed data and function from useActivity()
    Object.assign(expose, _.get(ActivityComposables, CurrentActivityContext.name))
  }
  
  return expose
}
