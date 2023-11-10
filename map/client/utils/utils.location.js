import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { Store, api, i18n, Events } from '../../../core.client.js'
import { formatUserCoordinates } from './utils.js'


// Format (reverse) geocoding output
function formatGeocodingResult (result) {
  const properties = result.properties
  if (!properties) {
    logger.warn(`[KDK] invalid geocoding result: missing 'properties' property`)
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
      logger.warn(`[KDK] invalid geocoding result: missing 'geokoder.matchProp' property`)
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

export async function searchLocation (pattern, options) {
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
    if (options.geocoders) {
      // only request geocoder results from specified sources
      filter = '&sources=*(' + options.geocoders.join('|') + ')'
    }
    const endpoint = Store.get('capabilities.api.gateway') + '/geocoder'
    const jwt = await api.get('storage').getItem(config.gatewayJwt)
    const query = `${endpoint}/forward?q=${pattern}${filter}`
    const results = await fetch(query, { headers: { Authorization: `Bearer ${jwt}` } }).then((response) => response.json())
    results.forEach(result => {
      locations.push(
        Object.assign(
          _.pick(result, ['type', 'geometry']),
          { properties: { name: formatGeocodingResult(result), source: result.geokoder.source } }))
    })
  }
  return locations
}

export async function listGeocoders () {
  let response
  try {
    const endpoint = Store.get('capabilities.api.gateway') + '/geocoder'
    const jwt = await api.get('storage').getItem(config.gatewayJwt)
    response = await fetch(`${endpoint}/capabilities/forward`, { headers: { Authorization: `Bearer ${jwt}` } }).then((response) => response.json())
    if (response.i18n) i18n.registerTranslation(response.i18n)
  } catch (error) {
    Events.emit('error', { message: i18n.t('errors.NETWORK_ERROR') })
  }
  return response ? response.geocoders : []
}
