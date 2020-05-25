import _ from 'lodash'
import NodeGeocoder from 'node-geocoder'
import makeDebug from 'debug'

const debug = makeDebug('kdk:map:geocoder:service')

export default function (name, app, options) {
  // Keep track of config
  Object.assign(options, app.get('geocoder'))
  debug('geocoder created with config ', options)
  let geocoders = []
  // Single provider ?
  if (options.providers) {
    geocoders = options.providers.map(geocoderOptions => NodeGeocoder(geocoderOptions))
  } else {
    geocoders.push(NodeGeocoder(options))
  }
  return {
    async geocode (geocoder, address) {
      let results = []
      try {
        results = await geocoder.geocode(address)
      } catch (error) {
        app.logger.error(error)
      }
      return results
    },
    async reverse (geocoder, lon, lat) {
      let results = []
      try {
        results = await geocoder.reverse({ lat, lon })
      } catch (error) {
        app.logger.error(error)
      }
      return results
    },
    async create (data, params) {
      // We limit results to the N best ones from the different providers
      const nbResults = _.get(this, 'paginate.default', 10)
      debug('geocoder service called for create', data)
      const aggregatedResults = await Promise.all(geocoders.map(async geocoder => {
        // We want to wait for all responses ever if some fail
        // FIXME: when definitely available in JS spec should be replaced by Promise.allSettled
        try {
          let results = []
          if (data.address) {
            results = await this.geocode(geocoder, data.address)
          } else if (geocoder.reverse) { // All geocoders cannot do reverse geocoding
            // We support GeoJson feature for reverse geocoding
            const lon = _.get(data, 'lon', _.get(data, 'longitude', _.get(data, 'geometry.coordinates[0]')))
            const lat = _.get(data, 'lat', _.get(data, 'latitude', _.get(data, 'geometry.coordinates[1]')))
            results = await this.reverse(geocoder, lon, lat)
          }
          return { results }
        } catch (error) {
          return { error }
        }
      }))
      const results = []
      let processing = true
      // Iterate to take best results for each provider in same order
      while (processing) {
        const previousCount = results.length
        aggregatedResults.forEach(provider => {
          if (provider.error) {
            app.logger.error(provider.error)
          } else {
            // Take current best result if any
            const bestResultForProvider = provider.results.shift()
            if (bestResultForProvider) results.push(bestResultForProvider)
          }
        })
        // Stop when no more results to be added or pagination exceeded
        if ((previousCount === results.length) || (nbResults <= results.length)) processing = false
      }
      return results.splice(0, nbResults)
    }
  }
}
