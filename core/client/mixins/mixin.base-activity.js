import _ from 'lodash'
import { uid } from 'quasar'

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
      this.$store.patch('topPane', { content: content, mode: mode })
    },
    clearTopPane () {
      this.$store.patch('topPane', { content: null, mode: '' })
    },
    setBottomPane (content, mode = undefined) {
      this.$store.patch('bottomPane', { content: this.standardizeActions(content), mode: mode })
    },
    setBottomPaneMode (mode) {
      const content = this.$store.get('bottomPane.content')
      this.$store.patch('bottomPane', { content: content, mode: mode })
    },
    clearBottomPane () {
      this.$store.patch('bottomPane', { content: null, mode: '' })
    },
    setLeftDrawer (component, props) {
      this.$store.patch('leftDrawer', { component, props })
    },
    clearLeftDrawer () {
      this.$store.patch('leftDrawer', { component: '', props: {} })
    },
    setRightDrawer (component, props) {
      this.$store.patch('rightDrawer', { component, props })
    },
    clearRightDrawer () {
      this.$store.patch('rightDrawer', { component: '', props: {} })
    },
    registerFabAction (action) {
      this.registerAction('fab', action)
      this.$store.patch('fab', { actions: this.getActions('fab') })
    },
    registerAction (type, action) {
      action.id = _.kebabCase(action.name)
      action.uid = uid()
      if (!this.actions[type]) this.actions[type] = []
      this.actions[type].push(action)
    },
    getActions (type) {
      return this.actions[type] || []
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
      this.clearWidgets()
      this.clearActions()
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
