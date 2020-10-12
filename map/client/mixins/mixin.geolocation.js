import logger from 'loglevel'
import { Store, utils } from '../../../core/client'
import { errors } from '../../common'

export default {
  methods: {
    refreshPosition () {
      // If we are not waiting for or first time
      if (!this.geolocation || !this.geolocation.isPending) {
        // We need to load the position now
        this.geolocation = utils.createQuerablePromise(new Promise((resolve, reject) => {
          if (!window.navigator.geolocation) {
            this.$events.$emit('error', {
              message: this.$t('errors.GEOLOCATION_NOT_SUPPORTED'),
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
      }
      return this.geolocation
    },
    async updatePosition () {
      // Get the position
      try {
        const position = await this.refreshPosition()
        const user = Store.get('user')
        if (user) {
          Store.set('user.position', position)
          Store.unset('user.positionError')
        }
        logger.debug('New user position: ', position)
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
        const user = Store.get('user')
        if (user) {
          Store.set('user.positionError', geolocationError)
        }
        // It seems there is no message when a code is present, however we cannot alter the original error
        // with the new message because it is a read-only property so we refer to it
        this.$events.$emit('error', Object.assign(geolocationError, {
          // By default we only show geolocation errors, nothing if disabled by user
          ignore: (code === error.PERMISSION_DENIED),
          retryHandler: () => this.updatePosition()
        }))
      }
    }
  },
  created () {
    // Whenever the user is updated, update position as well
    this.$events.$on('user-changed', this.updatePosition)
  },
  beforeDestroy () {
    this.$events.$off('user-changed', this.updatePosition)
  }
}
