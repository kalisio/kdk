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
    const now = moment.utc()
    Store.set('time', {
      range: {
        start: now.clone().subtract(1, 'months').startOf('day'),
        end: now.clone().endOf('day'),
        query: {}
      },
      format: {
        time: {
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
      },
      currentTime: now,
      step: 60 // 1H
    })
    // Make filter react to external changes to update the query
    Events.$on('time-range-changed', () => this.updateTimeRangeQuery())
  },
  convertToMoment (datetime) {
    if (moment.isMoment(datetime)) {
      // Clone to avoid mutating and force UTC mode
      return moment.utc(datetime.valueOf())
    } else { // Convert from Date, string or milliseconds (ie EPOCH)
      return moment.utc(datetime)
    }
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
  format(datetime, format) {
    let currentTime = this.convertToMoment(datetime)
    if (!this.getFormat().utc) {
      // Convert to local time
      currentTime = moment(currentTime.valueOf())
    }
    if (format === 'iso') return currentTime.format()
    // Defaults to long mode if not given
    else return currentTime.format(_.get(this.getFormat(), format, _.get(this.getFormat(), format + '.long')))
  },
  getCurrentTime () {
    return this.get().currentTime
  },
  setCurrentTime (datetime) {
    const now = this.convertToMoment(datetime)
    if (this.getCurrentTime().isSame(now)) return
    Store.patch('time.currentTime', now)
  },
  getCurrentFormattedTime () {
    const currentTime = this.getCurrentTime()
    return {
      time: {
        short: this.format(currentTime, 'time.short'),
        long: this.format(currentTime, 'time.long')
      },
      date: {
        short: this.format(currentTime, 'date.short'),
        long: this.format(currentTime, 'date.long')
      },
      year: {
        short: this.format(currentTime, 'year.short'),
        long: this.format(currentTime, 'year.long')
      },
      iso: this.format(currentTime, 'iso')
    }
  },
  getStep () {
    return this.get().step
  }
}
