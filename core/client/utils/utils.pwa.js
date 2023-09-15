import { useQuasar } from 'quasar'
import { i18n } from '../i18n.js'

export let InstallPwaPrompt = null

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  // Stash the event so it can be triggered later
  InstallPwaPrompt = e 
})

export function installDefaultPrompt () {
  useQuasar().dialog({
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

export function installSafariPrompt () {
  useQuasar().dialog({
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

export function installFFDesktopPrompt () {
  useQuasar().dialog({
    title: i18n.t('composables.pwa.INSTALL_TITLE'),
    message: i18n.t('composables.pwa.FIREFOX_DESKTOP_INSTALL_MESSAGE'),
    ok: {
      color: 'primary'
    },
    persistent: true,
    position: 'bottom',
    html: true
  })
}