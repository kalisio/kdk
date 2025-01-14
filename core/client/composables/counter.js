import _ from 'lodash'
import logger from 'loglevel'
import { ref, watchEffect, onBeforeMount, onBeforeUnmount } from 'vue'
import { api } from '../api.js'

export function useCounter (options) {
  // Data
  const counter = ref(0)

  // Watch
  watchEffect(() => refresh())

  // Functions
  function getService () {
    const service = api.getService(options.service.value, options.contextId ? options.contextId.value : null)
    if (!service) {
      throw new Error('[KDK] Cannot retrieve target service ' + options.service.value)
    }
    return service
  }
  function getBaseQuery () {
    return options.baseQuery ? options.baseQuery.value : {}
  }
  function getFilterQuery () {
    return options.filterQuery ? options.filterQuery.value : {}
  }
  async function refresh () {
    const query = _.merge(getBaseQuery(), getFilterQuery(), { $limit: 0 })
    logger.trace(`[KDK] Count service ${options.service.value} with query ${query}`)
    const response = await getService().find({ query })
    counter.value = response.total
  }

  // Hooks
  onBeforeMount(async () => {
    const service = getService()
    service.on('created', refresh)
    service.on('removed', refresh)
  })
  onBeforeUnmount(() => {
    const service = getService()
    service.off('created', refresh)
     service.off('removed', refresh)
  })

  return {
    counter
  }
}
