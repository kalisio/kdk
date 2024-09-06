import { ref, watch, readonly } from 'vue'
import { useQuasar } from 'quasar'
import { Fullscreen, toggleFullscreen } from '../utils/utils.screen.js'

const Orientation = ref(null)

export function useScreen () {
  // Data
  const $q = useQuasar()

  // Watch
  watch(() => [$q.screen.width, $q.screen.height], () => {
    Orientation.value = $q.screen.width >= $q.screen.height ? 'landscape' : 'portrait'
  }, { immediate: true})

  // Expose
  return {
    Screen: readonly($q.screen),
    Orientation: readonly(Orientation),
    Fullscreen: readonly(Fullscreen),
    toggleFullscreen
  }
}