import logger from 'loglevel'

export const navigator = {
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
              id: navApp
            }
            actions.push(action)
          })
          this.$q.bottomSheet({
            title: this.$t('mixins.navigator.ACTION_SHEET_TITLE'),
            dark: true,
            grid: true,
            actions: actions
          }).onOk(action => {
            window.launchnavigator.navigate([latitude, longitude], { app: action.id })
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
