import _ from 'lodash'
import { Store, api } from '../../../core.client.js'
import { Geolocation } from '../geolocation.js'
import { formatGeocodingResult, parseCoordinates, formatUserCoordinates } from '../utils.js'

export function useLocation () {
  // Functions
  function current () {
    const position = Store.get('geolocation.position') || { longitude: 0, latitude: 0 }
    const name = formatUserCoordinates(position.latitude, position.longitude, Store.get('locationFormat', 'FFf'))
    return Object.assign(position, { name })
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
    const coordinates = parseCoordinates(pattern)
    if (coordinates) {
      const label = formatUserCoordinates(coordinates.latitude, coordinates.longitude, Store.get('locationFormat', 'FFf'))
      locations.push(Object.assign(coordinates, { name: label }))
    }
    // Build the list of responses if no coordinates were found
    if (_.isEmpty(locations)) {
      const geocoderService = api.getService('geocoder')
      if (!geocoderService) throw new Error('Cannot find geocoder service')
      const response = await geocoderService.create({ address: pattern })
      response.forEach(element => {
        const location = {
          name: formatGeocodingResult(element),
          latitude: element.latitude,
          longitude: element.longitude
        }
        locations.push(location)
      })
    }
    return locations
  }
  function fromGeoJSON (coordinates) {
    if (!coordinates) return
    return {
      latitude: coordinates[1],
      longitude: coordinates[0],
      name: formatUserCoordinates(coordinates[1], coordinates[0], Store.get('locationFormat', 'FFf'))
    }
  }
  function toGeoJSON (location) {
    if (!location) return
    return {
      coordinates: [location.longitude, location.latitude]
    }
  }
  // Expose
  return {
    current,
    geolocate,
    search,
    fromGeoJSON,
    toGeoJSON
  }
}
