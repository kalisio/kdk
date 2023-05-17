<template>
  <div v-if="showInstallApp" class="row justify-center">
    <KAction
      id="install-app"
      renderer="form-button"
      color="primary"
      size="sm"
      label="pwa.BUTTON_INSTALL"
      :handler="installApp"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import logger from 'loglevel'

// Data
const showInstallApp = ref(false)
let deferredPrompt = null

// functions
async function installApp () {
  showInstallApp.value = false
  // Show the install prompt
  deferredPrompt.prompt()
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice
  logger.debug(`User response to the install prompt: ${outcome}`)
}
function installAppAvailable () {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    // Stash the event so it can be triggered later
    deferredPrompt = e
    // Show the button install app
    showInstallApp.value = true
  })
}

// immediate
installAppAvailable()
</script>
