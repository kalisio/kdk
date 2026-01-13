import moment from 'moment'
import { Time } from '../time.js'

// Add UTC offset to timezone name
export function getTimezoneLabel (timezone) {
  const offset = moment().tz(timezone).format('Z')
  return `${timezone} (${offset})`
}

// Convert to local time with timezone offset
// datetime must be expressed as an ISOString
export function toLocalTimezone (datetime, timezone) {
  return timezone ? moment.tz(datetime, timezone) : moment(datetime).local()
}

// Convert from moment date/time to quasar format in local time zone
export function toQuasarDate (date, format) {
  return Time.convertToLocal(date).format(format)
}

export function toQuasarTime (time, format) {
  return Time.convertToLocal(time).format(format)
}

// Convert from quasar format in local time zone to moment date/time
export function fromQuasarDate (date, format) {
  return (Time.getFormatTimezone()
    ? moment.tz(date, format, Time.getFormatTimezone())
    : moment(date, format))
}

export function fromQuasarTime (time, format) {
  return (Time.getFormatTimezone()
    ? moment.tz(time, format, Time.getFormatTimezone())
    : moment(time, format))
}

/*
  Round hours to expected interval, e.g. 6 hourly interval i.e. 00 || 06 || 12 || 18
  @return {Number}
 */
export function roundHours (hours, interval) {
  return (Math.floor(hours / interval) * interval)
}

/*
  Round minutes to expected interval, e.g. 10 minutely interval i.e. 00 || 10 || 20 || 30
  @return {Number}
 */
export function roundMinutes (minutes, interval) {
  return (Math.floor(minutes / interval) * interval)
}

/*
  Round hours to expected interval
  @return {Date}
 */
export function getNearestIntervalTime (datetime, interval) {
  // Compute nearest run T0, always in the past
  const h = (interval > 3600 ? roundHours(datetime.hours(), interval / 3600) : datetime.hours())
  const m = (interval <= 3600 ? roundMinutes(datetime.minutes(), interval / 60) : 0)
  return datetime.clone().hours(h).minutes(m).seconds(0).milliseconds(0)
}
