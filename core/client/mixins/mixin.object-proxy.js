import _ from 'lodash'
import { createQuerablePromise } from '../utils.js'

export const objectProxy = {
  props: {
    objectId: {
      type: String,
      default: ''
    },
    perspective: {
      type: String,
      default: ''
    },
    // Indicates if the stored object in-memory is only the perspective part (default)
    // or the full structure, ie { perspective: { xxx = } }
    // Note: the full structure is always retrieved/sent from/to the service anyway but sometimes
    // it is easier to manipulate a full-object and edit a nested property seen as a perspective on the front side
    perspectiveAsObject: {
      type: Boolean,
      default: true
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
      return this.object ? _.has(this.object, perspective) : false
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
          if (this.perspective && this.perspectiveAsObject) {
            params = { query: { $select: ['_id', this.perspective] } }
          }
          this.getService()
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

