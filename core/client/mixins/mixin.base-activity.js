import _ from 'lodash'
import { Layout } from '../layout'

export default function (name) {
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
        this.$store.patch('topPane', { content: Layout.bindContent(content, this), mode: Layout.validateMode(content, mode), filter })
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
        this.$store.patch('leftPane', { content: Layout.bindContent(content, this), mode: Layout.validateMode(content, mode), filter })
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
        this.$store.patch('bottomPane', { content: Layout.bindContent(content, this), mode: Layout.validateMode(content, mode), filter })
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
        this.$store.patch('rightPane', { content: Layout.bindContent(content, this), mode: Layout.validateMode(content, mode), filter })
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
      setPage (content, mode, filter) {
        this.$store.patch('page', { content: Layout.bindContent(content, this), mode: Layout.validateMode(content, mode), filter })
      },
      setPageMode (mode) {
        if (mode !== this.getPageMode()) {
          const content = this.$store.get('page.content')
          this.$store.patch('page', { mode: Layout.validateMode(content, mode) })
        }
      },
      configurePage () {
        const options = _.get(this.activityOptions, 'page')
        if (options) this.setPage(options.content, options.mode, _.get(this.activityOptions, 'page.filter', {}))
        else this.clearPage()
      },
      clearPage () {
        this.$store.patch('page', { content: null, mode: undefined })
      },
      getFab () {
        return this.$store.get('fab')
      },
      setFab (actions, filter) {
        this.$store.patch('fab', { actions: Layout.bindContent(actions, this), filter })
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
        return this.$store.get('window')
      },
      setWindow (widgets, current, filter) {
        this.$store.patch('window', { widgets: Layout.bindContent(widgets, this), current, filter })
      },
      configureWindow () {
        const options = _.get(this.activityOptions, 'window', null)
        if (options) this.setWindow(options.widgets, options.current ? options.current : undefined, _.get(this.activityOptions, 'window.filter', {}))
      },
      clearWindow () {
        this.$store.patch('window', { widgets: null, current: undefined })
      },
      hasOpenWidget () {
        return this.$store.get('window.current')
      },
      isWidgetOpen (widget) {
        const current = this.$store.get('window.current')
        return (current && (current === widget))
      },
      openWidget (widget) {
        const current = this.$store.get('window.current')
        if (current !== widget) {
          const widgets = this.$store.get('window.widgets')
          this.$store.patch('window', { current: widget, widgets })
        }
      },
      closeWidget () {
        const current = this.$store.get('window.current')
        if (current !== '') {
          const widgets = this.$store.get('window.widgets')
          this.$store.patch('window', { current: '', widgets })
        }
      },
      clearActivity () {
        this.clearTopPane()
        this.clearBottomPane()
        this.clearLeftPane()
        this.clearRightPane()
        this.clearPage()
        this.clearFab()
        this.clearWindow()
      },
      configureActivity () {
        this.configureTopPane()
        this.configureLeftPane()
        this.configureBottomPane()
        this.configureRightPane()
        this.configurePage()
        this.configureFab()
        this.configureWindow()
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
      this.$events.$on('user-abilities-changed', this.configureActivity)
    },
    beforeDestroy () {
      this.$events.$off('user-abilities-changed', this.configureActivity)
      // Clear the activity
      this.clearActivity()
    }
  }
}
