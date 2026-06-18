import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { Store, api, i18n, Events } from '../../core/client/index.js'
import { parseCoordinates } from './utils/index.js'
import {
  formatUserCoordinates,
  formatForwardGeocodingResult ,
  formatReverseGeocodingResult
} from './utils/utils.location.js'
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
    if (!_.has(apiConfig, 'gateway')) {
      logger.error('[KDK] Invalid Geocoder configuration: missing \'gateway\' property')
      return
    }
    if (!_.has(apiConfig, 'gatewayJwt')) {
      logger.error('[KDK] Invalid Geocoder configuration: missing \'gatewayJwt\' property')
      return
    }
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

  async search (pattern, options = {}) {
    // helper function to the query filter
    const buildFilter = (geocoderType, options) => {
      const sources = (options.geocoders ?? [])
        .flatMap(g => g.type.includes(geocoderType) ? [g.value] : [])
      const parts = []
      if (sources.length > 0) parts.push(`sources=*(${sources.join('|')})`)
      if (geocoderType === 'forward' && options.viewbox) parts.push(`viewbox=${options.viewbox.join(',')}`)
      parts.push(`limit=${options.limit || 20}`)
      return parts.map(p => `&${p}`).join('')
    }
    // helper function to return the results
    const formatResults = (result, formatFn) => ({
      ..._.pick(result, ['type', 'geometry']),
      properties: {
        name: formatFn(result),
        source: result.geokoder.source
      }
    })
    //
    const coordinates = parseCoordinates(pattern)
    if (coordinates) {
      const { latitude, longitude } = coordinates
      const filter = buildFilter('reverse', options)
      const results = await this.query('reverse', `lat=${latitude}&lon=${longitude}${filter}`)
      return [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [longitude, latitude] },
          properties: { name: formatUserCoordinates(latitude, longitude, Store.get('locationFormat', 'FFf')) }
        },
        ...results.map(r => formatResults(r, formatReverseGeocodingResult))
      ]
    }
    const filter = buildFilter('forward', options)
    const results = await this.query('forward', `q=${pattern}${filter}`)
    return results.map(r => formatResults(r, formatForwardGeocodingResult))
  }
}
