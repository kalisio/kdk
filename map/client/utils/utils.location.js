import _ from 'lodash'
import config from 'config'
import { Store, api } from '../../../core.client.js'
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
  let list = []
  try {
    const endpoint = Store.get('capabilities.api.gateway') + '/geocoder'
    const jwt = await api.get('storage').getItem(config.gatewayJwt)
    list = await fetch(`${endpoint}/capabilities`, { headers: { Authorization: `Bearer ${jwt}` } }).then((response) => response.json())
  } catch (error) {
    // TODO: warn somehow
  }
  return list
}
