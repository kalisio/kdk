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
    const geocoderService = api.getService('geocoder')
    if (!geocoderService) throw new Error('Cannot find geocoder service')
    const response = await geocoderService.create({ address: pattern })
    response.forEach(element => {
      locations.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [element.longitude, element.latitude]
        },
        properties: {
          name: formatGeocodingResult(element)
        }
      })
    })
  }
  return locations
}

export async function listGeocoders () {
  // TODO
  return ['nominatin', 'ban']
}
