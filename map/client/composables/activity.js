import _ from 'lodash'
import { unref, shallowRef } from 'vue'
import * as composables from '../../../core/client/composables/index.js'
import { useSelection } from './selection.js'
import { useProbe } from './probe.js'
import { useHighlight } from './highlight.js'

// When creating an activity we are interested by all aspects
export function useActivity (name, options = {}) {
  _.defaults(options, { selection: true, probe: true, highlight: true })

  // data
  const coreActivity = composables.useActivity(name, options)
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
  return Object.assign(expose, {
    setCurrentActivity
  })
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
    if (options.selection) {
      Object.assign(expose, {
        ...useSelection(CurrentActivityContext.name, _.get(options, 'selection'))
      })
    }
    if (options.probe) {
      Object.assign(expose, {
        ...useProbe(CurrentActivityContext.name, _.get(options, 'probe'))
      })
    }
    if (options.highlight) {
      Object.assign(expose, {
        ...useHighlight(CurrentActivityContext.name, _.get(options, 'highlight'))
      })
    }
  }
  
  return expose
}
