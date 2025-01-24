import { ref, computed, readonly } from 'vue'
import { useQuasar } from 'quasar'
import { Fullscreen, toggleFullscreen, lockOrientation } from '../utils/utils.screen.js'

const Orientation = ref(null)

export function useScreen () {
  // Data
  const $q = useQuasar()

  // Computed
  const dense = computed(() => {
    return $q.screen.xs
  })
  const wide = computed(() => {
    return $q.screen.gt.sm
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