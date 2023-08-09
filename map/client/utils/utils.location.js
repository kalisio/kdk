import _ from 'lodash'
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
    // TODO
    // Use the geocoders list in the options object to perform the query to the service
    // The new result should be an array of GeoJSON so the following formatting should be removed
    /*
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
    */
    let filter = ''
    if (options.geocoders) {
      filter = '&sources=*(' + options.geocoders.join('|') + ')'
    }
    const results = await fetch(`http://localhost:8091/forward?q=${pattern}${filter}`).then((response) => response.json())
    // locations.splice(0, -1, ...results)
    for (const result of results) {
      locations.push(Object.assign({}, _.pick(result, [ 'type', 'geometry', ]), { properties: { name: formatGeocodingResult(result), source: result.geokoder.source } }))
    }
  }
  return locations
}

export async function listGeocoders () {
  // TODO
  // return ['nominatin', 'ban']
  let list = []
  try {
    list = await fetch('http://localhost:8091/capabilities').then((response) => response.json())
  } catch (error) {
    // TODO: warn somehow
  }
  return list
}
