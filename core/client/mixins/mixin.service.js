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
      return this._service
    },
    getServicePath () {
      return this._service ? this._service.path : ''
    },
    loadService () {
      // Create a new mixin promise if required
      const path = this.$api.getServicePath(this.service, this.contextId)
      const serviceChanged = this.getServicePath() !== path
      if (serviceChanged) {
        this._service = this.$api.service(path)
        if (!this._service) {
          throw new Error('Cannot retrieve target service ' + this.service)
        }
      }
      return this.getService()
    },
    serviceFind (params) {
      return this._service.find(params)
    },
    serviceGet (id, params) {
      return this._service.get(id, params)
    },
    serviceCreate (data, params) {
      return this._service.create(data, params)
    },
    serviceUpdate (id, data, params) {
      return this._service.update(id, data, params)
    },
    servicePatch (id, data, params) {
      return this._service.patch(id, data, params)
    },
    serviceRemove (id, params) {
      return this._service.remove(id, params)
    }
  }
}

export default serviceMixin
