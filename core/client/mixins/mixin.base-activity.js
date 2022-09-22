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
        return this.$store.get('topPane')
      },
      getTopPaneMode () {
        return this.getTopPane().mode
      },
      isTopPaneVisible () {
        return this.getTopPane().visible
      },
      setTopPane (content, mode, filter) {
        this.$store.patch('topPane', { content: Layout.bindContent(_.cloneDeep(content), this), mode: Layout.validateMode(content, mode), filter })
      },
      setTopPaneMode (mode) {
        if (mode !== this.getTopPaneMode()) {
          const content = this.$store.get('topPane.content')
          this.$store.patch('topPane', { mode: Layout.validateMode(content, mode) })
        }
      },
      setTopPaneVisible (visible) {
        if (this.isTopPaneVisible() !== visible) this.$store.patch('topPane', { visible })
      },
      configureTopPane () {
        const options = _.get(this.activityOptions, 'topPane')
        if (options) this.setTopPane(options.content, options.mode, _.get(this.activityOptions, 'topPane.filter', {}))
        else this.clearTopPane()
      },
      clearTopPane () {
        this.$store.patch('topPane', { content: null, mode: undefined })
      },
      getLeftPane () {
        return this.$store.get('leftPane')
      },
      getLeftPaneMode () {
        return this.getLeftPane().mode
      },
      isLeftPaneVisible () {
        return this.getLeftPane().visible
      },
      setLeftPane (content, mode, filter) {
        this.$store.patch('leftPane', { content: Layout.bindContent(_.cloneDeep(content), this), mode: Layout.validateMode(content, mode), filter })
      },
      setLeftPaneMode (mode) {
        if (mode !== this.getLeftPaneMode()) {
          const content = this.$store.get('leftPane.content')
          this.$store.patch('leftPane', { mode: Layout.validateMode(content, mode) })
        }
      },
      setLeftPaneVisible (visible) {
        if (this.isLeftPaneVisible() !== visible) this.$store.patch('leftPane', { visible })
      },
      configureLeftPane () {
        const options = _.get(this.activityOptions, 'leftPane')
        if (options) this.setLeftPane(options.content, options.mode, _.get(this.activityOptions, 'leftPane.filter', {}))
        else this.clearLeftPane()
      },
      clearLeftPane () {
        this.$store.patch('leftPane', { content: null, mode: undefined })
      },
      getBottomPane () {
        return this.$store.get('bottomPane')
      },
      getBottomPaneMode () {
        return this.getBottomPane().mode
      },
      isBottomPaneVisible () {
        return this.getBottomPane().visible
      },
      setBottomPane (content, mode, filter) {
        this.$store.patch('bottomPane', { content: Layout.bindContent(_.cloneDeep(content), this), mode: Layout.validateMode(content, mode), filter })
      },
      setBottomPaneMode (mode) {
        if (mode !== this.getBottomPaneMode()) {
          const content = this.$store.get('bottomPane.content')
          this.$store.patch('bottomPane', { mode: Layout.validateMode(content, mode) })
        }
      },
      setBottomPaneVisible (visible) {
        if (this.isBottomPaneVisible() !== visible) this.$store.patch('bottomPane', { visible })
      },
      configureBottomPane () {
        const options = _.get(this.activityOptions, 'bottomPane')
        if (options) this.setBottomPane(options.content, options.mode, _.get(this.activityOptions, 'bottomPane.filter', {}))
        else this.clearBottomPane()
      },
      clearBottomPane () {
        this.$store.patch('bottomPane', { content: null, mode: undefined })
      },
      getRightPane () {
        return this.$store.get('bottomPane')
      },
      getRightPaneMode () {
        return this.getRightPane().mode
      },
      isRightPaneVisible () {
        return this.getRightPane().visible
      },
      setRightPane (content, mode, filter) {
        this.$store.patch('rightPane', { content: Layout.bindContent(_.cloneDeep(content), this), mode: Layout.validateMode(content, mode), filter })
      },
      setRightPaneMode (mode) {
        if (mode !== this.getRightPaneMode()) {
          const content = this.$store.get('rightPane.content')
          this.$store.patch('rightPane', { mode: Layout.validateMode(content, mode) })
        }
      },
      setRightPaneVisible (visible) {
        if (this.isRightPaneVisible() !== visible) this.$store.patch('rightPane', { visible })
      },
      configureRightPane () {
        const options = _.get(this.activityOptions, 'rightPane')
        if (options) this.setRightPane(options.content, options.mode, _.get(this.activityOptions, 'rightPane.filter', {}))
        else this.clearRightPane()
      },
      clearRightPane () {
        this.$store.patch('rightPane', { content: null, mode: undefined })
      },
      getPage () {
        return this.$store.get('page')
      },
      getPageMode () {
        return this.getPage().mode
      },
      setPage (content, mode, filter, sticky) {
        this.$store.patch('page', { content: Layout.bindContent(_.cloneDeep(content), this), mode: Layout.validateMode(content, mode), filter, sticky })
      },
      setPageMode (mode) {
        if (mode !== this.getPageMode()) {
          const content = this.$store.get('page.content')
          this.$store.patch('page', { mode: Layout.validateMode(content, mode) })
        }
      },
      configurePage () {
        const options = _.get(this.activityOptions, 'page')
        if (options) {
          this.setPage(options.content, options.mode, _.get(this.activityOptions, 'page.filter', {}),
            _.get(this.activityOptions, 'page.sticky'))
        } else this.clearPage()
      },
      clearPage () {
        this.$store.patch('page', { content: null, mode: undefined, sticky: undefined })
      },
      getFab () {
        return this.$store.get('fab')
      },
      setFab (actions, filter) {
        this.$store.patch('fab', { actions: Layout.bindContent(_.cloneDeep(actions), this), filter })
      },
      configureFab () {
        const options = _.get(this.activityOptions, 'fab')
        if (options) this.setFab(options.actions, _.get(this.activityOptions, 'fab.filter', {}))
        else this.clearFab()
      },
      clearFab () {
        this.$store.patch('fab', { actions: null })
      },
      getWindows () {
        return this.$store.get('windows')
      },
      configureWindows () {
        const windows = _.get(this.activityOptions, 'windows', null)
        _.forOwn(windows, (window, placement) => {
          if (window.widgets) {
            this.$store.patch(`windows.${placement}`, { 
              widgets: Layout.bindContent(_.cloneDeep(window.widgets), this), 
              current: window.current, 
              filter: window.filter || {} 
            })
          }
        })
      },
      clearWindows () {
        const windows = _.get(this.activityOptions, 'windows', null)
        _.forOwn(windows, (window, placement) => {
          this.$store.patch(`windows.${placement}`, { widgets: null, current: undefined } )
        })
      },
      openWindow (placement) {
        const window = this.$store.get('windows.${placement}')
        if (window.visible) return
        if (window.widgets.length === 0) {
          logger.error(`No widgets unregistered for ${placement} window`)
          return
        }
        console.log(window.widgets)
        if (window.current === '') this.$store.patch(`windows.${placement}`, { current: window.widgets[0].id })
        this.$store.patch(`windows.${placement}`, { visible: true })
      },
      closeWindow (placement) {
        const window = this.$store.get('windows.${placement}')
        if (!window.visible) return
        if (window.visible) this.$store.patch(`windows.${placement}`, { visible: false })
      },
      findWindow (widget) {
        let window
        let placement
        _.forOwn(this.$store.get('windows'), (value, key) => {
          if (_.find(value.widgets, { id: widget })) {
            placement = key
            window = value
            return false
          }
        })
        return { placement, window }
      },
      openWidget (widget) {
        const { placement, window } = this.findWindow(widget)
        if (!placement) {
          logger.error(`Cannot find widget ${widget}`)
          return
        }
        if (window.current !== widget) this.$store.patch(`windows.${placement}`, { current: widget })
        if (!window.visible) this.$store.patch(`windows.${placement}`, { visible: true })
      },
      closeWidget (widget) {
        const { placement, window } = this.findWindow(widget)
        if (!placement) {
          logger.error(`Cannot find widget ${widget}`)
          return
        }
        if (window.visible) this.$store.patch(`windows.${placement}`, { visible: false })
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
