import _ from 'lodash'
import config from 'config'
import { Layout } from '../layout.js'

export function baseActivity (name) {
  return {
    methods: {
      getAppName () {
        return config.appName
      },
      configurePadding () {
        if (_.has(this.activityOptions, 'padding')) Layout.setPadding(_.get(this.activityOptions, 'padding'))
      },
      clearPadding () {
        Layout.setPadding(true)
      },
      configureHeader () {
        if (_.has(this.activityOptions, 'header')) Layout.setHeader(_.get(this.activityOptions, 'header'), this)
      },
      clearHeader () {
        Layout.setHeader(null)
      },
      configureFooter () {
        if (_.has(this.activityOptions, 'footer')) Layout.setFooter(_.get(this.activityOptions, 'footer'), this)
      },
      clearFooter () {
        Layout.setFooter(null)
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
        if (_.has(this.activityOptions, 'topPane')) Layout.setPane('top', _.get(this.activityOptions, 'topPane'), this)
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
        if (_.has(this.activityOptions, 'leftPane')) Layout.setPane('left', _.get(this.activityOptions, 'leftPane'), this)
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
        if (_.has(this.activityOptions, 'bottomPane')) Layout.setPane('bottom', _.get(this.activityOptions, 'bottomPane'), this)
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
        if (_.has(this.activityOptions, 'rightPane')) Layout.setPane('right', _.get(this.activityOptions, 'rightPane'), this)
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
        if (_.has(this.activityOptions, 'page')) Layout.setPage(_.get(this.activityOptions, 'page'), this)
      },
      clearPage () {
        Layout.setPage(null)
      },
      getStickies () {
        return Layout.getPage()
      },
      setStickies (content, mode, filter, sticky) {
        Layout.setStickies({ content, mode, filter, sticky }, this)
      },
      setStickiesMode (mode) {
        Layout.setStickiesMode(mode)
      },
      configureStickies () {
        if (_.has(this.activityOptions, 'stickies')) Layout.setStickies(_.get(this.activityOptions, 'stickies'), this)
      },
      clearStickies () {
        Layout.clearStickies()
      },
      getFab () {
        return Layout.getFab()
      },
      setFab (content, mode, filter) {
        Layout.setFab({ content, mode, filter }, this)
      },
      configureFab () {
        if (_.has(this.activityOptions, 'fab')) Layout.setFab(_.get(this.activityOptions, 'fab'), this)
      },
      clearFab () {
        Layout.setFab(null)
      },
      configureWindows () {
        if (!_.has(this.activityOptions, 'windows')) return
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
        Layout.openWidget(widget)
      },
      closeWidget (widget) {
        Layout.closeWidget(widget)
      },
      clearFocus () {
        Layout.clearFocus()
      },
      clearMode () {
        Layout.clearMode()
      },
      clearActivity () {
        this.clearPadding()
        this.clearFocus()
        this.clearHeader()
        this.clearFooter()
        this.clearTopPane()
        this.clearBottomPane()
        this.clearLeftPane()
        this.clearRightPane()
        this.clearPage()
        this.clearStickies()
        this.clearFab()
        this.clearWindows()
        this.clearMode()
      },
      configureActivity () {
        this.configurePadding()
        this.configureHeader()
        this.configureFooter()
        this.configureTopPane()
        this.configureLeftPane()
        this.configureBottomPane()
        this.configureRightPane()
        this.configurePage()
        this.configureStickies()
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
      this.activityOptions = config[this.activityName]
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
