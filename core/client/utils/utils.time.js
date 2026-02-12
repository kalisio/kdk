import moment from 'moment'
import { Time } from '../time.js'

// Add UTC offset to timezone name
export function getTimezoneLabel (timezone) {
  const offset = moment().tz(timezone).format('Z')
  return `${timezone} (${offset})`
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
