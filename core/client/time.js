import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range.js'
import config from 'config'
import { Events } from './events.js'
import { Store } from './store.js'
import { getLocale } from './utils.js'

// Export singleton
export const Time = {
  initialize () {
    // Set locale globally
    moment.locale(getLocale())
    // Set the time object within the store
    const now = moment.utc()
    // Try to guess user timezone
    const timezone = moment.tz.guess() || ''
    Store.set('time', _.merge(config.time || {}, {
      range: {
        start: now.clone().subtract(1, 'months').startOf('day'),
        end: now.clone().endOf('day'),
        field: 'createdAt',
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
        timezone
      },
      currentTime: now,
      step: 60, // 1H
      interval: 60 // 1m
    }))
    this.updateTimeRangeQuery()
    // Make filter react to external changes to update the query
    Events.on('time-range-changed', () => this.updateTimeRangeQuery())
  },
  convertToMoment (datetime) {
    if (moment.isMoment(datetime)) {
      // Clone to avoid mutating and force UTC mode
      return moment.utc(datetime.valueOf())
    } else { // Convert from Date, string or milliseconds (ie EPOCH)
      // Check for ambiguous input as ISO 8601 consider it as locale and not UTC
      if ((typeof datetime === 'string') && !datetime.endsWith('Z')) return moment(datetime).utc()
      else return moment.utc(datetime)
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
    const query = {}
    query[this.getRange().field] = { $gte: this.getRange().start.format(), $lte: this.getRange().end.format() }
    // Avoid reentrance as we listen to other filter property changes
    if (!_.isEqual(query, this.getRangeQuery())) Store.patch('time.range', { query })
  },
  getFormat () {
    return this.get().format
  },
  getFormatTimezone () {
    return this.getFormat().timezone
  },
  format (datetime, format, options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) {
    const currentTime = this.convertToMoment(datetime)
    // Convert to local time
    if (this.getFormatTimezone()) {
      currentTime.tz(this.getFormatTimezone())
    }
    if (format === 'iso') return currentTime.format()
    else if (format === 'locale') return currentTime.toDate().toLocaleString(getLocale(), options)
    // Defaults to long mode if not given
    else return currentTime.format(_.get(this.getFormat(), format))
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
