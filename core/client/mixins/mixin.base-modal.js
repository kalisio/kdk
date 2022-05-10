export const baseModal = {
  props: {
    routerMode: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isModalOpened: false,
      isModalMaximized: false
    }
  },
  methods: {
    openModal (maximized = false) {
      // Can be overloaded if needed
      this.isModalMaximized = maximized
      this.isModalOpened = true
    },
    closeModal () {
      this.isModalOpened = false
      if (this.routerMode) {
        this.$router.push(this.previousRoute)
      }
    }
  },
  created () {
    if (this.routerMode) {
      this.previousRoute = this.$router.options.history.state.back
      this.openModal()
    }
  }
}
