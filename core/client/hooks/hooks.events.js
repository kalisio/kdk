import { Events } from '../events'

export function emit (hook) {
  Events.$emit(hook.type + '-hook', hook)
}
