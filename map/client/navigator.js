import _ from 'lodash'
import logger from 'loglevel'
import { Store, Platform, LocalStorage } from '../../core/client/index.js'

export const Navigator = {
  initialize () {
    this.availableApps = {
      waze: 'https://waze.com/ul?q=<%= lat %>,<%= lon %>',
      'google-maps': 'https://www.google.com/maps/dir/?api=1&destination=<%= lat %>,<%= lon %>',
      'apple-plan': 'https://maps.apple.com/place?ll=<%= lat %>,<%= lon %>'
    }
    const settings = LocalStorage.get('settings')
    if (_.isNil(settings)) {
      let app = 'google-maps'
      if (Platform.ios) app = 'apple-plan'
      Store.set('navigator', app)
      logger.debug('[KDK] Navigator initialized to:', this.get())
    } else {
      logger.debug('[KDK] Navigator initialized to:', settings.navigator)
    }
  },
  get () {
    return Store.get('navigator')
  },
  navigateTo (lat, lon) {
    // Retrieve the default app
    const app = this.get()
    if (_.isEmpty(app)) {
      logger.debug('[KDK] Default navigator is undefined')
      return
    }
    // Template the url
    const compiledUrl = _.template(this.availableApps[app])
    const interpolatedUrl = compiledUrl({ lat, lon })
    // Open the interpolated url
    window.open(interpolatedUrl)
  }
}
