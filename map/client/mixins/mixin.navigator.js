import logger from 'loglevel'
import { ActionSheet } from 'quasar'

export default {
  methods: {
    canNavigate () {
      if (!this.$q.platform.is.cordova) return false
      return window.navigationApps.length > 0
    },
    navigate (longitude, latitude) {
      if (this.$q.platform.is.cordova) {
        if (window.navigationApps.length > 1) {
          const actions = []
          window.navigationApps.forEach((navApp) => {
            const action = {
              label: window.launchnavigator.getAppDisplayName(navApp),
              handler: () => window.launchnavigator.navigate([latitude, longitude], { app: navApp })
            }
            actions.push(action)
          })
          ActionSheet.create({
            title: this.$t('mixins.navigator.ACTION_SHEET_TITLE'),
            gallery: true,
            actions: actions
          })
        } else if (window.navigationApps.length === 1) {
          window.launchnavigator.navigate([latitude, longitude], { app: window.navigationApps[0] })
        } else {
          logger.warn('Cannot navigate: no navigation app found !')
        }
      }
    }
  }
}
