import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { getFingerprint, getFingerprintData } from '@thumbmarkjs/thumbmarkjs'
import { Platform as QPlatform } from 'quasar'

const Fingerprint = {
  async initialize () {
    this.fingerprint = await getFingerprint()
    const fingerprintData = await getFingerprintData()
    this.permissions = _.get(fingerprintData, 'permissions')
    this.hardware = {
      video: _.get(fingerprintData, 'hardware.videocard'),
      audio: _.get(fingerprintData, 'audio')
    }
    logger.debug('[KDK] Platform initialized:', this)
  }
}

export const Platform = Object.assign(QPlatform, Fingerprint, { pwa: _.get(config, 'buildMode', 'spa') === 'pwa'})