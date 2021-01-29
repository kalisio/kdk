import { Store, Events, utils } from '../../core/client'
import { errors } from '../common'
import logger from 'loglevel'

// Export singleton
export const Geolocation = {
  initialize () {
    Store.set('geolocation', { position: null, error: undefined })
  },
  get () {
    return Store.get('geolocation')
  },
  getPosition () {
    return Store.get().position
  },
  getError () {
    return Store.get().error
  },
  async update () {
    let position = null
    // Get the position
    try {
      position = await this.refresh()
      Store.patch('user', { position: position, error: undefined })
      logger.debug('geolocation updated: ', position)
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
      Store.patch('geolocation', { position: null, error: geolocationError })
      // It seems there is no message when a code is present, however we cannot alter the original error
      // with the new message because it is a read-only property so we refer to it
      Events.$emit('error', Object.assign(geolocationError, {
        // By default we only show geolocation errors, nothing if disabled by user
        ignore: (code === error.PERMISSION_DENIED),
        retryHandler: () => this.refresh()
      }))
      logger.debug('geolocation failed: ', error)
    }
    return position
  },
  async refresh () {
    this.positionPromise = utils.createQuerablePromise(new Promise((resolve, reject) => {
      if (!window.navigator.geolocation) {
        Events.$emit('error', {
          message: errors.GEOLOCATION_NOT_SUPPORTED,
          // By default we only show geolocation errors, nothing if unsupported
          ignore: true
        })
        return
      }
      window.navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        resolve({ latitude, longitude })
      }, (error) => reject(error), { timeout: 30000, enableHighAccuracy: true })
    }))
    return this.positionPromise
  }
}
