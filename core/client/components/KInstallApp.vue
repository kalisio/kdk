<template>
  <q-dialog id="install-app" v-model="showInstallApp.show" persistent position="bottom">
    <q-card class="bg-info q-pa-sm" style="width: 350px; color: white">
      <q-card-section class="row justify-between">
        <q-icon name="info" size="sm"/>
        <span class="text-body1 text-center" text-color="white">
          {{ $t('pwa.MESSAGE_INSTALL') }}
        </span>
      </q-card-section>
      <q-card-section v-if="showInstallApp.isIos" class="text-body1 text-center">
        {{ $t('pwa.MESSAGE_INSTALL_IOS_SHARE_ICON') }}
        <q-icon name="ios_share" size="18px"/>
        {{ $t('pwa.MESSAGE_INSTALL_IOS_HOME_SCREEN') }}
      </q-card-section>
      <q-card-actions align="center">
        <KAction
          id="close-btn"
          renderer="form-button"
          :outline="showInstallApp.isIos ? false : true"
          size="sm"
          label="pwa.SKIP_BUTTON"
          :handler="closeDialog"
        />
        <KAction
          v-if="!showInstallApp.isIos"
          id="install-btn"
          renderer="form-button"
          size="sm"
          label="pwa.INSTALL_BUTTON"
          :handler="installApp"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import logger from 'loglevel'
import { Platform } from 'quasar'

// Data
const showInstallApp = ref({
  isIos: false,
  show: false
})
let deferredPrompt = null

// Functions
function closeDialog () {
  showInstallApp.value.show = false
}
async function installApp () {
  showInstallApp.value.show = false
  // Show the install prompt
  deferredPrompt.prompt()
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice
  logger.debug(`User response to the install prompt: ${outcome}`)
  // Refresh page
  if (outcome === 'accepted') location.reload()
}
async function installAppAvailable () {
  const appIsInstalled = window.matchMedia('(display-mode: standalone)').matches
  if (appIsInstalled) return
  if (Platform.is.ios) showInstallApp.value = { isIos: true, show: true }
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    // Stash the event so it can be triggered later
    deferredPrompt = e
    // Show the button install app
    showInstallApp.value.show = true
  })
}

// Immediate
installAppAvailable()
</script>
