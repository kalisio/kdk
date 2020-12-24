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
    setActivityBar (content, mode = '') {
      this.$store.patch('activityBar', { content: content, mode: mode })
    },
    setActivityBarMode (mode) {
      const content = this.$store.get('activityBar.content')
      this.$store.patch('activityBar', { content: content, mode: mode })
    },
    clearActivityBar () {
      this.$store.patch('activityBar', { content: null, mode: '' })
    },
    registerTabAction (action) {
      this.registerAction('tabBar', action)
      this.$store.patch('tabBar', { tabs: this.getActions('tabBar') })
    },
    unregisterTabAction (nameOrId) {
      this.unregisterAction('tabBar', nameOrId)
      this.$store.patch('tabBar', { tabs: this.getActions('tabBar') })
    },
    registerFabAction (action) {
      this.registerAction('fab', action)
      this.$store.patch('fab', { actions: this.getActions('fab') })
    },
    unregisterFabAction (nameOrId) {
      this.unregisterAction('fab', nameOrId)
      this.$store.patch('fab', { actions: this.getActions('fab') })
    },
    registerAction (type, action) {
      action.id = _.kebabCase(action.name)
      action.uid = uid()
      if (!this.actions[type]) this.actions[type] = []
      this.actions[type].push(action)
    },
    unregisterAction (type, nameOrId) {
      // Ensure we convert to the right case when using name
      const id = _.kebabCase(nameOrId)
      if (!this.actions[type]) return
      _.remove(this.actions[type], (action) => (action.id === id) || (action.uid === id))
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
      // Clear tabBar actions
      this.$store.patch('tabBar', { tabs: [] })
      // Clear Fab actions
      this.$store.patch('fab', { actions: [] })
      // Clear the actions
      this.actions = {}
    },
    setTitle (title) {
      this.$store.patch('appBar', { title: title })
    },
    clearTitle () {
      this.$store.patch('appBar', { title: '' })
    },
    setSearchBar (field, services = [], items = []) {
      // Patch only activity-specific fields, pattern/items are updated by the search bar
      this.$store.patch('searchBar', { field, services, items })
    },
    clearSearchBar () {
      // Patch all fields to reset search
      this.$store.patch('searchBar', { field: '', pattern: '', services: [], items: [] })
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
    setFooter (component, props) {
      this.$store.patch('footer', { component, props })
    },
    clearFooter () {
      this.$store.patch('footer', { component: '', props: {} })
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
      this.clearTitle()
      this.clearActivityBar()
      this.clearSearchBar()
      this.clearActions()
      this.clearRightDrawer()
      this.clearFooter()
      this.clearWidgets()
    },
    refreshActivity () {
      // This method should be overriden in activities
      this.clearActivity()
    },
    handleSearch () {
      // Update search query based on activity search config + currently selected pattern/items
      const search = this.$store.get('searchBar')
      const query = {}
      // Handle the pattern
      if (search.pattern !== '') {
        query[search.field] = { $search: search.pattern }
      }
      // Handle the selection
      search.items.forEach(item => {
        // We must have only one item per service
        const queryPath = item.service + '.' + item.field
        query[queryPath] = item[item.field]
      })
      this.searchQuery = Object.assign({}, query)
    }
  },
  created () {
    // Register the actions
    this.refreshActivity()
    // Whenever the user abilities are updated, update activity as well
    this.$events.$on('user-abilities-changed', this.refreshActivity)
    this.$events.$on('search-bar-changed', this.handleSearch)
  },
  beforeDestroy () {
    this.$events.$off('user-abilities-changed', this.refreshActivity)
    this.$events.$off('search-bar-changed', this.handleSearch)
  }
}

export default baseActivityMixin
