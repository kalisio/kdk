import logger from 'loglevel'
import { onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { Events } from '../events.js'
import { i18n } from '../i18n.js'

export function usePwa () {
  // Data
  const $q = useQuasar()
  let deferredPrompt = null

  // Functions
  function install () {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt = e
      // Show the button install app
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
      } else {
        $q.dialog({
          title: i18n.t('composables.pwa.INSTALL_TITLE'),
          message: i18n.t('composables.pwa.INSTALL_MESSAGE'),
          cancel: {
            label: i18n.t('composables.pwa.IGNORE'),
            color: 'primary',
            outline: true
          },
          ok: {
            label: i18n.t('composables.pwa.INSTALL'),
            color: 'primary'
          },
          persistent: true,
          position: 'bottom',
          html: true
        })
        .onOk(async () => {
          deferredPrompt.prompt()
          // Wait for the user to respond to the prompt
          const { outcome } = await deferredPrompt.userChoice
          logger.debug(`User response to the install prompt: ${outcome}`)
          // Refresh page
          if (outcome === 'accepted') location.reload()
        })
      }
    })
  }
  function update (registration) {
    // Refresh the page once the update has been applied
    registration.waiting.addEventListener('statechange', (event) => {
      if (event.target.state === 'activated') {
        window.location.reload()
      }
    })
    $q.dialog({
      title: i18n.t('composables.pwa.UPDATE_TITLE'),
      message: i18n.t('composables.pwa.UPDATE_MESSAGE'),
      cancel: {
        label: i18n.t('composables.pwa.IGNORE'),
        color: 'primary',
        outline: true
      },
      ok: {
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
  onMounted (() => {
    Events.on('pwa-updated', update)
  })
  onBeforeUnmount (() => {
    Events.off('pwa-updated', update)
  })

  // Expose
  return {
    installPwa: install
  }
}