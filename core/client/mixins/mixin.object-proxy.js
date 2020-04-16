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
  data () {
    return {
      object: null
    }
  },
  methods: {
    getObject () {
      return this.object
    },
    getObjectId () {
      return this.object ? this.object._id : ''
    },
    hasPerspective (perspective) {
      return this.object ? this.object[perspective] : false
    },
    loadObject () {
      if (!this.objectId) {
        this.object = null
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
              this.object = object
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
