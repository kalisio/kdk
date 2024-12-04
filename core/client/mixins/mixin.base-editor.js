import logger from 'loglevel'
import _ from 'lodash'

export const baseEditor = {
  emits: ['applied'],
  props: {
    baseObject: {
      type: Object,
      default: () => {}
    },
    baseQuery: {
      type: Object,
      default: () => {}
    },
    schemaName: {
      type: String,
      default: undefined
    },
    perspective: {
      type: String,
      default: ''
    },
    // Indicates if the stored object in-memory is only the perspective part (default)
    // or the full structure, ie { perspective: { xxx } }
    // Note: the full structure is always retrieved/sent from/to the service anyway but sometimes
    // it is easier to manipulate a full-object and edit a nested property seen as a perspective on the front side
    perspectiveAsObject: {
      type: Boolean,
      default: true
    },
    clearButton: {
      type: String,
      default: ''
    },
    resetButton: {
      type: String,
      default: ''
    }
  },
  computed: {
    editorTitle () {
      // Retuns the schema title
      if (this.getSchema()) {
        const schemaTitle = this.getSchema().title
        const objectName = _.get(this.getObject(), 'name')
        return this.$tie(schemaTitle, { name: objectName, interpolation: { escapeValue: false } })
      }
      return ''
    },
    editorMode () {
      return this.objectId ? 'update' : 'create'
    },
    applyButton () {
      return this.editorMode === 'update' ? this.$t('UPDATE') : this.$t('CREATE')
    }
  },
  data () {
    return {
      isFormReady: false,
      applyInProgress: false
    }
  },
  methods: {
    getBaseObject () {
      // Start from default object or input base object
      // This is used to keep track of existing or additional "hidden" or "internal" properties
      // in addition to the ones edited throught the form
      const object = {}
      const baseObject = this.getObject() || this.baseObject
      if (this.perspective !== '') {
        if (this.perspectiveAsObject) {
          Object.assign(object, _.get(baseObject, this.perspective))
        } else {
          _.set(object, this.perspective, _.get(baseObject, this.perspective))
        }
        // Keep track of ID as it is used to know if we update or create
        if (baseObject._id) object._id = baseObject._id
      } else {
        Object.assign(object, baseObject)
      }
      return object
    },
    getBaseQuery () {
      // Start from default query
      const query = {}
      Object.assign(query, this.baseQuery)
      if ((this.editorMode === 'update') && this.perspective && this.perspectiveAsObject) {
        Object.assign(query, { $select: ['_id', this.perspective] })
      }
      return query
    },
    getSchemaName () {
      if (this.schemaName) return this.schemaName
      // Can be provided as route metadata
      let schemaName = _.get(this.$route, 'meta.schemaName')
      if (schemaName) return schemaName
      // When used with a service by default use the same name for schema as for service
      schemaName = this.service + (this.objectId ? '.update' : '.create')
      if (this.perspective) {
        schemaName += ('-' + this.perspective)
      }
      return schemaName
    },
    onFormReferenceCreated (reference) {
      if (reference) {
        this.form = reference
      }
    },
    onFormReady () {
      this.isFormReady = true
      this.fillEditor()
    },
    fillEditor () {
      if (!this.isFormReady) throw new Error('Cannot fill the editor with a non-ready form')
      if (this.getObject()) {
        if (this.perspective !== '') {
          this.form.fill(_.get(this.getObject(), this.perspective))
        } else {
          this.form.fill(this.getObject())
        }
      }
    },
    clearEditor () {
      if (!this.isFormReady) throw new Error('Cannot clear the editor with a non-ready form')
      this.form.clear()
    },
    resetEditor () {
      if (!this.isFormReady) throw new Error('Cannot reset the editor with a non-ready form')
      this.fillEditor()
    },
    async apply () {
      if (!this.getService()) throw new Error('Cannot apply the editor with undefined service')
      if (!this.form) throw new Error('Cannot apply the editor with a non-ready form')
      // Validate the form
      if (!this.form.validate().isValid) return
      // Now the form is validated apply it to the target object
      const object = this.getBaseObject()
      await this.form.apply(object)

      // Small helper to avoid repeating too much similar code
      const onServiceResponse = async (response) => {
        await this.form.submitted(response)
        this.$emit('applied', response)
      }

      const query = this.getBaseQuery(object)
      this.applyInProgress = true
      // Update the item
      try {
        if (this.editorMode === 'update') {
          // Editing mode => patch the item
          if (this.perspective !== '') {
            const data = {}
            if (this.perspectiveAsObject) {
              _.set(data, this.perspective, _.omit(object, ['_id']))
            } else {
              _.set(data, this.perspective, _.get(object, this.perspective))
            }
            const response = await this.getService().patch(this.objectId, data, { query })
            // Keep track of ID as it is used to know if we update or create
            if (object._id) response._id = object._id
            onServiceResponse(response)
          } else {
            const response = await this.getService().patch(this.objectId, object, { query })
            onServiceResponse(response)
          }
        } else if (this.editorMode === 'create') {
          // Creation mode => create the item
          const response = await this.getService().create(object, { query })
          onServiceResponse(response)
        } else {
          logger.warn('[KDK] Invalid editor mode')
        }
      } catch (error) {
        // User error message on operation should be raised by error hook, otherwise this is more a coding error
        logger.error(error)
        return false
      }
      this.applyInProgress = false
      return true
    },
    async refresh () {
      // Clear the form
      this.form = null
      // We can then load the schema/object and local refs in parallel
      await Promise.all([
        this.loadSchema(this.getSchemaName()),
        this.loadObject()
      ])
      // Check if form has been created meanwhile
      if (this.isFormReady) this.fillEditor()
    }
  }
}
