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
    clearBottomPane () {
      this.$store.patch('bottomPane', { content: null, mode: undefined })
    },
    setRightDrawer (content, mode = undefined) {
      this.$layout.setRightDrawer(this.bindHandlers(content), mode)
    },
    setRightDrawerMode (mode) {
      this.$layout.setRightDrawer(mode)
    },
    clearRightDrawer () {
      this.$layout.clearRightDrawer()
    },
    setFabActions (actions) {
      this.$store.patch('fab', { actions: this.bindHandlers(actions) })
    },
    clearFabActions () {
      this.$store.patch('fab', { actions: null })
    },
    registerWidget (name, icon, component, props) {
      const widgets = this.$store.get('window.widgets')
      widgets.push({ name, icon, component, props })
      this.$store.patch('window', { widgets: widgets })
    },
    unregisterWidget (name) {
      const current = this.$store.get('window.current')
      const widgets = _.filter(this.$store.get('window.widgets'), { name })
      this.$store.patch('window', { current, widgets })
    },
    clearWidgets () {
      this.$store.patch('window', { current: '', widgets: [] })
    },
    openWidget (widget) {
      const current = this.$store.get('window.current')
      if (current !== widget) {
        const widgets = this.$store.get('window.widgets')
        this.$store.patch('window', { current: widget, widgets })
      }
    },
    hasOpenWidget () {
      const current = this.$store.get('window.current')
      return current
    },
    isWidgetOpen (widget) {
      const current = this.$store.get('window.current')
      return (current && (current === widget))
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
      this.clearRightDrawer()
      this.clearFabActions()
      this.clearWidgets()
    },
    refreshActivity () {
      // This method should be overriden in activities
      this.clearActivity()
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
  created () {
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
