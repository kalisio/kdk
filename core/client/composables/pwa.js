import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { Events } from '../events.js'
import { i18n } from '../i18n.js'
import { LocalStorage } from '../local-storage.js'
import { InstallPwaPrompt } from '../utils/utils.pwa.js'

export function usePwa () {
  // Data
  const $q = useQuasar()
  const installKey = 'install'
  const changelogKey = 'appChangelog'

  // Functions
  function install () {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    // Install prompt can be avoided, eg in tests
    if (!LocalStorage.get(installKey, true)) return
    // Take care of install prompt
    if (InstallPwaPrompt) {
      $q.dialog({
        title: i18n.t('composables.pwa.INSTALL_TITLE'),
        message: i18n.t('composables.pwa.INSTALL_MESSAGE'),
        cancel: {
          id: 'ignore-button',
          label: i18n.t('composables.pwa.IGNORE'),
          color: 'primary',
          outline: true
        },
        ok: {
          id: 'install-button',
          label: i18n.t('composables.pwa.INSTALL'),
          color: 'primary'
        },
        persistent: true,
        position: 'bottom',
        html: true
      }).onOk(async () => {
        InstallPwaPrompt.prompt()
        // Wait for the user to respond to the prompt
        const { outcome } = await InstallPwaPrompt.userChoice
        // Refresh page
        if (outcome === 'accepted') location.reload()
      })
    }
    // Take cae of iOS
    if ($q.platform.is.ios) {
      $q.dialog({
        title: i18n.t('composables.pwa.INSTALL_TITLE'),
        message: i18n.t('composables.pwa.IOS_INSTALL_MESSAGE'),
        ok: {
          color: 'primary'
        },
        persistent: true,
        position: 'bottom',
        html: true
      })
    }
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
