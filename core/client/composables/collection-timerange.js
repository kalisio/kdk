import _ from 'lodash'
import logger from 'loglevel'
import { ref, watchEffect, onBeforeMount, onBeforeUnmount } from 'vue'
import { api } from '../api.js'
import { listenToServiceEvents, unlistenToServiceEvents } from '../utils/utils.services.js'

export function useCollectionTimeRange (options = {}) {
  // Data
  const timeRange = ref(null)
  let serviceEventListeners

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
    let start, end
    const timeProperty = options.property ? options.property.value : 'createdAt'
    // get start time
    const startQuery = { $sort: {[timeProperty]: 1 }, $limit: 1 }
    logger.debug(`[KDK] Get min timestamp on service '${options.service.value}' with query`, startQuery)
    const startResponse = await getService().find({ query: _.merge({}, getBaseQuery(), getFilterQuery(), startQuery) })
    if (_.size(startResponse.data) > 0) start = startResponse.data[0]
    // get end time
    const endQuery = { $sort: {[timeProperty]: -1 }, $limit: 1 }
    logger.debug(`[KDK] Get max timestamp on service '${options.service.value}' with query`, endQuery)
    const endResponse = await getService().find({ query: _.merge({}, getBaseQuery(), getFilterQuery(), endQuery) }) 
    if (_.size(endResponse.data) > 0) end = endResponse.data[0]
    timeRange.value = { start: _.get(start, timeProperty), end: _.get(end, timeProperty) }
  }

  // Hooks
  onBeforeMount(() => {
    serviceEventListeners = listenToServiceEvents(getService(), { all: refresh })
  })
  onBeforeUnmount(() => {
    unlistenToServiceEvents(serviceEventListeners)
  })

  return {
    timeRange
  }
}
