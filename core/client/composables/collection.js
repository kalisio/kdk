import _ from 'lodash'
import logger from 'loglevel'
import { ref, computed, watch, onBeforeMount, onBeforeUnmount } from 'vue'
import { api } from '../api.js'
import { getLocale } from '../utils/utils.locale.js'
import { listenToServiceEvents, unlistenToServiceEvents } from '../utils/utils.services.js'

export function useCollection (options) {
  _.defaults(options, {
    // This value can be overriden in activities if they want to manage pagination by themselves
    // nbItemsPerPage = 0 means that the client does not handle pagination and server defaults will be used
    nbItemsPerPage: ref(12),
    // This value indicate if items of each page replace or are appended to previous ones
    appendItems: ref(false),
    // Only invoke refresh at most once per every refreshThrottle milliseconds
    refreshThrottle: ref(500),
    // Refresh strategy to be used
    listStrategy: ref('smart'),
    // Item processor to be used
    processor: ref()
  })

  // Data
  const items = ref(null)
  const nbTotalItems = ref(0)
  const currentPage = ref(1)
  let itemListener = null
  let serviceEventListeners

  // Computed
  const nbPages = computed(() => {
    return options.nbItemsPerPage.value > 0
      ? Math.ceil(nbTotalItems.value / options.nbItemsPerPage.value)
      : 1
  })

  // Functions
  function getService () {
    const service = options.getService?.value ? options.getService.value() : api.getService(options.service.value, options.contextId ? options.contextId.value : null)
    if (!service) {
      throw new Error('Cannot retrieve target service ' + options.service.value)
    }
    return service
  }
  function getCollectionBaseQuery () {
    // This method should be overridden in collections
    return options.baseQuery ? options.baseQuery.value : {}
  }
  function getCollectionFilterQuery () {
    // This method should be overridden in collections
    return options.filterQuery ? options.filterQuery.value : {}
  }
  function getCollectionPaginationQuery () {
    // This method should be overridden in collections
    return (options.nbItemsPerPage.value > 0
      ? {
          $limit: options.nbItemsPerPage.value,
          $skip: (currentPage.value - 1) * options.nbItemsPerPage.value
        }
      : {})
  }
  function setCollectionItems (newItems) {
    // Item processor defined ?
    if (typeof options.processor.value === 'function') {
      newItems = options.processor.value(newItems)
    }
    items.value = newItems
  }
  function subscribe (query) {
    // Remove previous listener if any
    unsubscribe()
    itemListener = getService().watch({ listStrategy: options.listStrategy.value })
      .find({ query })
      .subscribe(response => {
        // Manage GeoJson features collection as well
        if (response.type === 'FeatureCollection') {
          setCollectionItems(response.features)
        } else if (options.appendItems.value) {
          // Append the response ensuring there is no duplicates
          const newItems = _.unionBy(response.data, items.value, '_id')
          // We keep order from the updated list as depending on the sorting criteria a new item might have to be pushed on top of current items
          const sortQuery = _.get(getCollectionBaseQuery(), '$sort')
          if (sortQuery) {
            // By default orderBy is case sensitive while using collation we want to perform case insensitive sort
            setCollectionItems(_.orderBy(newItems,
              // Sort function for each sort property
              _.map(_.keys(sortQuery), property => {
                return item => {
                  const value = _.get(item, property)
                  return (typeof value === 'string' ? value.toLowerCase() : value)
                }
              }),
              // Sort order for each sort property
              _.map(_.values(sortQuery), value => { return value > 0 ? 'asc' : 'desc' })))
          } else {
            setCollectionItems(newItems)
          }
        } else {
          setCollectionItems(response.data)
        }
        nbTotalItems.value = response.total
      }, error => {
        logger.error(error)
      })
  }

  function unsubscribe () {
    if (itemListener) {
      itemListener.unsubscribe()
      itemListener = null
    }
  }

  const refreshCollection = _.throttle(() => {
    const fullQuery = {
      $locale: getLocale(),
      ...getCollectionBaseQuery(),
      ...getCollectionFilterQuery(),
      ...getCollectionPaginationQuery()
    }
    subscribe(fullQuery)
  }, options.refreshThrottle.value, { leading: false })

  function resetCollection () {
    // Do not reset the collection since it is initializing
    if (_.isNil(items.value)) return
    // Reset pagination and start again refreshing the collection
    if (options.appendItems.value) setCollectionItems([])
    currentPage.value = 1
    refreshCollection()
  }

  function onItemsUpdated (updatedItems) {
    // When we append items some items of the previous pages might have been updated.
    // In this case we need to reset the full collection as Rx only tracks changes on the current page
    updatedItems = (Array.isArray(updatedItems) ? updatedItems : [updatedItems])
    // Update the required items
    for (const updatedItem of updatedItems) {
      const item = _.find(items.value, item => {
        return updatedItem._id && item._id && (updatedItem._id.toString() === item._id.toString())
      })
      if (item) Object.assign(item, updatedItem)
    }
  }

  function onItemsRemoved (removedItems) {
    // When we append items some items of the previous pages might have been updated.
    // In this case we need to reset the full collection as Rx only tracks changes on the current page
    removedItems = (Array.isArray(removedItems) ? removedItems : [removedItems])
    // Remove the required items
    for (const removedItem of removedItems) {
      _.remove(items.value, item => {
        return removedItem._id && item._id && (removedItem._id.toString() === item._id.toString())
      })
    }
  }

  // Lifecycle hooks
  watch(options.service, resetCollection)
  watch(options.listStrategy, resetCollection)
  watch(options.nbItemsPerPage, resetCollection)
  watch(options.appendItems, resetCollection)
  // Some are not mandatory or initialized by default
  if (options.contextId) watch(options.contextId, resetCollection)
  if (options.baseQuery) watch(options.baseQuery, resetCollection)
  if (options.filterQuery) watch(options.filterQuery, resetCollection)

  onBeforeMount(() => {
    if (options.appendItems.value) {
      serviceEventListeners = listenToServiceEvents(getService(), {
        patched: onItemsUpdated,
        updated: onItemsUpdated,
        removed: onItemsRemoved
      })
    }
  })

  // Cleanup for appendItems
  onBeforeUnmount(() => {
    unsubscribe()
    if (options.appendItems.value) {
      unlistenToServiceEvents(serviceEventListeners)
    }
  })

  return {
    items,
    nbTotalItems,
    currentPage,
    nbPages,
    setCollectionItems,
    subscribe,
    unsubscribe,
    getCollectionBaseQuery,
    getCollectionFilterQuery,
    getCollectionPaginationQuery,
    resetCollection,
    refreshCollection
  }
}
