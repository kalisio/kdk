import _ from 'lodash'
import moment from 'moment'
import { Events } from './events'
import { Store } from './store'

// Export singleton
export const Time = {
  initialize () {
    const now = moment()
    // This object is used to sort collections
    Store.set('time.range', { 
      start: now.clone().subtract(1, 'months').startOf('day'),
      end: now.clone().endOf('day'),
      query: {}
    })
    // Make filter react to external changes to update the query
    Events.$on('time-range-changed', () => this.updateTimeRangeQuery())
  },
  get () {
    return Store.get('time')
  },
  getRange () {
    return this.get().range
  },
  patchRange (range) {
    Store.patch('time.range', range)
  },
  getRangeQuery () {
    return Store.get('time.range.query')
  },
  // Build sort query
  updateTimeRangeQuery () {
    const query = { createdAt: { $gte: this.getRange().start, $lte: this.getRange().end } }
    // Avoid reentrance as we listen to other filter property changes
    if (!_.isEqual(query, this.getRangeQuery())) Store.patch('time.range', { query })
  }
}
