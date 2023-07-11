import { Platform, Notify } from 'quasar'
import { i18n } from '../i18n.js'

export function getPlatform () {
  return Object.assign(Platform.is, {
    touch: Platform.has.touch,
    storage: Platform.has.webStorage,
    iframe: Platform.within.frame,
    agent: Platform.userAgent
  })
}

export function updatePwa (registration) {
  // Refresh the page once the update has been applied
  registration.waiting.addEventListener('statechange', (event) => {
    if (event.target.state === 'activated') {
      window.location.reload()
    }
  })
  // Notify when a new version is available
  Notify.create({
    type: 'warning',
    timeout: 0,
    message: i18n.t('pwa.VERSION_MISMATCH'),
    actions: [
      { label: i18n.t('pwa.BUTTON_REFRESH'), color: 'white', handler: () => registration.waiting.postMessage({ type: 'SKIP_WAITING' }) },
      { label: i18n.t('CLOSE'), color: 'white' }
    ]
  })
}
