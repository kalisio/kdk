import _ from "lodash"

const serviceMixin = {
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
      let service = this.$api.getService(this.service, this.contextId)
      if (!service) {
        throw new Error('Cannot retrieve target service ' + this.service)
      }
      return service
    }
  }
}

export default serviceMixin
