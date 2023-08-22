import _ from 'lodash'
import { createQuerablePromise } from '../utils/index.js'

export const objectProxy = {
  props: {
    objectId: {
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
    loadObject () {
      if (!this.objectId) {
        this.object = null
        return Promise.resolve(null)
      }
      // Create a new mixin promise if required
      const objectChanged = (this.getObjectId() !== this.objectId)
      if (!this.objectPromise || objectChanged) {
        this.objectPromise = createQuerablePromise((resolve, reject) => {
          this.getService()
            .get(this.objectId)
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
