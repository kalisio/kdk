import _ from 'lodash'
import logger from 'loglevel'
import { Layout } from '../layout.js'

export function baseActivity (name) {
  return {
    methods: {
      getAppName () {
        return this.$config('appName')
      },
      getTopPane () {
        return Layout.getPane('top')
      },
      getTopPaneMode () {
        return Layout.getPane('top').mode
      },
      isTopPaneVisible () {
        return Layout.getPane('top').visible
      },
      setTopPane (content, mode, filter) {
        Layout.setPane('top', { content, mode, filter }, this)
      },
      setTopPaneMode (mode) {
        Layout.setPaneMode('top', mode)
      },
      setTopPaneVisible (visible) {
        Layout.setPaneVisible('top', visible)
      },
      configureTopPane () {
        Layout.setPane('top', _.get(this.activityOptions, 'topPane'), this)
      },
      clearTopPane () {
        Layout.setPane('top', null)
      },
      getLeftPane () {
        return Layout.getPane('left')
      },
      getLeftPaneMode () {
        return Layout.getPane('left').mode
      },
      isLeftPaneVisible () {
        return Layout.getPane('left').visible
      },
      setLeftPane (content, mode, filter) {
        Layout.setPane('left', { content, mode, filter }, this)
      },
      setLeftPaneMode (mode) {
        Layout.setPaneMode('left', mode)
      },
      setLeftPaneVisible (visible) {
        Layout.setPaneVisible('left', visible)
      },
      configureLeftPane () {
        Layout.setPane('left', _.get(this.activityOptions, 'leftPane'), this)
      },
      clearLeftPane () {
        Layout.setPane('left', null)
      },
      getBottomPane () {
        return Layout.getPane('bottom')
      },
      getBottomPaneMode () {
        return Layout.getPane('bottom').mode
      },
      isBottomPaneVisible () {
        return Layout.getPane('bottom').visible
      },
      setBottomPane (content, mode, filter) {
        Layout.setPane('bottom', { content, mode, filter }, this)
      },
      setBottomPaneMode (mode) {
        Layout.setPaneMode('bottom', mode)
      },
      setBottomPaneVisible (visible) {
        Layout.setPaneMode('bottom', visible)
      },
      configureBottomPane () {
        Layout.setPane('bottom', _.get(this.activityOptions, 'bottomPane'), this)
      },
      clearBottomPane () {
        Layout.setPane('bottom', null)
      },
      getRightPane () {
        return Layout.getPane('right')
      },
      getRightPaneMode () {
        return this.getRightPane().mode
      },
      isRightPaneVisible () {
        return this.getRightPane().visible
      },
      setRightPane (content, mode, filter) {
        Layout.setPane('right', { content, mode, filter }, this)
      },
      setRightPaneMode (mode) {
        Layout.setPaneMode('right', mode)
      },
      setRightPaneVisible (visible) {
        Layout.setPaneMode('right', visible)
      },
      configureRightPane () {
        Layout.setPane('right', _.get(this.activityOptions, 'rightPane'), this)
      },
      clearRightPane () {
        Layout.setPane('right', null)
      },
      getPage () {
        return Layout.getPage()
      },
      setPage (content, mode, filter, sticky) {
        Layout.setPage({ content, mode, filter, sticky }, this)
      },
      setPageMode (mode) {
        Layout.setPageMode(mode)
      },
      configurePage () {
        Layout.setPage(_.get(this.activityOptions, 'page'), this)
      },
      clearPage () {
        Layout.setPage(null)
      },
      getFab () {
        return Layout.getFab()
      },
      setFab (content, mode, filter) {
        Layout.setFab({ content, mode, filter }, this)
      },
      configureFab () {
        Layout.setFab(_.get(this.activityOptions, 'fab'), this)
      },
      clearFab () {
        Layout.setFab(null)
      },
      configureWindows () {
        const windows = _.get(this.activityOptions, 'windows', null)
        _.forOwn(windows, (window, placement) => {
          Layout.setWindow(placement, window, this)
        })
      },
      clearWindows () {
        const windows = _.get(this.activityOptions, 'windows', null)
        _.forOwn(windows, (window, placement) => {
          Layout.setWindow(placement, null)
        })
      },
      openWindow (placement) {
        Layout.setWindowVisible(placement, true)
      },
      closeWindow (placement) {
        Layout.setWindowVisible(placement, false)
      },
      findWindow (widget) {
        return Layout.findWindow(widget)
      },
      isWidgetWindowVisible (widget) {
        const { window } = this.findWindow(widget)
        return (window && window.visible)
      },
      openWidget (widget) {
        const { placement, window } = this.findWindow(widget)
        if (!placement) {
          logger.warn(`[KDK] Cannot find widget ${widget}`)
          return
        }
        if (window.current !== widget) Layout.setWindowCurrent(placement, widget)
        Layout.setWindowVisible(placement, true)
      },
      closeWidget (widget) {
        const result = this.findWindow(widget)
        if (!result.placement) {
          logger.warn(`Cannot find widget ${widget}`)
          return
        }
        Layout.setWindowVisible(result.placement, false)
      },
      clearActivity () {
        this.clearTopPane()
        this.clearBottomPane()
        this.clearLeftPane()
        this.clearRightPane()
        this.clearPage()
        this.clearFab()
        this.clearWindows()
      },
      configureActivity () {
        this.configureTopPane()
        this.configureLeftPane()
        this.configureBottomPane()
        this.configureRightPane()
        this.configurePage()
        this.configureFab()
        this.configureWindows()
      },
      goBack () {
        this.$router.back()
      },
      refresh () {
        window.location.reload()
      },
      launchTour (name) {
        // If no name we extract tour name from route name
        if (!name) {
          const routeName = this.$route.name
          let tourName = routeName
          // Manage routes with different pages
          if (_.has(this.$route, 'params.page')) {
            tourName += '/' + _.get(this.$route, 'params.page')
          }
          name = tourName
        }
        this.$store.patch('tours.current', { name })
      }
    },
    beforeCreate () {
      // Identify this activity using its name or the route name
      this.activityName = name || _.camelCase(this.$options.name)
      // Setup the options
      this.activityOptions = this.$config(this.activityName)
    },
    mounted () {
      // Configure the activity
      this.configureActivity()
      // Whenever the user abilities are updated, update activity as well
      this.$events.on('user-abilities-changed', this.configureActivity)
    },
    beforeUnmount () {
      this.$events.off('user-abilities-changed', this.configureActivity)
      // Clear the activity
      this.clearActivity()
    }
  }
}
