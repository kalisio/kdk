import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { Store, api, i18n, Events } from '../../core/client/index.js'
import { parseCoordinates } from './utils/index.js'
import { formatUserCoordinates, formatForwardGeocodingResult } from './utils/utils.location.js'
import { Planets } from './planets.js'

export const Geocoder = {
  initialize () {
    // Sets the available apps
    Store.set('geocoder', _.defaultsDeep(config.geocoder, {
      planet: undefined,
      path: 'geocoder'
    }))
    logger.debug('[KDK] Geocoder initialized with configuration:', Store.get('geocoder'))
  },
  getApiConfig () {
    const planet = Store.get('geocoder.planet')
    if (planet) return Planets.get(planet).getConfig()
    return api.getConfig() 
  },
  getApiPath () {
    return Store.get('geocoder.path')
  },
  async query (path, query = '') {
    // retrieve required data
    const apiConfig = this.getApiConfig()
    const endpoint = `${apiConfig.gateway}/${this.getApiPath()}`
    const jwt = await api.get('storage').getItem(apiConfig.gatewayJwt)
    // setup the query url
    let url = `${endpoint}/${path}`
    if (query) url += `?${query}`
    // query the service
    const response = await fetch(url, { headers: { Authorization: `Bearer ${jwt}` } })
    return response.json()
  },
  async getForwardCapabilities () {
    let response
    try {
      response = await this.query('capabilities/forward')
      if (response.i18n) i18n.registerTranslation(response.i18n)
    } catch (error) {
      Events.emit('error', { message: i18n.t('errors.NETWORK_ERROR') })
    }
    return _.get(response, 'geocoders', [])
  },
  async getReverseCapabilities () {
    let response
    try {
      response = await this.query('capabilities/reverse')
      if (response.i18n) i18n.registerTranslation(response.i18n)
    } catch (error) {
      Events.emit('error', { message: i18n.t('errors.NETWORK_ERROR') })
    }
    return _.get(response, 'geocoders', [])
  },
  async queryForward (pattern, options = {}) {
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
      // Take into account optional geocoders
      if (!_.isEmpty(options.geocoders)) {
        filter += '&sources=*(' + options.geocoders.join('|') + ')'
      }
      // Take into account optional viewbo
      if (!_.isEmpty(options.viewbox)) {
        filter += '&viewbox=' + options.viewbox.join(',')
      }
      // Define the limit
      filter += '&limit=' + (options.limit || 20)
      const results = await this.query('forward', `q=${pattern}${filter}`)
      results.forEach(result => {
        locations.push(
          Object.assign(
            _.pick(result, ['type', 'geometry']),
            { properties: { name: formatForwardGeocodingResult(result), source: result.geokoder.source } }))
      })
    }
    return locations
  }
  
}
