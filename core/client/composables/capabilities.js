import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { ref, readonly, onMounted } from 'vue'
import { api } from '../api.js'
import { Store } from '../store.js'

let isInitialized = false

const Capabilities = ref(null)

export function useCapabilities () {
  // Function
  onMounted(async () => {
    if (!isInitialized) {
      isInitialized = true
      // fetch the api capabilities to get the version
      logger.debug('Fetching api capabilities')
      const response = await window.fetch(api.getBaseUrl() + _.get(config, 'apiPath') + '/capabilities')
      Capabilities.value = await response.json()
      // TODO : ensure backward compatibility
      Store.set('capabilities.api', Capabilities.value)
      Store.set('capabilities.client', Capabilities.value)
    }
  })

  // Expose
  return {
    Capabilities: readonly(Capabilities)
  }
}
