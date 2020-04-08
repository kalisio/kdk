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
    setSearchBar (field, services = []) {
      // Patch only activity-specific fields, pattern/items are updated by the search bar
      this.$store.patch('searchBar', { field, services })
    },
    clearSearchBar () {
      // Patch all fields to reset search
      this.$store.patch('searchBar', { field: '', pattern: '', services: [], items: [] })
    },
    setLeftDrawer (component, options) {
      this.$store.patch('leftDrawer', { component: component, options: options })
    },
    clearLeftDrawer () {
      this.$store.patch('leftDrawer', { component: '', content: {} })
    },
    setRightDrawer (component, options) {
      this.$store.patch('rightDrawer', { component: component, options: options })
    },
    clearRightDrawer () {
      this.$store.patch('rightDrawer', { component: '', content: {} })
    },
    clearActivity () {
      this.clearTitle()
      this.clearSearchBar()
      this.clearActions()
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
