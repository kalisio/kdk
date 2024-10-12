import _ from 'lodash'
import config from 'config'
import { onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { Events } from '../events.js'
import { i18n } from '../i18n.js'
import { LocalStorage } from '../local-storage.js'
import { InstallPwaPrompt, installFFDesktopPrompt, installSafariPrompt, installDefaultPrompt } from '../utils/utils.pwa.js'

export function usePwa () {
  // Data
  const $q = useQuasar()
  const installKey = 'install'
  const changelogKey = 'appChangelog'

  // Functions
  function install () {
    if (config.buildMode !== 'pwa' || window.matchMedia('(display-mode: standalone)').matches) return
    // Install prompt can be avoided, eg in tests
    if (!LocalStorage.get(installKey, true)) return
    // Take care of install prompt
    if (InstallPwaPrompt) installDefaultPrompt()
    // Take care of iOS
    if ($q.platform.is.ios) installSafariPrompt()
    // Take care of Firefox desktop
    if ($q.platform.is.firefox && $q.platform.is.desktop) installFFDesktopPrompt()
  }
  function update (registration) {
    // Refresh the page once the update has been applied
    registration.waiting.addEventListener('statechange', (event) => {
      if (event.target.state === 'activated') {
        window.location.reload()
      }
    })
    const changelog = _.get(config, changelogKey)
    $q.dialog({
      title: i18n.t('composables.pwa.UPDATE_TITLE'),
      message: changelog ? i18n.t('composables.pwa.UPDATE_MESSAGE', { changelog }) : undefined,
      html: true,
      cancel: {
        id: 'ignore-button',
        label: i18n.t('composables.pwa.IGNORE'),
        color: 'primary',
        outline: true
      },
      ok: {
        id: 'update-button',
        label: i18n.t('composables.pwa.UPDATE'),
        color: 'primary'
      },
      persistent: true,
      position: 'bottom'
    }).onOk(() => {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    })
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
