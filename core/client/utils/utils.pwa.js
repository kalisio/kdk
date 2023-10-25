import { Dialog } from 'quasar'
import { i18n } from '../i18n.js'

export let InstallPwaPrompt = null

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  // Stash the event so it can be triggered later
  InstallPwaPrompt = e 
})

export function installDefaultPrompt () {
  Dialog.create({
    title: i18n.t('utils.pwa.INSTALL_TITLE'),
    message: i18n.t('utils.pwa.INSTALL_MESSAGE'),
    cancel: {
      id: 'ignore-button',
      label: i18n.t('utils.pwa.IGNORE'),
      color: 'primary',
      outline: true
    },
    ok: {
      id: 'install-button',
      label: i18n.t('utils.pwa.INSTALL'),
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
  Dialog.create({
    title: i18n.t('utils.pwa.INSTALL_TITLE'),
    message: i18n.t('utils.pwa.IOS_INSTALL_MESSAGE'),
    ok: {
      color: 'primary'
    },
    persistent: true,
    position: 'bottom',
    html: true
  })
}

export function installFFDesktopPrompt () {
  Dialog.create({
    title: i18n.t('utils.pwa.INSTALL_TITLE'),
    message: i18n.t('utils.pwa.FIREFOX_DESKTOP_INSTALL_MESSAGE'),
    ok: {
      color: 'primary'
    },
    persistent: true,
    position: 'bottom',
    html: true
  })
}