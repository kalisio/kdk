import _ from 'lodash'

const baseActivityMixin = {
  data () {
    return {
      title: '',
      actions: {},
      searchQuery: {}
    }
  },
  methods: {
    setTopPane (content, mode = undefined) {
      this.$store.patch('topPane', { content: this.standardizeActions(content), mode: mode })
    },
    setTopPaneMode (mode) {
      const content = this.$store.get('topPane.content')
      this.$store.patch('topPane', { content, mode })
    },
    clearTopPane () {
      this.$store.patch('topPane', { content: null, mode: undefined })
    },
    setBottomPane (content, mode = undefined) {
      this.$store.patch('bottomPane', { content: this.standardizeActions(content), mode: mode })
    },
    setBottomPaneMode (mode) {
      const content = this.$store.get('bottomPane.content')
      this.$store.patch('bottomPane', { content, mode })
    },
    clearBottomPane () {
      this.$store.patch('bottomPane', { content: null, mode: undefined })
    },
    setLeftDrawer (content, mode = undefined) {
      this.$store.patch('leftDrawer', { content: this.standardizeActions(content), mode: mode })
    },
    setLeftDrawerMode (mode) {
      const content = this.$store.get('leftDrawer.content')
      this.$store.patch('leftDrawer', { content, mode })
    },
    clearLeftDrawer () {
      this.$store.patch('leftDrawer', { content: null, mode: undefined })
    },
    setRightDrawer (content, mode = undefined) {
      this.$store.patch('rightDrawer', { content: this.standardizeActions(content), mode: mode })
    },
    setRightDrawerMode (mode) {
      const content = this.$store.get('rightDrawer.content')
      this.$store.patch('rightDrawer', { content, mode })
    },
    clearRightDrawer () {
      this.$store.patch('rightDrawer', { content: null, mode: 'undefined' })
    },
    setFabActions (actions) {
      this.$store.patch('fab', { actions })
    },
    clearFabActions () {
      this.$store.patch('fab', { actions: null })
    },
    getAction (nameOrId, type) {
      // Ensure we convert to the right case when using name
      const id = _.kebabCase(nameOrId)
      const actions = this.getActions(type)
      return _.find(actions, (action) => (action.id === id) || (action.uid === id))
    },
    clearActions () {
      // Clear Fab actions
      this.$store.patch('fab', { actions: [] })
      // Clear the actions
      this.actions = {}
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
    standardizeActions (content) {
      const components = _.flatMapDeep(content)
      _.forEach(components, (component) => {
        if (!component.component || component.component === 'frame/KAction') {
          // Need to build the handler function if the hander is defined as an object
          if (typeof component.handler === 'object') {
            const handler = component.handler
            if (handler.name) {
              if (handler.params) component.handler = () => this[handler.name](...handler.params)
              else component.handler = () => this[handler.name]()
            }
          }
        }
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
