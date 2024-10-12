import { Platform } from 'quasar'
import config from 'config'

export function getPlatform () {
  return Object.assign(Platform.is, {
    touch: Platform.has.touch,
    storage: Platform.has.webStorage,
    iframe: Platform.within.frame,
    agent: Platform.userAgent,
    isPwa: config.buildMode === 'pwa'
  })
}
