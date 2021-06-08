import _ from 'lodash'
import { getLocale } from '../utils'

const baseCollectionMixin = {
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
      this.itemListener = this.getService().watch({ listStrategy: this.listStrategy || 'always' })
        .find({ query })
        .subscribe(response => {
          // Manage GeoJson features collection as well
          if (response.type === 'FeatureCollection') {
            this.items = response.features
          } else if (this.appendItems) {
            // Ensure there is no duplicates when appending
            this.items = _.unionBy(this.items, response.data, '_id')
          } else {
            this.items = response.data
          }
          this.nbTotalItems = response.total
          this.$emit('collection-refreshed', this.items)
        }, error => {
          this.$events.$emit('error', error)
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
    refreshCollection () {
      // Add locale to perform sorting (i.e. collation) correctly w.r.t. user's language
      const fullQuery = Object.assign({ $locale: getLocale() },
        this.getCollectionBaseQuery(),
        this.getCollectionFilterQuery(),
        this.getCollectionPaginationQuery())
      // Find the desired items
      this.subscribe(fullQuery)
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
    onItemSelected (item, section) {
      this.$emit('selection-changed', item, section)
    },
    onItemsSelected (items) {
      this.$emit('selection-changed', items)
    },
    onItemsUpdated (items) {
      // When we append items some items of the previous pages might have been updated.
      // In this case we need to reset the full collection as Rx only tracks changes on the current page
      let updatedItems = (Array.isArray(items) ? items : [items])
      updatedItems = _.intersectionWith(this.items, updatedItems, (item1, item2) => (item1._id.toString() === item2._id.toString()))
      if (updatedItems.length > 0) this.resetCollection()
    }
  },
  created () {
    if (this.appendItems) {
      const service = this.getService()
      service.on('patched', this.onItemsUpdated)
      service.on('updated', this.onItemsUpdated)
      service.on('removed', this.onItemsUpdated)
    }
  },  
  beforeDestroy () {
    this.unsubscribe()
    if (this.appendItems) {
      const service = this.getService()
      service.off('patched', this.onItemsUpdated)
      service.off('updated', this.onItemsUpdated)
      service.off('removed', this.onItemsUpdated)
    }
  }
}

export default baseCollectionMixin
