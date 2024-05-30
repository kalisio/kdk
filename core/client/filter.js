import _ from 'lodash'
import { Events } from './events.js'
import { Store } from './store.js'
import { api } from './api.js'

// Export singleton
export const Filter = {
  initialize () {
    // This object is used to filter the activities based on a search pattern or on specific items
    // The filter then builds the corresponding query
    Store.set('filter', { fields: 'name', pattern: '', items: [], query: {} })
    // Make filter react to external changes to update the query
    Events.on('filter-changed', () => this.updateFilterQuery())
  },
  get () {
    return Store.get('filter')
  },
  getItems () {
    return Store.get('filter.items')
  },
  getFields () {
    const fields = Store.get('filter.fields')
    if (typeof fields === 'string') return [fields]
    return fields
  },
  getPattern () {
    return Store.get('filter.pattern')
  },
  getQuery () {
    return Store.get('filter.query')
  },
  clear () {
    Store.patch('filter', { fields: 'name', pattern: '', items: [], query: {} })
  },
  // Build query from filter pattern and/or items
  updateFilterQuery () {
    const query = {}
    const pattern = this.getPattern()
    const fields = this.getFields()
    const items = this.getItems()
    // Handle the pattern
    if (pattern !== '') {
      query['$or'] = _.map(fields, field => { return { [field]: { $search: pattern } } })
      console.log(query)
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
