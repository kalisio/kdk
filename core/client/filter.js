import _ from 'lodash'
import { Events } from './events'
import { Store } from './store'

// Export singleton
export const Filter = {
  initialize (api) {
    // This object is used to filter the activities based on a search pattern or on specific items
    // The filter then builds the corresponding query
    Store.set('filter', { field: 'name', pattern: '', items: [], query: {} })
    // Make filter react to external changes to update the query
    Events.$on('filter-changed', () => this.updateFilterQuery(api))
  },
  get () {
    return Store.get('filter')
  },
  getItems () {
    return Store.get('filter.items')
  },
  getField () {
    return Store.get('filter.field')
  },
  getPattern () {
    return Store.get('filter.pattern')
  },
  getQuery () {
    return Store.get('filter.query')
  },
  // Build query from filter pattern and/or items
  updateFilterQuery (api) {
    const query = {}
    const pattern = this.getPattern()
    const field = this.getField()
    const items = this.getItems()
    // Handle the pattern
    if (pattern !== '') {
      query[field] = { $search: pattern }
    }
    // Handle the selection
    items.forEach(item => {
      // We must have only one item per service
      const itemQuery = { [item.field]: item[item.field] }
      // Check if base qury
      if (item.baseQuery) Object.assign(itemQuery, item.baseQuery)
      // Check if the service is contextual
      const options = api.getServiceOptions(item.service)
      // If so add context to distinguish items coming from different ones
      if (options.context && Store.get('context')) {
        itemQuery.context = Store.get('context._id')
      }
      Object.assign(query, { [item.service]: { $elemMatch: itemQuery } })
    })
    // Avoid reentrance as we listen to other filter property changes
    if (!_.isEqual(query, this.getQuery())) Store.patch('filter', { query })
  }
}
