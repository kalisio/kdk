import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { getFingerprint, getFingerprintData } from '@thumbmarkjs/thumbmarkjs'
import { Platform as QPlatform } from 'quasar'
import { getLocale } from './utils/utils.locale.js'

export const Platform = {
  async initialize () {
    // use Quasar platform data
    _.merge(this, _.omit(QPlatform, ['install', '__installed']))
    // use fingerprint data
    this.fingerprint = await getFingerprint()
    this.fingerprintData = await getFingerprintData()
    // use locale
    this.locale = getLocale()
    // use build data
    this.is.pwa = _.get(config, 'buildMode', 'spa') === 'pwa'
    logger.debug('[KDK] Platform initialized with:', this)
  },
  getData () {
    return {
      userAgent: this.userAgent,
      application: {
        mode: this.is.pwa ? 'PWA' : 'SPA',
        iframe: this.within.iframe,
        permissions: _.get(this.fingerprintData, 'permissions')
      },
      browser: Object.assign({},
        _.get(this.fingerprintData, 'system.browser'),
        { locale: _.get(this.fingerprintData, 'locales') },
        { webgl: _.get(this.fingerprintData, 'hardware.videocard') }
      ),
      system: {
        os: _.get(this.fingerprintData, 'system.platform'),
        desktop: this.is.desktop || false,
        mobile: this.is.mobile || false,
        touch: this.is.touch || false
      }
    }
  }
}
