import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { Platform } from '../../core/client/platform.js'
import { Store } from '../../core/client/store.js'

export const Navigator = {

  initialize () {
    // Sets the available apps
    Store.set('navigator.apps', _.defaultsDeep(config.navigator, {
      waze: {
        label: 'waze',
        icon: 'las la-waze',
        url: 'https://waze.com/ul?q=<%= lat %>,<%= lon %>'
      },
      'google-maps': {
        label: 'Google Maps',
        icon: 'las la-google',
        url: 'https://www.google.com/maps/dir/?api=1&destination=<%= lat %>,<%= lon %>'
      },
      'apple-plan': {
        label: 'Apple Plan',
        icon: 'las la-apple',
        url: 'https://maps.apple.com/place?ll=<%= lat %>,<%= lon %>'
      }
    }))
    // Define the default app
    let defaultApp = 'google-maps'
    if (Platform.ios) defaultApp = 'apple-plan'
    if (Platform.android) defaultApp = 'google-maps'
    Store.set('navigator.default', defaultApp)
    logger.debug('[KDK] Navigator initialized with configuration:', Store.get('navigator'))
  },

  getApps () {
    return Store.get('navigator.apps')
  },

  getDefault () {
    return Store.get('navigator.default')
  },

  setDefault (name) {
    Store.set('navigator.default', name)
  },

  navigateTo (lat, lon) {
    // Retrieve the default app
    const defaultApp = this.getDefault()
    if (_.isEmpty(defaultApp)) {
      logger.debug('[KDK] Default navigator is undefined')
      return
    }
    // Retrieve the associated url
    const appUrl = _.get(Store.get('navigator.apps'), `${defaultApp}.url`)
    if (_.isEmpty(appUrl)) {
      logger.debug(`[KDK] Navigator app '${defaultApp}' has an undefined url`)
      return
    }
    // Template the url
    const compiledUrl = _.template(appUrl)
    const interpolatedUrl = compiledUrl({ lat, lon })
    // Open the interpolated url
    window.open(interpolatedUrl)
  }
}
