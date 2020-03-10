import { createQuerablePromise } from '../utils'

const objectProxyMixin = {
  props: {
    objectId: {
      type: String,
      default: ''
    },
    perspective: {
      type: String,
      default: ''
    }
  },
  methods: {
    getObject () {
      return this._object
    },
    getObjectId () {
      return this._object ? this._object._id : ''
    },
    hasPerspective (perspective) {
      return this._object ? this._object[perspective] : false
    },
    loadObject () {
      if (!this.objectId) {
        this._object = null
        return Promise.resolve(null)
      }
      // Create a new mixin promise if required
      const objectChanged = (this.getObjectId() !== this.objectId) || !this.hasPerspective(this.perspective)
      if (!this.objectPromise || objectChanged) {
        this.objectPromise = createQuerablePromise((resolve, reject) => {
          let params = {}
          if (this.perspective) {
            params = { query: { $select: ['_id', this.perspective] } }
          }
          this.loadService()
            .get(this.objectId, params)
            .then(object => {
              this._object = object
              resolve(object)
            })
            .catch(error => {
              reject(error)
            })
        })
      }
      return this.objectPromise
    }
  }
}

export default objectProxyMixin
