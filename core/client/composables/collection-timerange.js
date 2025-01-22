import _ from 'lodash'
import logger from 'loglevel'
import { ref, watchEffect, onBeforeMount, onBeforeUnmount } from 'vue'
import { api } from '../api.js'

export function useCollectionTimeRange (options) {
  // Data
  const dateRange = ref(null)

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
    const query = _.merge(getBaseQuery(), getFilterQuery(), {
      $aggregation: {
        pipeline: [
          {
            $group: {
              _id: null,
              minDate: { $min: `$${options.property ? options.property.value : 'createdAt'}` },
              maxDate: { $max: `$${options.property ? options.property.value : 'createdAt'}` },
            }
          },
          {
            $project: {
              _id: 0,
              minDate: 1,
              maxDate: 1
            }
          }
        ]
      }
    })
    logger.trace(`[KDK] CollectionTimeRange service ${options.service.value} with query ${query}`)
    const response = await getService().find({ query })
    let collectionDateRange = null
    if (response.length > 0) {
      collectionDateRange = { start: response[0].minDate, end: response[0].maxDate }
    }
    dateRange.value = collectionDateRange
  }

  // Hooks
  onBeforeMount(async () => {
    const service = getService()
    service.on('created', refresh)
    service.on('updated', refresh)
    service.on('patched', refresh)
    service.on('removed', refresh)
  })
  onBeforeUnmount(() => {
    const service = getService()
    service.off('created', refresh)
    service.off('updated', refresh)
    service.off('patched', refresh)
    service.off('removed', refresh)
  })

  return {
    dateRange
  }
}
