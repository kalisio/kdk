import _ from 'lodash'
import logger from 'loglevel'
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range.js'
import config from 'config'
import { Events } from './events.js'
import { Store } from './store.js'
import { getLocale } from './utils.js'

// Export singleton
export const Time = {
  initialize () {
    // Timer for realtime mode
    this.timer = null
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
      realtime: false,
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
    if (this.getRange().start.isSame(range.start) &&
        this.getRange().end.isSame(range.end)) return
    Store.patch('time.range', range)
  },
  getRangeQuery () {
    return Store.get('time.range.query')
  },
  // Build sort query
  updateTimeRangeQuery () {
    const query = {}
    query[this.getRange().field] = { $gte: this.getRange().start.toISOString(), $lte: this.getRange().end.toISOString() }
    // Avoid reentrance as we listen to other filter property changes
    if (!_.isEqual(query, this.getRangeQuery())) Store.patch('time.range', { query })
  },
  getFormat () {
    return this.get().format
  },
  getFormatTimezone () {
    return this.getFormat().timezone
  },
  convertToLocal (datetime) {
    let currentTime = this.convertToMoment(datetime)
    // Convert to local time
    if (this.getFormatTimezone()) {
      currentTime = moment.tz(currentTime.toISOString(), this.getFormatTimezone())
    }
    return currentTime
  },
  format (datetime, format, options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) {
    // Convert to tz if defined
    const localDatetime = this.convertToLocal(datetime)
    if (format === 'iso') return localDatetime.toISOString()
    else if (format === 'locale') return localDatetime.toDate().toLocaleString(getLocale(), options)
    // Defaults to long mode if not given
    else return localDatetime.format(_.get(this.getFormat(), format))
  },
  getCurrentTime () {
    return this.get().currentTime
  },
  setCurrentTime (datetime) {
    if (this.isRealtime()) this.stopRealtime()
    const momentDatetime = this.convertToMoment(datetime)
    if (this.getCurrentTime().isSame(momentDatetime)) return
    Store.patch('time.currentTime', momentDatetime)
  },
  setNow () {
    this.setCurrentTime(moment.utc())
  },
  isRealtime () {
    return this.get().realtime
  },
  startRealtime () {
    if (this.isRealtime()) {
      logger.warn('Realtime mode is already active')
      return
    }
    Store.patch('time', { realtime: true })
    Store.patch('time.currentTime', moment.utc())
    this.timer = setInterval(() => {
      Store.patch('time.currentTime', moment.utc())
    }, 1000 * this.get().interval)
  },
  stopRealtime () {
    if (!this.isRealtime()) {
      logger.warn('Realtime mode is alrady inactive')
      return
    }
    Store.patch('time', { realtime: false })
    clearInterval(this.timer)
    this.timer = null
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
  },
  // Round hours to expected interval, e.g. using 6 hourly interval 00 || 06 || 12 || 18
  roundHours (hours, interval) {
    return (Math.floor(hours / interval) * interval)
  }
}
