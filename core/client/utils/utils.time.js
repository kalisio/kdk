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