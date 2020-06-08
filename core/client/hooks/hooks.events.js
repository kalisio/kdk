import _ from 'lodash'
import { Events } from '../events'

export function emit (hook) {
  if (_.get(hook, `params.skip-${hook.type}-event`)) return
  Events.$emit(hook.type + '-hook', hook)
}
