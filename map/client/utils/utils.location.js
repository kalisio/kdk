import _ from 'lodash'
import config from 'config'
import { Store, api, i18n, Events } from '../../../core.client.js'
import { formatGeocodingResult, parseCoordinates, formatUserCoordinates } from '../utils.js'

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
