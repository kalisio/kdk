import _ from 'lodash'
import { Events } from '../events.js'

export function emit (hook) {
  if (_.get(hook, `params.skip-${hook.type}-event`)) return
  Events.emit(hook.type + '-hook', hook)
}
