import logger from 'loglevel'
import _ from 'lodash'

export default function baseEditorMixin (formRefs) {
  return {
    props: {
      baseObject: {
        type: Object,
        default: function () {
          return {}
        }
      },
      baseQuery: {
        type: Object,
        default: function () {
          return {}
        }
      },
      schemaName: {
        type: String,
        default: undefined
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
          return this.$t(schemaTitle, { object: this.getObject(), interpolation: { escapeValue: false } })
        }
        return ''
      }
    },
    data () {
      return {
        applyButton: '',
        applyInProgress: false
      }
    },
    methods: {
      getMode () {
        console.log(this.objectId)
        if (this.objectId) return 'update'
        return 'create'
      },
      // Disabled forms will not be applied
      setFormDisabled (formName, disabled) {
        // Iterate over forms
        formRefs.forEach(name => {
          const form = this.$refs[name]
          if (name === formName) {
            if (form.loadRefs().isFulfilled()) {
              form.isDisabled = disabled
            } else {
              logger.warn(`Trying to disable in the editor a non-ready form named ${name}`)
            }
          }
        })
      },
      fillEditor () {
        // Iterate over forms
        formRefs.forEach(name => {
          const form = this.$refs[name]
          if (form.loadRefs().isFulfilled()) {
            if (this.getObject()) {
              if (this.perspective !== '') {
                form.fill(this.getObject()[this.perspective])
              } else {
                form.fill(this.getObject())
              }
            } else {
              form.clear()
            }
          } else {
            logger.warn(`Trying to fill the editor with a non-ready form named ${name}`)
          }
        })
        // Update button accordingly
        if (this.getMode() === 'update') {
          this.applyButton = this.$t('UPDATE')
        } else {
          this.applyButton = this.$t('CREATE')
        }
      },
      clear () {
        // Iterate over forms
        formRefs.forEach(name => {
          const form = this.$refs[name]
          if (form.loadRefs().isFulfilled()) {
            form.clear()
          } else {
            logger.warn(`Trying to clear the editor with a non-ready form named ${name}`)
          }
        })
      },
      reset () {
        this.fillEditor()
      },
      validateForms () {
        // Iterate over forms for validation
        let isValid = true
        formRefs.forEach(name => {
          const form = this.$refs[name]
          if (form.loadRefs().isFulfilled()) {
            if (!form.isDisabled) {
              const result = form.validate()
              if (!result.isValid) {
                isValid = false
              }
            }
          } else {
            logger.warn(`Trying to apply the editor with a non-ready form named ${name}`)
            isValid = false
          }
        })
        return isValid
      },
      async applyForms (object) {
        // Apply each form
        let isApplied = true
        for (let i = 0; i < formRefs.length; i++) {
          const name = formRefs[i]
          const form = this.$refs[name]
          if (!form.isDisabled) {
            try {
              await form.apply(object)
            } catch (error) {
              isApplied = false
              break
            }
          }
        }
        return isApplied
      },
      async submittedForms (object) {
        // Apply each form
        let isApplied = true
        for (let i = 0; i < formRefs.length; i++) {
          const name = formRefs[i]
          const form = this.$refs[name]
          if (!form.isDisabled) {
            try {
              await form.submitted(object)
            } catch (error) {
              isApplied = false
              break
            }
          }
        }
        return isApplied
      },
      getBaseObject () {
        // Start from default object or input base object
        // This is used to keep track of existing or additional "hidden" or "internal" properties
        // in addition to the ones edited throught the form
        const object = {}
        const baseObject = this.getObject() || this.baseObject
        if (this.perspective !== '') {
          Object.assign(object, _.get(baseObject, this.perspective))
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
        if ((this.getMode() === 'update') && (this.perspective !== '')) {
          Object.assign(query, { $select: ['_id', this.perspective] })
        }
        return query
      },
      getSchemaName () {
        if (this.schemaName) return this.schemaName
        let schemaName = _.get(this.$route, 'meta.schemaName')
        if (schemaName) return schemaName
        // When used with a service by default use the same name for schema as for service
        schemaName = this.service + (this.objectId ? '.update' : '.create')
        if (this.perspective) {
          schemaName += ('-' + this.perspective)
        }
        return schemaName
      },
      async apply () {
        let isValid = this.validateForms()
        // Now the form is validated apply it to the target object
        const object = this.getBaseObject()

        if (isValid) {
          isValid = await this.applyForms(object)
        } else {
          // Stop here if invalid or not applied correctly
          return
        }

        if (this.getService()) {
          // Small helper to avoid repeating too much similar code
          const onServiceResponse = async (response) => {
            await this.submittedForms(response)
            this.$emit('applied', response)
          }

          const query = this.getBaseQuery(object)
          this.applyInProgress = true
          // Update the item
          try {
            if (this.getMode() === 'update') {
              // Editing mode => patch the item
              if (this.perspective !== '') {
                const data = {}
                data[this.perspective] = _.omit(object, ['_id'])
                const response = await this.servicePatch(this.objectId, data, { query })
                // Keep track of ID as it is used to know if we update or create
                if (object._id) response._id = object._id
                onServiceResponse(response)
              } else {
                const response = await this.servicePatch(this.objectId, object, { query })
                onServiceResponse(response)
              }
            } else if (this.getMode() === 'create') {
              // Creation mode => create the item
              const response = await this.serviceCreate(object, { query })
              onServiceResponse(response)
            } else {
              logger.warn('Invalid editor mode')
            }
          } catch (error) {
            // User error message on operation should be raised by error hook, otherwise this is more a coding error
            logger.error(error)
          }
          this.applyInProgress = false
        }
      },
      async refresh () {
        // When the service is available
        await this.loadService()
        // We can then load the schema/object and local refs in parallel
        await Promise.all([
          this.loadSchema(this.getSchemaName()),
          this.loadObject(),
          this.loadRefs()
        ])
        // We finally build the forms then fill it
        await Promise.all(formRefs.map(name => this.$refs[name].build()))
        this.fillEditor()
        this.$emit('editor-ready', this)
      }
    }
  }
}
