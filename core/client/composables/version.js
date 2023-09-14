import _ from 'lodash'
import config from 'config'
import { ref, computed, readonly } from 'vue'
import { Capabilities } from '../index.js'

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
    Version.value.api.number = Capabilities.get('version')
    Version.value.api.buildNumber = Capabilities.get('buildNumber')
  }

  // Expose
  return {
    Version: readonly(Version),
    clientVersionName,
    apiVersionName
  }
}
