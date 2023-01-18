import _ from 'lodash'
import { Store, api } from '../../../core.client.js'
import { Geolocation } from '../geolocation.js'
import { formatGeocodingResult, parseCoordinates, formatUserCoordinates } from '../utils.js'

export function useLocation () {
  // Functions
  function current () {
    const position = Store.get('geolocation.position') || { longitude: 0, latitude: 0 }
    const name = formatUserCoordinates(position.latitude, position.longitude, Store.get('locationFormat', 'FFf'))
    return Object.assign({}, position, { name })
  }
  async function geolocate () {
    await Geolocation.update()
    const error = Store.get('geolocation.error')
    if (error) return
    return current()
  }
  async function search (pattern, geocoders) {
    const locations = []
    // Try to parse lat/long coordinates
    const coord = parseCoordinates(pattern)
    if (coord) {
      const label = formatUserCoordinates(coord.latitude, coord.longitude, Store.get('locationFormat', 'FFf'))
      locations.push(Object.assign(coord, { name: label }))
    }
    // Build the list of responses if no coordinates were found
    if (_.isEmpty(locations)) {
      const geocoderService = api.getService('geocoder')
      if (!geocoderService) throw new Error('Cannot find geocoder service')
      const response = await geocoderService.create({ address: pattern })
      response.forEach(element => {
        const place = {
          name: formatGeocodingResult(element),
          latitude: element.latitude,
          longitude: element.longitude
        }
        locations.push(place)
      })
    }
    return locations
  }
  // Expose
  return {
    current,
    geolocate,
    search
  }
}
