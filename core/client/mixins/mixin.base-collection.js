import _ from 'lodash'
import logger from 'loglevel'
import { getLocale } from '../utils/utils.locale.js'

export const baseCollection = {
  emits: [
    'collection-refreshed',
    'selection-changed',
    'item-toggled'
  ],
  props: {
    // This value can be overriden in activities if they want to manage pagination by themselves
    // nbItemsPerPage = 0 means that the client does not handle pagination and server defaults will be used
    nbItemsPerPage: {
      type: Number,
      default: 12
    },
    // This value indicate if items of each page replace or are appended to previous ones
    appendItems: {
      type: Boolean,
      default: false
    },
    // Only invoke refresh at most once per every refreshThrottle milliseconds
    refreshThrottle: {
      type: Number,
      default: 500
    }
  },
  computed: {
    nbPages () {
      return (this.nbItemsPerPage > 0 ? Math.ceil(this.nbTotalItems / this.nbItemsPerPage) : 1)
    }
  },
  data () {
    return {
      items: [],
      nbTotalItems: 0,
      currentPage: 1
    }
  },
  methods: {
    subscribe (query) {
      // Remove previous listener if any
      this.unsubscribe()
      this.itemListener = this.getService().watch({ listStrategy: this.listStrategy || 'smart' })
        .find({ query })
        .subscribe(response => {
          // Manage GeoJson features collection as well
          if (response.type === 'FeatureCollection') {
            this.items = response.features
          } else if (this.appendItems) {
            // Append the response ensuring there is no duplicates
            this.items = _.unionBy(response.data, this.items, '_id')
            // We keep order from the updated list as depending on the sorting criteria a new item might have to be pushed on top of current items
            const sortQuery = _.get(this.getCollectionBaseQuery(), '$sort')
            if (sortQuery) {
              // By default orderBy is case sensitive while using collation we want to perform case insensitive sort
              this.items = _.orderBy(this.items,
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
            this.items = response.data
          }
          this.nbTotalItems = response.total
          this.onCollectionRefreshed()
        }, error => {
          logger.error(error)
        })
    },
    unsubscribe () {
      if (this.itemListener) {
        this.itemListener.unsubscribe()
        this.itemListener = null
      }
    },
    getCollectionBaseQuery () {
      // This method should be overriden in collections
      return {}
    },
    getCollectionFilterQuery () {
      // This method should be overriden in collections
      return {}
    },
    getCollectionPaginationQuery () {
      // This method can be overriden in collections
      if (this.nbItemsPerPage > 0) {
        return {
          $limit: this.nbItemsPerPage,
          $skip: (this.currentPage - 1) * this.nbItemsPerPage
        }
      } else return {}
    },
    resetCollection () {
      // Reset pagination and start again refreshing the collection
      this.items = []
      this.currentPage = 1
      this.refreshCollection()
    },
    onPageChanged () {
      this.refreshCollection()
    },
    onItemToggled (item, toggled) {
      this.$emit('item-toggled', item, toggled)
    },
    onItemSelected (item, section) {
      this.$emit('selection-changed', item, section)
    },
    onItemsSelected (items) {
      this.$emit('selection-changed', items)
    },
    onCollectionRefreshed () {
      this.$emit('collection-refreshed', this.items)
    },
    onItemsUpdated (items) {
      // When we append items some items of the previous pages might have been updated.
      // In this case we need to reset the full collection as Rx only tracks changes on the current page
      let updatedItems = (Array.isArray(items) ? items : [items])
      // We keep order from the updated list as depending on the sorting criteria a new item might have to be pushed on top of current items
      updatedItems = _.intersectionWith(this.items, updatedItems, (item1, item2) => (item1._id.toString() === item2._id.toString()))
      if (updatedItems.length > 0) this.resetCollection()
    }
  },
  created () {
    // Avoid initiating too much request as the same time, this might be the case
    // when async UI components update simultaneously the base/filter query
    // see https://github.com/kalisio/kdk/issues/432
    const refreshCollection = () => {
      // Add locale to perform sorting (i.e. collation) correctly w.r.t. user's language
      const fullQuery = Object.assign({ $locale: getLocale() },
        this.getCollectionBaseQuery(),
        this.getCollectionFilterQuery(),
        this.getCollectionPaginationQuery())
      // Find the desired items
      this.subscribe(fullQuery)
    }
    this.refreshCollection = _.throttle(refreshCollection, this.refreshThrottle, { leading: false })

    if (this.appendItems) {
      const service = this.getService()
      service.on('patched', this.onItemsUpdated)
      service.on('updated', this.onItemsUpdated)
      service.on('removed', this.onItemsUpdated)
    }
  },
  beforeUnmount () {
    this.unsubscribe()
    if (this.appendItems) {
      const service = this.getService()
      service.off('patched', this.onItemsUpdated)
      service.off('updated', this.onItemsUpdated)
      service.off('removed', this.onItemsUpdated)
    }
  }
}
