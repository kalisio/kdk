import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { ref, computed, readonly } from 'vue'
import { Capabilities, Store, i18n } from '../index.js'
import { Notify } from 'quasar'
import { getPlatform } from '../utils/utils.platform.js'

const Version = ref({
  client: {
    number: _.get(config, 'version'),
    buildNumber: _.get(config, 'buildNumber')
  },
  api: {
    number: undefined,
    buildNumber: undefined
  },
  flavor: _.get(config, 'flavor')
})
let isInitialized = false
const Platform = getPlatform()

export function useVersion () {
  // Computed
  const clientVersionName = computed(() => {
    const clientVersion = Version.value.client
    let version = clientVersion.number
    if (clientVersion.buildNumber) version += ` (${clientVersion.buildNumber})`
    return version
  })
  const apiVersionName = computed(() => {
    const apiVersion = Version.value.api
    let version = apiVersion.number
    if (apiVersion.buildNumber) version += ` (${apiVersion.buildNumber})`
    return version
  })

  // Immediate
  if (!isInitialized) {
    isInitialized = true
    logger.debug('Setting API version from capabilities')
    Version.value.api.number = Capabilities.get('version')
    Version.value.api.buildNumber = Capabilities.get('buildNumber')
    console.log(Platform.pwa)
    if (Platform.cordova || Platform.pwa) checkVersion()
  }

  // Expose
  return {
    Version: readonly(Version),
    clientVersionName,
    apiVersionName
  }
}

export async function checkVersion () {
  const api = Store.capabilities.api
  // FIXME: we should elaborate a more complex check between compatible versions
  if (api.version === config.version) {
    if (config.flavor === 'prod') return
    // Local dev has not the concept of build number
    else if (!api.buildNumber) return
    // On staging check it because we do not increase version number on each change
    // and would like to know if the mobile client is up-to-date
    else if (api.buildNumber === config.buildNumber) return
  }
  // Update the service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js', { scope: './' })
      .then((registration) => {
        // Registration worked
        logger.debug(`Registration succeeded.`)
        registration.update()
        Notify.create({ 
          type: 'warning',
          timeout: 0,
          message: i18n.t('pwa.VERSION_MISMATCH'),
          actions: [
            { label: i18n.t('pwa.BUTTON_REFRESH'), color: 'white', handler: () => location.reload(true) },
            { label: i18n.t('pwa.BUTTON_DISMISS'), color: 'white', handler: () => Notify.setDefaults() }
          ]
        })
      })
      .catch((error) => {
        // Registration failed
        logger.debug(`Registration failed with ${error}`)
      })
  } else {
    Notify.create({ 
      type: 'warning',
      timeout: 0,
      message: i18n.t('pwa.VERSION_MISMATCH'),
      actions: [
        { label: i18n.t('pwa.BUTTON_REFRESH'), color: 'white', handler: () => location.reload(true) },
        { label: i18n.t('pwa.BUTTON_DISMISS'), color: 'white', handler: () => Notify.setDefaults() }
      ]
    })
  }
}
