import { api } from '../api.js'

export const service = {
  props: {
    service: {
      type: String,
      default: ''
    }
  },

  methods: {
    getService () {
      const service = api.getService(this.service)
      if (!service) {
        throw new Error('Cannot retrieve target service ' + this.service)
      }
      return service
    }
  }
}
