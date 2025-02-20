export const service = {
  props: {
    service: {
      type: String,
      default: ''
    }
  },

  methods: {
    getService () {
      const service = this.$api.getService(this.service)
      if (!service) {
        throw new Error('Cannot retrieve target service ' + this.service)
      }
      return service
    }
  }
}
