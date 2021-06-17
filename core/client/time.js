import _ from 'lodash'
import moment from 'moment'
import { Events } from './events'
import { Store } from './store'
import { getLocale } from './utils'

// Export singleton
export const Time = {
  initialize () {
    // Set locale globally
    moment.locale(getLocale())
    // Set the time object within the store
    const now = moment()
    Store.set('time', {
      range: { 
        start: now.clone().subtract(1, 'months').startOf('day'),
        end: now.clone().endOf('day'),
        query: {}
      },
      format: {
        hour: {
          short: 'H[h]',
          long: 'HH:mm'
        },
        date: {
          short: 'DD/MM',
          long: 'dddd D'
        },
        year: {
          short: 'YY',
          long: 'YYYY'
        },
        utc: false
      }
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
  },
  getFormat () {
    return this.get().format
  },
  format (time, format) {
    if (!this.getFormat().utc) {
      // ensure local time
      time = moment(time.valueOf())
    }
    if (format === 'iso') return time.format()
    return time.format(_.get(this.getFormat(), format, _.get(this.getFormat(), format + '.long')))
  }
}
