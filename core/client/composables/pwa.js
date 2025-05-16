import _ from 'lodash'
import config from 'config'
import { onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { Events } from '../events.js'
import { i18n } from '../i18n.js'
import { LocalStorage } from '../local-storage.js'
import { Platform } from '../platform.js'
import { InstallPwaPrompt, installFFDesktopPrompt, installSafariPrompt, installDefaultPrompt } from '../utils/utils.pwa.js'

export function usePwa (options = { updateTimeout: 5000 }) {
  // Data
  const $q = useQuasar()
  const installKey = 'install'

  // Functions
  function install () {
    // check for basic conditions before prompting
    const isNotPWA = config.buildMode !== 'pwa'
    const isPWAInstalled = window.matchMedia('(display-mode: standalone)').matches
    const withinIframe = _.get(Platform, 'within.iframe', false)
    if (isNotPWA || isPWAInstalled || withinIframe) return
    // install prompt can be avoided, eg in tests
    if (!LocalStorage.get(installKey, true)) return
    // take care of install prompt
    if (InstallPwaPrompt) installDefaultPrompt()
    // take care of iOS
    if ($q.platform.is.ios) installSafariPrompt()
    // take care of Firefox desktop
    if ($q.platform.is.firefox && $q.platform.is.desktop) installFFDesktopPrompt()
  }
  function update (registration) {
    // refresh the page once the update has been applied
    registration.waiting.addEventListener('statechange', (event) => {
      if (event.target.state === 'activated') {
        window.location.reload()
      }
    })
    $q.notify({
      message: i18n.t('composables.pwa.UPDATE_MESSAGE'),
      type: 'info',
      html: true,
      timeout: options.updateTimeout,
      spinner: true
    })
    setTimeout(() => {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }, options.updateTimeout)
  }

  // Hooks
  onMounted(() => {
    Events.on('pwa-updated', update)
  })
  onBeforeUnmount(() => {
    Events.off('pwa-updated', update)
  })

  // Expose
  return {
    installPwa: install
  }
}
