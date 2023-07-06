import { ref, computed, watch, onBeforeMount, onBeforeUnmount } from 'vue'
import _ from 'lodash'
import logger from 'loglevel'
import { api } from '../api.js'
import { getLocale } from '../utils/utils.locale.js'

export function useCollection(options) {
  _.defaults(options, {
    // This value can be overriden in activities if they want to manage pagination by themselves
    // nbItemsPerPage = 0 means that the client does not handle pagination and server defaults will be used
    nbItemsPerPage: 12,
    // This value indicate if items of each page replace or are appended to previous ones
    appendItems: false,
    // Only invoke refresh at most once per every refreshThrottle milliseconds
    refreshThrottle: 500,
    // Refresh strategy to be used
    listStrategy: 'smart'
  })
  
  // Data
  const items = ref([])
  const nbTotalItems = ref(0)
  const currentPage = ref(1)
  let itemListener = null

  // Computed
  const nbPages = computed(() => {
    return options.nbItemsPerPage > 0
      ? Math.ceil(nbTotalItems.value / options.nbItemsPerPage)
      : 1
  })

  // Functions
  function getService () {
    const service = api.getService(options.service, options.contextId)
    if (!service) {
      throw new Error('Cannot retrieve target service ' + options.service)
    }
    return service
  }
  function getCollectionBaseQuery () {
    // This method should be overriden in collections
    return options.baseQuery || {}
  }
  function getCollectionFilterQuery () {
    // This method should be overriden in collections
    return options.filterQuery || {}
  }
  function getCollectionPaginationQuery () {
    // This method should be overriden in collections
    return (options.nbItemsPerPage > 0 ? {
      $limit: options.nbItemsPerPage,
      $skip: (currentPage.value - 1) * options.nbItemsPerPage
    } : {})
  }
  function subscribe (query) {
    // Remove previous listener if any
    unsubscribe()
    itemListener = getService().watch({ listStrategy: options.listStrategy })
      .find({ query })
      .subscribe(response => {
        // Manage GeoJson features collection as well
        if (response.type === 'FeatureCollection') {
          items.value = response.features
        } else if (options.appendItems) {
          // Append the response ensuring there is no duplicates
          items.value = _.unionBy(response.data, items.value, '_id')
          // We keep order from the updated list as depending on the sorting criteria a new item might have to be pushed on top of current items
          const sortQuery = _.get(getCollectionBaseQuery(), '$sort')
          if (sortQuery) {
            // By default orderBy is case sensitive while using collation we want to perform case insensitive sort
            items.value = _.orderBy(items.value,
              // Sort function for each sort property
              _.map(_.keys(sortQuery), property => {
                return item => {
                  const value = _.get(item, property)
                  return (typeof value === 'string' ? value.toLowerCase() : value)
                }
              }),
              // Sort order for each sort property
              _.map(_.values(sortQuery), value => { return value > 0 ? 'asc' : 'desc' }))
          }
        } else {
          items.value = response.data
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
  }, options.refreshThrottle, { leading: false })

  function resetCollection () {
    // Reset pagination and start again refreshing the collection
    items.value = []
    currentPage.value = 1
    refreshCollection()
  }

  function onItemsUpdated (items) {
    // When we append items some items of the previous pages might have been updated.
    // In this case we need to reset the full collection as Rx only tracks changes on the current page
    let updatedItems = (Array.isArray(items) ? items : [items])
    // We keep order from the updated list as depending on the sorting criteria a new item might have to be pushed on top of current items
    updatedItems = _.intersectionWith(items.value, updatedItems, (item1, item2) => (item1._id.toString() === item2._id.toString()))
    if (updatedItems.length > 0) resetCollection()
  }

  // Lifecycle hooks
  watch(() => options, resetCollection)
  watch(() => options.filterQuery, resetCollection)

  onBeforeMount(() => {
    if (options.appendItems) {
      const service = getService()
      service.on('patched', onItemsUpdated)
      service.on('updated', onItemsUpdated)
      service.on('removed', onItemsUpdated)
    }
  })

  // Cleanup for appendItems
  onBeforeUnmount(() => {
    unsubscribe()
    if (options.appendItems) {
      const service = getService()
      service.off('patched', onItemsUpdated)
      service.off('updated', onItemsUpdated)
      service.off('removed', onItemsUpdated)
    }
  })

  return {
    items,
    nbTotalItems,
    currentPage,
    nbPages,
    subscribe,
    unsubscribe,
    getCollectionBaseQuery,
    getCollectionFilterQuery,
    getCollectionPaginationQuery,
    resetCollection,
    refreshCollection
  }
}