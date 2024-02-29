import _ from 'lodash'
import L from 'leaflet'
import moment from 'moment'
import { unref, watch } from 'vue'
import { Time } from '../../../core/client/time.js'
import { Units } from '../../../core/client/units.js'
import * as composables from '../../../core/client/composables/index.js'
import { getNearestTime } from '../utils.js'

export function useWeather (options = {}) {
  // retrieve activity
  const { kActivity } = composables.useCurrentActivity()
  // Avoid using .value everywhere
  let activity = unref(kActivity)
  // Watch change
  watch(kActivity, (newActivity) => {
    newActivity = unref(newActivity)
    // Avoid multiple updates
    if (activity === newActivity) return
    if (newActivity) {
      activity = newActivity
    }
  })
  // data

  // functions
  function getProbedLocationForecastFields () {
    return {
      // Only wind/temperature can be available at different levels now
      windDirection: (activity.forecastLevel ? `properties.windDirection-${activity.forecastLevel}` : 'properties.windDirection'),
      windSpeed: (activity.forecastLevel ? `properties.windSpeed-${activity.forecastLevel}` : 'properties.windSpeed'),
      temperature: (activity.forecastLevel ? `properties.temperature-${activity.forecastLevel}` : 'properties.temperature'),
      gust: 'properties.gust',
      precipitations: 'properties.precipitations',
      humidity: 'properties.humidity',
      time: 'forecastTime',
      name: 'properties.name'
    }
  }
  function isWeatherProbe (feature) {
    const { windDirection, windSpeed } = getProbedLocationForecastFields()
    return (_.has(feature, windDirection) &&
            _.has(feature, windSpeed))
  }
  function getForecastAsHtml (feature, fields = {}) {
    const defaults = getProbedLocationForecastFields()
    // Retrieve target fields on feature
    const windDirectionField = _.get(fields, 'windDirection', defaults.windDirection)
    const windSpeedField = _.get(fields, 'windSpeed', defaults.windSpeed)
    const gustField = _.get(fields, 'gust', defaults.gust)
    const temperatureField = _.get(fields, 'temperature', defaults.temperature)
    const precipitationsField = _.get(fields, 'precipitations', defaults.precipitations)
    const humidityField = _.get(fields, 'humidity', defaults.humidity)
    const timeField = _.get(fields, 'time', defaults.time)
    const nameField = _.get(fields, 'name', defaults.name)
    // Then get values for fields
    const windDirection = _.get(feature, `${windDirectionField}`)
    const windSpeed = _.get(feature, `${windSpeedField}`)
    const gust = _.get(feature, `${gustField}`)
    const temperature = _.get(feature, `${temperatureField}`)
    const precipitations = _.get(feature, `${precipitationsField}`)
    const humidity = _.get(feature, `${humidityField}`)
    let time = _.get(feature, `${timeField}`)
    // We can have a single time or a map between fields and available times
    // If a single time is found we will display it once,
    // otherwise we will display a different time for each field
    let uniqTime = true
    if (typeof time === 'object') {
      const uniqTimes = _.uniq(_.values(time))
      if (uniqTimes.length > 1) {
        uniqTime = false
      } else {
        // Update time in place with actual value
        time = uniqTimes[0]
      }
    }
    const getTimeAsHtml = (time) => {
      if (!_.isNil(time)) {
        time = moment.utc(time)
        if (time.isValid()) return ` (${Time.format(time, 'date.short')} - ${Time.format(time, 'time.long')})`
      }
      return ''
    }
    let html = ''
    if (!_.isNil(windSpeed) && _.isFinite(windSpeed)) {
      html += Units.format(windSpeed, 'm/s')
      // Add related time if any
      if (!uniqTime) html += getTimeAsHtml(_.get(time, windSpeedField.replace('properties.', '')))
      html += '</br>'
    }
    if (!_.isNil(gust) && _.isFinite(gust)) {
      html += `max ${Units.format(gust, 'm/s')}`
      // Add related time if any
      if (!uniqTime) html += getTimeAsHtml(_.get(time, gustField.replace('properties.', '')))
      html += '</br>'
    }
    if (!_.isNil(windDirection) && _.isFinite(windDirection)) {
      html += Units.format(windDirection, 'deg')
      // Add related time if any
      if (!uniqTime) html += getTimeAsHtml(_.get(time, windDirectionField.replace('properties.', '')))
      html += '</br>'
    }
    if (!_.isNil(precipitations) && _.isFinite(precipitations)) {
      html += Units.format(precipitations, 'mm/h')
      // Add related time if any
      if (!uniqTime) html += getTimeAsHtml(_.get(time, precipitationsField.replace('properties.', '')))
      html += '</br>'
    }
    if (!_.isNil(humidity) && _.isFinite(humidity)) {
      html += `${humidity.toFixed(0)} %`
      // Add related time if any
      if (!uniqTime) html += getTimeAsHtml(_.get(time, humidityField.replace('properties.', '')))
      html += '</br>'
    }
    if (!_.isNil(temperature) && _.isFinite(temperature)) {
      html += Units.format(temperature, 'degC')
      // Add related time if any
      if (!uniqTime) html += getTimeAsHtml(_.get(time, temperatureField.replace('properties.', '')))
      html += '</br>'
    }
    // If we have any value add name/time information
    if (html) {
      const name = _.get(feature, `${nameField}`)
      if (!_.isNil(name)) html = `<b><u>${name}</u></b></br>` + html
      // If we get a signle time for all field add it at the end
      if (uniqTime) {
        html += getTimeAsHtml(time)
      }
    }
    return html
  }
  function getForecastValueAtCurrentTime (times, values) {
    // Check for the right value at time
    if (Array.isArray(times) && Array.isArray(values)) {
      // Look for the nearest time
      const nearestTime = getNearestTime(Time.getCurrentTime(), times.map(time => moment.utc(time)))
      // Check if we found a valid time within interval, otherwise the time is missing
      if ((nearestTime.difference / 1000) > (0.5 * activity.forecastModel.interval)) return null
      else return values[nearestTime.index]
    } else {
      // Constant value
      return values
    }
  }
  function getProbedLocationForecastAtCurrentTime (probedLocation) {
    // Create new geojson from raw response containing all times
    const feature = _.cloneDeep(probedLocation)
    // Then check for the right value at time
    _.forOwn(feature.properties, (value, key) => {
      if (Array.isArray(value)) {
        const times = _.get(feature, 'forecastTime.' + key)
        if (times) {
          _.set(feature, 'properties.' + key, getForecastValueAtCurrentTime(times, value))
          _.set(feature, 'forecastTime.' + key, getForecastValueAtCurrentTime(times, times))
        }
      }
    })
    return feature
  }
  function getWindBarbOptions (feature, fields = {}) {
    const defaults = getProbedLocationForecastFields()
    // Retrieve target fields on feature
    let windDirection = _.get(fields, 'windDirection', defaults.windDirection)
    let windSpeed = _.get(fields, 'windSpeed', defaults.windSpeed)
    // TODO: colorize according to temperature scale if ?
    // let temperature = _.get(fields, 'temperature', 'properties.temperature')
    // Then get values for fields
    windDirection = _.get(feature, `${windDirection}`)
    windSpeed = _.get(feature, `${windSpeed}`)
    if (_.isNil(windDirection) || !_.isFinite(windDirection) ||
        _.isNil(windSpeed) || !_.isFinite(windSpeed)) return null
    // Then get values for fields
    return {
      deg: windDirection,
      speed: windSpeed, // Expressed as m/s
      pointRadius: 10,
      pointColor: '#2196f3',
      pointStroke: '#888888',
      strokeWidth: 2,
      strokeColor: '#888888',
      strokeLength: 12,
      fillColor: '#2196f3',
      barbSpaceing: 4,
      barbHeight: 10,
      forceDir: true
    }
  }
  function createWindBarbIcon (feature) {
    const options = getWindBarbOptions(feature)
    return (options ? new L.WindBarb.Icon(getWindBarbOptions(feature)) : null)
  }
  function getProbedLocationForecastTooltip (feature, layer, options) {
    const html = getForecastAsHtml(feature)
    return (html ? L.tooltip({ permanent: false }, layer).setContent(`<b>${html}</b>`) : null)
  }
  function getProbedLocationForecastMarker (feature, latlng, options) {
    // Use wind barbs on probed features
    const icon = createWindBarbIcon(feature)
    return (icon ? L.marker(latlng, { icon }) : null)
  }

  // expose
  return {
    getProbedLocationForecastFields,
    isWeatherProbe,
    getForecastAsHtml,
    getWindBarbOptions,
    createWindBarbIcon,
    getProbedLocationForecastAtCurrentTime,
    getProbedLocationForecastTooltip,
    getProbedLocationForecastMarker
  }
}
