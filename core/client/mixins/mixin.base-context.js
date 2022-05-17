export const baseContext = {
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
    $route (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshContext()
    }
  },
  methods: {
    clearContext () {
      this.$store.set('context', null)
      this.contextLoaded = false
    },
    setContext (context) {
      // Set context in store so that contextual services are aware of it
      this.$store.set('context', context)
      this.contextLoaded = true
    },
    async refreshContext () {
      if (this.contextId) {
        // Context already set ?
        let context = this.$store.get('context')
        if (context && context._id === this.contextId) {
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
  beforeUnmount () {
    this.clearContext()
  }
}
