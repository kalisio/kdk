import { ref, readonly } from 'vue'
import { useQuasar } from 'quasar'

const Platform = ref(null)

export function usePlatform () {
  // data
  const $q = useQuasar()

  // immediate
  if (!Platform.value) {
    Platform.value = Object.assign($q.platform.is, {
      touch: $q.platform.has.touch,
      storage: $q.platform.has.webStorage,
      iframe: $q.platform.within.frame,
      agent: $q.platform.userAgent
    })
  }

  // expose
  return {
    Platform: readonly(Platform)
  }
}
