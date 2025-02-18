import { Platform } from '../platform.js'

export const vHover = {

  mounted (el, binding) {
    if (Platform.touch) return
    el.__vHoverEnter__ = binding.value.enter || (() => {})
    el.__vHoverOver__ = binding.value.over || (() => {})
    el.__vHoverLeave__ = binding.value.leave || (() => {})

    // Add Event Listeners
    el.addEventListener('mouseenter', el.__vHoverEnter__)
    el.addEventListener('mouseover', el.__vHoverOver__)
    el.addEventListener('mouseleave', el.__vHoverLeave__)
  },

  beforeUnmount (el, binding) {
    // Remove Event Listeners
    el.removeEventListener('mouseenter', el.__vHoverEnter__)
    el.removeEventListener('mouseover', el.__vHoverOver__)
    el.removeEventListener('mouseleave', el.__vHoverLeave__)
    delete el.__vHoverEnter__
    delete el.__vHoverOver__
    delete el.__vHoverLeave__
  }
}