import _ from 'lodash'
import logger from 'loglevel'

export default function (name = undefined) {
  return {
    data () {
      return {
        // TODO is it still needed here ? 
        searchQuery: {}
      }
    },
    methods: {
      setTopPane (content, mode = undefined) {
        this.$store.patch('topPane', { content: this.bindContent(content), mode: mode })
      },
      setTopPaneMode (mode) {
        const content = this.$store.get('topPane.content')
        this.$store.patch('topPane', { content, mode })
      },
      configureTopPane () {
        const options = _.get(this.activityOptions, 'topPane', null)
        if (options) this.setTopPane(options.content, options.mode)
      },
      clearTopPane () {
        this.$store.patch('topPane', { content: null, mode: undefined })
      },
      setBottomPane (content, mode = undefined) {
        this.$store.patch('bottomPane', { content: this.bindContent(content), mode: mode })
      },
      setBottomPaneMode (mode) {
        const content = this.$store.get('bottomPane.content')
        this.$store.patch('bottomPane', { content, mode })
      },
      configureBottomPane () {
        const options = _.get(this.activityOptions, 'bottomPane', null)
        if (options) this.setBottomPane(options.content, options.mode)
      },
      clearBottomPane () {
        this.$store.patch('bottomPane', { content: null, mode: undefined })
      },
      setRightPane (content, mode = undefined) {
        this.$store.patch('rightPane', { content: this.bindContent(content), mode: mode })
      },
      setRightPaneMode (mode) {
        const content = this.$store.get('rightPane.content')
        this.$store.patch('rightPane', { content, mode })
      },
      configureRightPane () {
        const options = _.get(this.activityOptions, 'rightPane', null)
        if (options) this.setRightPane(options.content, options.mode)
      },
      clearRightPane () {
        this.$store.patch('rightPane', { content: null, mode: undefined })
      },
      setFab (actions) {
        this.$store.patch('fab', { actions: this.bindContent(actions) })
      },
      configureFab () {
        const options = _.get(this.activityOptions, 'fab', null)
        if (options) this.setFab(options.actions)
      },
      clearFab () {
        this.$store.patch('fab', { actions: null })
      },
      setWindow (widgets, current) {
        this.$store.patch('window', { widgets, current })
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
      confgureActivity () {
        this.configureTopPane()
        this.configureBottomPane()
        this.configureRightPane()
        this.configureFab()
        this.configureWindow()
      },
      refreshActivity () {
        // This method should be overriden in activities
        this.clearActivity()
        this.confgureActivity()
      },
      back () {
        if (this.origin) this.$router.push(this.origin)
        else this.$router.push({ name: 'home' })
      },
      bindContent (content) {
        const components = _.flatMapDeep(content)
        _.forEach(components, (component) => {
          // process component handler
          const handler = component.handler
          if (handler && typeof handler === 'object') {
            if (handler.name) {
              if (handler.params) component.handler = () => this[handler.name](...handler.params)
              else component.handler = (params) => this[handler.name](params)
            } else {
              logger.debug('invalid handler: you must provide the name to the function')
            }
          }
          // process component listener
          const listener = component.on ? component.on.listener : null
          if (listener && typeof listener === 'object') {
            if (listener.name) {
              if (listener.params) listener.handler = () => this[listener.name](...listener.params)
              else component.listener = (params) => this[listener.name](params)
            } else {
              logger.debug('invalid listener: you must provide the name to the function')
            }
          }
          // Recursively bind the handlers on the sub content object
          if (component.content) this.bindContent(component.content)
        })
        return content
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.origin = from.name ? from : null
      })
    },
    created () {
      // Identify this activity using its name or the route name
      if (name) this.activityName = name
      else this.activityName = _.camelCase(_.get(this.$router, 'history.current.name', undefined))
      // Setup the options
      this.activityOptions = this.$config(this.activityName)
      // Register the actions
      this.refreshActivity()
      // Whenever the user abilities are updated, update activity as well
      this.$events.$on('user-abilities-changed', this.refreshActivity)
    },
    beforeDestroy () {
      this.$events.$off('user-abilities-changed', this.refreshActivity)
    }
  }
}
