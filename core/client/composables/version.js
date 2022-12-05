import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { ref, computed, readonly, watch } from 'vue'
import { useQuasar } from 'quasar'
import { i18n } from '../i18n.js'
import { useCapabilities } from './capabilities.js'

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
  const { Capabilities } = useCapabilities()

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

  // Function
  function setApiVersion () {
    logger.debug('Setting API version from capabilities')
    Version.value.api.number = Capabilities.value.version
    Version.value.api.buildNumber = Capabilities.value.buildNumber
    // check for mismatch
    if (!_.isEqual(Version.value.client, Version.value.api)) {
      $q.notify({ type: 'negative', message: i18n.t('composables.VERSION_MISMATCH') })
    }
  }

  // Watch
  watch(Capabilities, () => { setApiVersion() })

  // Immediate
  if (Capabilities.value) {
    setApiVersion()
  }

  // Expose
  return {
    Version: readonly(Version),
    clientVersionName,
    apiVersionName
  }
}
