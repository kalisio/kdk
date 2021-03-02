import _ from 'lodash'
import { Events } from './events'
import { Store } from './store'

// Export singleton
export const Sorter = {
  initialize () {
    // This object is used to sort collections
    Store.set('sorter', { field: 'name', order: '1', query: {} })
    // Make filter react to external changes to update the query
    Events.$on('sorter-changed', () => this.updateSorterQuery())
  },
  get () {
    return Store.get('sorter')
  },
  getField () {
    return this.get().field
  },
  getOrder () {
    return this.get().order
  },  
  getQuery () {
    return Store.get('sorter.query')
  },
  // Build sort query
  updateSorterQuery () {
    const query = { $sort: { [this.getField()]: this.getOrder() } }
    // Avoid reentrance as we listen to other filter property changes
    if (!_.isEqual(query, this.getQuery())) Store.patch('sorter', { query })
  }
}
