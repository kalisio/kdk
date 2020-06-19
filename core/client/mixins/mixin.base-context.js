const baseContextMixin = {
  props: {
    contextId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      contextLoaded: false
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshContext()
    }
  },
  methods: {
    clearActions () {
      this.$store.patch('appBar', { toolbar: [], menu: [] })
    },
    // This method could be overriden in app for more dynamic behaviour
    // default one is to get the action list from the configuration and set it in app bar
    getActionsForContext (context) {
      const actions = this.$config('context.actions', [])
      // Update actions to use current context
      actions.forEach(action => { action.route.params.contextId = this.contextId })
      return actions
    },
    clearContext () {
      this.clearActions()
      this.$store.set('context', null)
      this.contextLoaded = false
    },
    updateContextActions (context) {
      const actions = this.getActionsForContext(context)
      this.$store.patch('appBar', { toolbar: actions.toolbar, menu: actions.menu })
    },
    setContext (context) {
      // Set context in store so that contextual services are aware of it
      this.$store.set('context', context)
      this.contextLoaded = true
      this.updateContextActions(context)
    },
    async refreshContext () {
      if (this.contextId) {
        // Context already set ?
        let context = this.$store.get('context')
        if (context && context._id === this.contextId) {
          // Update only actions as they can depend on eg the current route
          this.updateContextActions(context)
          return
        }
        // Otherwise clear so that underlying components will be destroyed
        this.clearContext()
        // Then update the context
        context = await this.service.get(this.contextId)
        this.setContext(context)
      } else {
        this.clearContext()
      }
    }
  },
  created () {
    this.service = this.$api.getService(this.$config('context.service'))
    // Register the context
    this.refreshContext()
  },
  beforeDestroy () {
    this.clearContext()
  }
}

export default baseContextMixin
