import { getPlatform } from '../utils/utils.platform.js'
const Platform = getPlatform()

export const vHover = {

  mounted (el, binding) {
    if (Platform.touch) return
    el.__vHoverEnter__ = binding.value.enter || (() => {})
    el.__vHoverLeave__ = binding.value.leave || (() => {})

    // Add Event Listeners
    el.addEventListener('mouseover', el.__vHoverEnter__)
    el.addEventListener('mouseleave', el.__vHoverLeave__)
  },

  beforeUnmount (el, binding) {
    // Remove Event Listeners
    el.removeEventListener('mouseover', el.__vHoverEnter__)
    el.removeEventListener('mouseleave', el.__vHoverLeave__)
    delete el.__vHoverEnter__
    delete el.__vHoverLeave__
  }
}