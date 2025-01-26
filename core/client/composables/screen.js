import _ from 'lodash'
import { ref, computed, readonly } from 'vue'
import { useQuasar } from 'quasar'
import { Fullscreen, toggleFullscreen, lockOrientation } from '../utils/utils.screen.js'

const Orientation = ref(null)

export function useScreen (options = {}) {
  // Data
  const $q = useQuasar()
  const denseBreakpoint = _.get(options, 'dense', 'sm')
  const wideBreakpoint = _.get(options, 'wide', 'sm')

  // Computed
  const dense = computed(() => {
    return $q.screen.lt[denseBreakpoint]
  })
  const wide = computed(() => {
    return $q.screen.gt[wideBreakpoint]
  })
  const orientation = computed(() => {
    return $q.screen.width >= $q.screen.height ? 'landscape' : 'portrait'
  })

  // Expose
  return {
    Screen: readonly($q.screen),
    dense,
    wide,
    orientation,
    Fullscreen: readonly(Fullscreen),
    toggleFullscreen,
    lockOrientation
  }
}