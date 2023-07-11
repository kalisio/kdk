<template>
  <q-dialog id="install-app" v-model="showInstallApp.show" persistent position="bottom">
    <q-card class="bg-info q-pa-sm" style="width: 350px; color: white">
      <q-card-section class="row justify-between">
        <q-icon name="info" size="sm"/>
        <span class="text-body1" text-color="white">
          {{ $t('pwa.MESSAGE_INSTALL') }}
          <div v-if="showInstallApp.isIos">
            {{ $t('pwa.MESSAGE_INSTALL_IOS_SHARE_ICON') }}
            <q-icon name="ios_share" size="18px"/>
            {{ $t('pwa.MESSAGE_INSTALL_IOS_HOME_SCREEN') }}
          </div>
        </span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-if="!showInstallApp.isIos" flat color="white" :label="$t('pwa.BUTTON_INSTALL')" @click="installApp" />
        <q-btn flat color="white" :label="$t('CLOSE')" v-close-popup  />
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
async function installApp () {
  showInstallApp.value = false
  // Show the install prompt
  deferredPrompt.prompt()
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice
  logger.debug(`User response to the install prompt: ${outcome}`)
  // Refresh page
  if (outcome === 'accepted') location.reload()
}
function installAppAvailable () {
  if (Platform.is.ios) {
    showInstallApp.value = {
      isIos: true,
      show: true
    }
  } else {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt = e
      // Show the button install app
      showInstallApp.value.show = true
    })
  }
}

// Immediate
installAppAvailable()
</script>
