import _ from 'lodash'
import logger from 'loglevel'

function validateMode (content, mode) {
  const modes = _.keys(content)
  if (modes.includes(mode)) return mode
  return _.head(modes)
}

export default function (name = undefined) {
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
      setTopPane (content, mode = undefined) {
        this.$store.patch('topPane', { content: this.bindContent(content), mode: validateMode(content, mode) })
      },
      setTopPaneMode (mode) {
        if (mode !== this.getTopPaneMode()) {
          const content = this.$store.get('topPane.content')
          this.$store.patch('topPane', { mode: validateMode(content, mode) })
        }
      },
      configureTopPane () {
        const options = _.get(this.activityOptions, 'topPane', null)
        if (options) this.setTopPane(options.content, options.mode)
        else this.clearTopPane()
      },
      clearTopPane () {
        this.$store.patch('topPane', { content: null, mode: undefined })
      },
      getBottomPane () {
        return this.$store.get('bottomPane')
      },
      getBottomPaneMode () {
        return this.getBottomPane().mode
      },
      setBottomPane (content, mode = undefined) {
        this.$store.patch('bottomPane', { content: this.bindContent(content), mode: validateMode(content, mode) })
      },
      setBottomPaneMode (mode) {
        if (mode !== this.getBottomPaneMode()) {
          const content = this.$store.get('bottomPane.content')
          this.$store.patch('bottomPane', { mode: validateMode(content, mode) })
        }
      },
      configureBottomPane () {
        const options = _.get(this.activityOptions, 'bottomPane', null)
        if (options) this.setBottomPane(options.content, options.mode)
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
      setRightPane (content, mode = undefined) {
        this.$store.patch('rightPane', { content: this.bindContent(content), mode: validateMode(content, mode) })
      },
      setRightPaneMode (mode) {
        if (mode !== this.getRightPaneMode()) {
          const content = this.$store.get('rightPane.content')
          this.$store.patch('rightPane', { mode: validateMode(content, mode) })
        }
      },
      configureRightPane () {
        const options = _.get(this.activityOptions, 'rightPane', null)
        if (options) this.setRightPane(options.content, options.mode)
        else this.clearRightPane()
      },
      clearRightPane () {
        this.$store.patch('rightPane', { content: null, mode: undefined })
      },
      getFab () {
        return this.$store.get('fab')
      },
      setFab (actions) {
        this.$store.patch('fab', { actions: this.bindContent(actions) })
      },
      configureFab () {
        const options = _.get(this.activityOptions, 'fab', null)
        if (options) this.setFab(options.actions)
        else this.clearFab()
      },
      clearFab () {
        this.$store.patch('fab', { actions: null })
      },
      getWindows () {
        return this.$store.get('window')
      },
      setWindow (widgets, current) {
        this.$store.patch('window', { widgets: this.bindContent(widgets), current })
      },
      configureWindow () {
        const options = _.get(this.activityOptions, 'window', null)
        if (options) this.setWindow(options.widgets, options.current ? options.current : undefined)
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
        this.clearRightPane()
        this.clearFab()
        this.clearWindow()
      },
      configureActivity () {
        this.configureTopPane()
        this.configureBottomPane()
        this.configureRightPane()
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
      },
      bindParams (params) {
        // A parameter like :xxx means xxx is a property of the component, not a static value
        return params.map(param => param.startsWith(':') ? _.get(this, param) : param)
      },
      bindHandler (component, path) {
        const handler = _.get(component, path)
        // Could be a structure with name and possibly params specified
        if (handler && typeof handler === 'object') {
          if (handler.name) {
            if (handler.params) _.set(component, path, () => _.get(this, handler.name)(...this.bindParams(handler.params)))
            else _.set(component, path, (...params) => _.get(this, handler.name)(...params))
          } else {
            logger.debug(`Invalid handler binding for ${handler}: you must provide the name to the function to be called`)
          }
        } else if (typeof handler === 'string') { // Or only name if no params are specified
          _.set(component, path, (...params) => _.get(this, handler)(...params))
        }
      },
      bindContent (content) {
        const components = _.flatMapDeep(content)
        _.forEach(components, (component) => {
          // Process component visibility state
          this.bindHandler(component, 'visible')
          // Process component handler
          this.bindHandler(component, 'handler')
          // Process component listener
          this.bindHandler(component, 'on.listener')
          // process component props
          const binding = component.bind ? component.bind : null
          if (binding) component.props = _.get(this, binding)
          // Recursively bind the handlers on the sub content object
          if (component.content) this.bindContent(component.content)
        })
        return content
      }
    },
    beforeCreate () {
      // Identify this activity using its name or the route name
      if (name) this.activityName = name
      else this.activityName = _.camelCase(this.$route.name)
      // Setup the options
      this.activityOptions = this.$config(this.activityName)
    },
    created () {
      // Whenever the user abilities are updated, update activity as well
      this.$events.$on('user-abilities-changed', this.configureActivity)
      // Configure the activity
      this.configureActivity()
    },
    beforeDestroy () {
      this.$events.$off('user-abilities-changed', this.configureActivity)
    }
  }
}
