import _ from 'lodash'

const baseActivityMixin = {
  data () {
    return {
      searchQuery: {}
    }
  },
  methods: {
    setTopPane (content, mode = undefined) {
      this.$store.patch('topPane', { content: this.bindHandlers(content), mode: mode })
    },
    setTopPaneMode (mode) {
      const content = this.$store.get('topPane.content')
      this.$store.patch('topPane', { content, mode })
    },
    configureTopPane () {
      const config = this.$config(this.id + '.topPane')
      if (config) this.setTopPane(config.content, config.mode)
    },
    clearTopPane () {
      this.$store.patch('topPane', { content: null, mode: undefined })
    },
    setBottomPane (content, mode = undefined) {
      this.$store.patch('bottomPane', { content: this.bindHandlers(content), mode: mode })
    },
    setBottomPaneMode (mode) {
      const content = this.$store.get('bottomPane.content')
      this.$store.patch('bottomPane', { content, mode })
    },
    configureBottomPane () {
      const config = this.$config(this.id + '.bottomPane')
      if (config) this.setBottomPane(config.content, config.mode)
    },
    clearBottomPane () {
      this.$store.patch('bottomPane', { content: null, mode: undefined })
    },
    setRightPane (content, mode = undefined) {
      this.$store.patch('rightPane', { content: this.bindHandlers(content), mode: mode })
    },
    setRightPaneMode (mode) {
      const content = this.$store.get('rightPane.content')
      this.$store.patch('rightPane', { content, mode })
    },
    configureRightPane () {
      const config = this.$config(this.id + '.rightPane')
      if (config) this.setRightPane(config.content, config.mode)
    },
    clearRightPane () {
      this.$store.patch('rightPane', { content: null, mode: undefined })
    },
    setFab (actions) {
      this.$store.patch('fab', { actions: this.bindHandlers(actions) })
    },
    configureFab () {
      const config = this.$config(this.id + '.fab')
      if (config) this.setFab(config.actions)
    },
    clearFab () {
      this.$store.patch('fab', { actions: null })
    },
    setWindow (widgets, current) {
      this.$store.patch('window', { widgets, current })
    },
    configureWindow () {
      const config = this.$config(this.id + '.window')
      if (config) this.setWindow(config.widgets, config.current ? config.current : undefined)
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
    bindHandlers (content) {
      const components = _.flatMapDeep(content)
      _.forEach(components, (component) => {
        if (component.handler && typeof component.handler === 'object') {
          const handler = component.handler
          if (handler.name) {
            if (handler.params) component.handler = () => this[handler.name](...handler.params)
            else component.handler = (params) => this[handler.name](params)
          }
        }
        // Recursively bind the handlers on the sub content object
        if (component.content) this.bindHandlers(component.content)
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
    // Identify this activity using the route name
    this.id = _.get(this.$router, 'history.current.name', undefined)
    // Register the actions
    this.refreshActivity()
    // Whenever the user abilities are updated, update activity as well
    this.$events.$on('user-abilities-changed', this.refreshActivity)
  },
  beforeDestroy () {
    this.$events.$off('user-abilities-changed', this.refreshActivity)
  }
}

export default baseActivityMixin
