import { Store, Events, utils } from '../../core/client/index.js'
import { errors } from '../common/index.js'
import { formatUserCoordinates } from './utils.js'
import logger from 'loglevel'

// Export singleton
export const Geolocation = {
  initialize () {
    Store.set('geolocation', { location: null, error: undefined })
  },
  hasLocation () {
    return Store.get('geolocation.location')
  },
  get () {
    return Store.get('geolocation')
  },
  getLongitude () {
    return Store.get('geolocation.location.geometry.coordinates[0]', 0)
  },
  get longitude () {
    return this.getLongitude()
  },
  getLatitude () {
    return Store.get('geolocation.location.geometry.coordinates[1]', 0)
  },
  get latitude () {
    return this.getLatitude()
  },
  getAltitude () {
    return Store.get('geolocation.location.geometry.coordinates[2]', 0)
  },
  get altitude () {
    return this.getAltitude()
  },
  getGeometry () {
    return Store.get('geolocation.location.geometry')
  },
  get geometry () {
    return this.getGeometry()
  },
  getAccuracy () {
    return Store.get('geolocation.location.properties.accuracy')
  },
  get accuracy () {
    return this.getAccuracy()
  },
  getAltitudeAccuracy () {
    return Store.get('geolocation.location.properties.altitudeAccuracy')
  },
  get altitudeAccuracy () {
    return this.getAltitudeAccuracy()
  },
  async update (params = {}) {
    const refreshParams = _.merge({ timeout: 30000, enableHighAccuracy: true }, params)
    let location = null
    // Get the position
    try {
      location = await this.refresh(refreshParams)
      Store.patch('geolocation', { location, error: undefined })
      logger.debug('[KDK] Geolocation updated:', location)
    } catch (error) {
      const code = error.code
      const geolocationError = new errors.KGeolocationError()
      // Since error codes are not globally available in the geolocation API
      // and we use it for translation create new ones for our own usage
      if (code === error.PERMISSION_DENIED) {
        geolocationError.code = 'GEOLOCATION_PERMISSION_DENIED'
      } else if (code === error.POSITION_UNAVAILABLE) {
        geolocationError.code = 'GEOLOCATION_POSITION_UNAVAILABLE'
      } else if (code === error.TIMEOUT) {
        geolocationError.code = 'GEOLOCATION_POSITION_TIMEOUT'
      } else {
        geolocationError.code = 'GEOLOCATION_ERROR'
      }
      // Store last error so that component not yet initialized can also check for any
      Store.patch('geolocation', { location: null, error: geolocationError })
      // It seems there is no message when a code is present, however we cannot alter the original error
      // with the new message because it is a read-only property so we refer to it
      Events.emit('error', Object.assign(geolocationError, {
        // By default we only show geolocation errors, nothing if disabled by user
        ignore: (code === error.PERMISSION_DENIED),
        retryHandler: () => this.refresh(refreshParams)
      }))
      logger.debug('[KDK] geolocation failed: ', error)
    }
    return location
  },
  async refresh (params = {}) {
    const refreshParams = _.merge({ timeout: 30000, enableHighAccuracy: true }, params)
    this.positionPromise = utils.createQuerablePromise(new Promise((resolve, reject) => {
      if (!window.navigator.geolocation) {
        Events.emit('error', {
          message: 'errors.GEOLOCATION_NOT_SUPPORTED',
          // By default we only show geolocation errors, nothing if unsupported
          ignore: true
        })
        return
      }
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          const longitude = position.coords.longitude
          const latitude = position.coords.latitude
          const altitude = position.coords.altitude
          resolve({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: altitude ? [longitude, latitude, altitude] : [longitude, latitude]
            },
            properties: {
              name: formatUserCoordinates(latitude, longitude, Store.get('locationFormat', 'FFf')),
              accuracy: position.coords.accuracy,
              altitudeAccuracy: position.coords.altitudeAccuracy
            }
          })
        },
        (error) => reject(error), refreshParams)
    }))
    return this.positionPromise
  }
}
