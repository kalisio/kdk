export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.openModal()
      // redirect to the parent route when closing
      // see: https://github.com/vuejs/vue-router/issues/216
      if (to.matched.length > 1) {
        vm.$on(['closed'], () => vm.$router.push({
          name: to.matched.slice(-2).shift().name,
          params: to.params,
          query: to.query
        }))
      }
    })
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
    }
  }
}
