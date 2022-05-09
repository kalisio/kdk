export const service = {
  props: {
    contextId: {
      type: String,
      default: undefined
    },
    service: {
      type: String,
      default: ''
    }
  },

  methods: {
    getService () {
      const service = this.$api.getService(this.service, this.contextId)
      if (!service) {
        throw new Error('Cannot retrieve target service ' + this.service)
      }
      return service
    }
  }
}

