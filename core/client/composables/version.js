import _ from 'lodash'
import logger from 'loglevel'
import { ref, computed, readonly, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '../api.js'
import { i18n } from '../i18n.js'
import config from 'config'

let isInitialized = false

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

export function useVersion () {
  // Data
  const $q = useQuasar()

  // Computed
  const clientVersionName = computed(() => {
    const clientVersion = Version.value.client
    let version = clientVersion.number
    if (clientVersion.buildNumber) version += `(${clientVersion.buildNumber})`
    return version
  })
  const apiVersionName = computed(() => {
    const apiVersion = Version.value.api
    let version = apiVersion.number
    if (apiVersion.buildNumber) version += `(${apiVersion.buildNumber})`
    return version
  })

  // Hooks
  onMounted(async () => {
    if (!isInitialized) {
      isInitialized = true
      // fetch the api capabilities to get the version
      logger.debug('Fetching api version')
      const response = await window.fetch(api.getBaseUrl() + _.get(config, 'apiPath') + '/capabilities')
      const apiCapabilities = await response.json()
      Version.value.api.number = apiCapabilities.version
      Version.value.api.buildNumber = apiCapabilities.buildNumber
      // check for mismatch
      if (!_.isEqual(Version.value.client, Version.value.api)) {
        $q.notify({ type: 'negative', i18n: 'composables.VERSION_MISMATCH'})
      }
    }
  })

  // Expose
  return {
    Version: readonly(Version),
    clientVersionName,
    apiVersionName
  }
}
