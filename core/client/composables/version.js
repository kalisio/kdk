import _ from 'lodash'
import logger from 'loglevel'
import { ref, computed, readonly, onMounted } from 'vue'
import { api } from '../api.js'
import config from 'config'

let initialized = false

const Version = ref({
  client: {
    number: _.get(config, 'version'),
    buildNumber: _.get(config, 'buildNumber')
  },
  api: {
    number: undefined,
    buildNumber: undefined
  },
  flavor: _.get(config, 'flavor'),
})

export function useVersion () {
  // computed
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

  // hooks
  onMounted(async () => {
    if (!initialized) {
      initialized = true
      // fetch the api capabilities to get the version
      logger.debug('Fetching api version')
      const response = await window.fetch(api.getBaseUrl() + _.get(config, 'apiPath') + '/capabilities')
      const apiCapabilities = await response.json()
      Version.value.api.number = apiCapabilities.version
      Version.value.api.buildNumber = apiCapabilities.buildNumber
    }
  })

  // expose
  return {
    Version: readonly(Version),
    clientVersionName,
    apiVersionName
  }
}
