import _ from 'lodash'
import logger from 'loglevel'
import formatcoords from 'formatcoords'

export function parseCoordinates (str) {
  let longitude, latitude
  // DD Formatted form
  const DDRegexp = /(-?\d+(?:\.\d+)?)°\s*([NSEW])\s+(-?\d+(?:\.\d+)?)°\s*([NSEW])/
  let match = str.match(DDRegexp)
  if (match) {
    if (match[2] === 'N' || match[2] === 'S') {
      latitude = parseFloat(match[1])
      if (match[2] === 'S') latitude = -latitude
      longitude = parseFloat(match[3])
      if (match[4] === 'W') longitude = -longitude
      return { longitude, latitude }
    } else {
      longitude = parseFloat(match[1])
      if (match[2] === 'W') longitude = -longitude
      latitude = parseFloat(match[3])
      if (match[4] === 'S') latitude = -latitude
      return { longitude, latitude }
    }
  }
  // Simple regexp
  const simpleRegexp = /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/
  match = str.match(simpleRegexp)
  if (match) {
    longitude = parseFloat(match[1])
    latitude = parseFloat(match[2])
    return { longitude, latitude }
  }
}

export function formatUserCoordinates (lat, lon, format, options) {
  if (format === 'aeronautical') {
    const coords = formatcoords(lat, lon)
    // longitude group: DDMMML where DD is degree (2 digits mandatory)
    // MMM unit is in 0.1 minutes (trailing 0 optional)
    // L is N/S
    const latDeg = coords.latValues.degreesInt.toString().padStart(2, '0')
    const latMin = Math.floor(coords.latValues.secondsTotal / 6).toString().padStart(3, '0')
    const latDir = coords.north ? 'N' : 'S'
    // longitude group: DDDMMML where DDD is degree (3 digits mandatory)
    // MMM unit is in 0.1 minutes (trailing 0 optional)
    // L is W/E
    const lonDeg = coords.lonValues.degreesInt.toString().padStart(3, '0')
    const lonMin = Math.floor(coords.lonValues.secondsTotal / 6).toString().padStart(3, '0')
    const lonDir = coords.east ? 'E' : 'W'
    return `${latDeg}${latMin}${latDir} ${lonDeg}${lonMin}${lonDir}`
  }
  return formatcoords(lat, lon).format(format, options)
}

// Format results from forward query
export function formatForwardGeocodingResult (result) {
  const properties = result.properties
  if (!properties) {
    logger.warn('[KDK] invalid geocoding result: missing \'properties\' property')
    return
  }
  // check whether the result as a valid formatted address
  let label = properties.formattedAddress || ''
  // try to build a formatted address
  if (!label) {
    if (properties.streetNumber) label += (properties.streetNumber + ', ')
    if (properties.streetName) label += (properties.streetName + ' ')
    if (properties.city) label += (properties.city + ' ')
    if (properties.zipcode) label += (' (' + properties.zipcode + ')')
  }
  // otherwise retrieve the match prop
  if (!label) {
    if (!_.has(result, 'geokoder.matchProp')) {
      logger.warn('[KDK] invalid geocoding result: missing \'geokoder.matchProp\' property')
      return
    }
    label = _.get(result, result.geokoder.matchProp, '')
  }
  return label
}

// Filter geocoder sources based on given project
export function filterGeocoders(geocoders, project) {
  return geocoders.filter(geocoder => {
    // Geocoder id can directly be a string or the value of UI elements with label/value
    const id = geocoder.value || geocoder
    if (project && id.includes('kano:')) {
      const service = _.replace(id, /^(.*:)?kano:/g, '')
      // Depending on the layer the geocoding source (i.e. collection/service) is not the same
      let layer = _.find(project.layers, { service })
      if (!layer) layer = _.find(project.layers, { probeService: service })
      return layer
    }
    return true
  })
}