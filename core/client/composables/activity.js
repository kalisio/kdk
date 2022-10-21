import _ from 'lodash'
import { reactive } from 'vue'

// states store
const activityStates = {}

export function useActivity (name) {
  // data
  if (!_.has(activityStates, name)) { // Initialize on first call
    _.set(activityStates, name, reactive({}))
  }
  const state = _.get(activityStates, name)

  // exposed
  return {
    state
  }
}
