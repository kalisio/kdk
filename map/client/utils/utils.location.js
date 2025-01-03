import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { Store, api, i18n, Events } from '../../../core.client.js'
import { formatUserCoordinates } from './utils.js'

// Format (reverse) geocoding output
function formatGeocodingResult (result) {
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
  // otherwise retireve the match prop
  if (!label) {
    if (!_.has(result, 'geokoder.matchProp')) {
      logger.warn('[KDK] invalid geocoding result: missing \'geokoder.matchProp\' property')
      return
    }
    label = _.get(result, result.geokoder.matchProp, '')
  }
  return label
}

export function parseCoordinates (str) {
  const coords = _.split(_.trim(str), ',')
  if (coords.length !== 2) return
  const latitude = Number(coords[0])
  if (_.isNaN(latitude)) return
  const longitude = Number(coords[1])
  if (_.isNaN(longitude)) return
  return {
    latitude,
    longitude
  }
}

export async function queryGeocoder(planetConfig, path, query = '') {
  const endpoint = planetConfig.gateway + '/geocoder'
  const jwt = await api.get('storage').getItem(planetConfig.gatewayJwt)
  let url = `${endpoint}/${path}`
  if (query) url += `?${query}`
  const response = await fetch(url, { headers: { Authorization: `Bearer ${jwt}` } })
  const results = await response.json()
  return results
}

export async function searchLocation (planetConfig, pattern, options) {
  const locations = []
  // Try to parse lat/long coordinates
  const coordinates = parseCoordinates(pattern)
  if (coordinates) {
    locations.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [coordinates.longitude, coordinates.latitude]
      },
      properties: {
        name: formatUserCoordinates(coordinates.latitude, coordinates.longitude, Store.get('locationFormat', 'FFf'))
      }
    })
  } else {
    let filter = ''
    if (!_.isEmpty(options.geocoders)) {
      // only request geocoder results from specified sources
      filter += '&sources=*(' + options.geocoders.join('|') + ')'
    }
    if (!_.isEmpty(options.viewbox)) {
      filter += '&viewbox=' + options.viewbox.join(',')
    }


    const results = await queryGeocoder(planetConfig, 'forward', `q=${pattern}${filter}`)
    results.forEach(result => {
      locations.push(
        Object.assign(
          _.pick(result, ['type', 'geometry']),
          { properties: { name: formatGeocodingResult(result), source: result.geokoder.source } }))
    })
  }
  return locations
}

export async function listGeocoders (planetConfig) {
  let response
  try {
    response = await queryGeocoder(planetConfig, 'capabilities/forward')
    if (response.i18n) i18n.registerTranslation(response.i18n)
  } catch (error) {
    Events.emit('error', { message: i18n.t('errors.NETWORK_ERROR') })
  }
  return _.get(response, 'geocoders', [])
}

// Filter geocoder sources based on given project
export function filterGeocoders(geocoders, project) {
  return geocoders.filter(geocoder => {
    // Geocoder id can directly be a string or the value of UI elements with label/value
    const id = geocoder.value || geocoder
    if (project && id.startsWith('kano:')) {
      const service = id.replace('kano:', '')
      // Depending on the layer the geocoding source (i.e. collection/service) is not the same
      let layer = _.find(project.layers, { service })
      if (!layer) layer = _.find(project.layers, { probeService: service })
      return layer
    }
    return true
  })
}