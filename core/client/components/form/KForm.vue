<template>
  <div class="column">
    <!-- Non-grouped fields first -->
    <template v-for="field in fields" :key="field.name">
      <slot :name="'before-' + field.name"/>
      <slot :name="field.name">
        <component
          v-if="!field.group"
          :ref="onFieldReferenceCreated"
          :is="field.component"
          :required="field.required"
          :properties="field"
          @field-changed="onFieldChanged"
        />
      </slot>
      <slot :name="'after-' + field.name"/>
    </template>
    <!-- Grouped fields then -->
    <template v-for="group in groups" :key="group">
      <q-expansion-item icon="las la-file-alt" :group="group" :label="$t(group)">
        <q-card>
          <q-card-section>
            <template v-for="field in fields" :key="field.name">
              <slot v-if="field.group === group" :name="'before-' + field.name"/>
              <slot v-if="field.group === group" :name="field.name">
                <component
                  :ref="onFieldReferenceCreated"
                  :is="field.component"
                  :required="field.required"
                  :properties="field"
                  @field-changed="onFieldChanged" />
              </slot>
              <slot v-if="field.group === group" :name="'after-' + field.name"/>
            </template>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import Ajv from 'ajv'
import AjvLocalize from 'ajv-i18n'
import { getLocale, loadComponent } from '../../utils'

// Create the AJV instance
const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  $data: true
})
// Backward compatibility for our old schemas as now AJV supports draft-07 by default
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))

export default {
  emits: [
    'field-changed', 
    'form-ready'
  ],
  props: {
    schema: {
      type: Object,
      default: null
    },
    clearOnCreate: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      fields: [],
      groups: [],
      isReady: false
    }
  },
  watch: {
    schema: {
      immediate: true,
      async handler () {
        await this.refresh()
      }
    }
  },
  methods: {
    getField (name) {
      const field = _.find(this.fields, { name })
      if (field) return field
      logger.error(`Cannot find field ${name}`)
    },
    onFieldReferenceCreated (reference) {
      if (reference) {
        const name = reference.properties.name
        const field = this.getField(name)
        if (field.reference) return
        // Assign the reference
        field.reference = reference
        // clear this field
        if (this.clearOnCreate) field.reference.clear()
        // Check whether the form is ready
        this.nbSetupFields++
        if (this.nbSetupFields === this.nbExpectedFields) {
          logger.debug('Form', this.schema.$id, 'is ready')
          this.isReady = true
          this.$emit('form-ready', this)
        }
      }
    },
    onFieldChanged (field, value) {
      this.$emit('field-changed', field, value)
      // Checks whether the form is valid
      if (!this.validator(this.values())) {
        const locale = getLocale()
        if (AjvLocalize[locale]) {
          AjvLocalize[locale](this.validator.errors)
        }
        // Checks whether the touched field has an error
        const error = this.hasFieldError(field)
        if (error) {
          // Invalidate the field
          this.getField(field).reference.invalidate(error.message)
          return
        }
      }
      // Validate the field
      this.getField(field).reference.validate()
    },
    hasFieldError (field) {
      for (let i = 0; i < this.validator.errors.length; i++) {
        const error = this.validator.errors[i]
        // Check whether the field is required
        if (error.keyword === 'required') {
          if (error.params.missingProperty === field) return error
        } else {
          // Check whether is the field in invalid
          const fieldDataPath = '.' + field
          if (error.dataPath === fieldDataPath) return error
        }
      }
      return null
    },
    buildFields  () {
      // Store build states
      this.nbExpectedFields = Object.keys(this.schema.properties).length
      this.nbSetupFields = 0
      // Build the fields
      // 1- assign a name corresponding to the key to enable a binding between properties and fields
      // 2- assign a component key corresponding to the component path
      // 3- load the component if not previously loaded
      Object.keys(this.schema.properties).forEach(property => {
        const field = this.schema.properties[property]
        // 1- assign a name corresponding to the key to enable a binding between properties and fields
        field.name = property
        // 2 - adds the field to the list of fields to be rendered
        this.fields.push(field)
        if (field.group && !this.groups.includes(field.group)) this.groups.push(field.group)
        // 3- load the component if not previously loaded
        field.component = loadComponent(field.field.component)
        field.reference = null // will be set once te field is rendered through the setupField method
        // 4- Assign whether the field is required or not
        field.required = _.includes(this.schema.required, property)
      })
    },
    async build () {
      if (!this.schema) throw new Error('Cannot build the form without schema')
      logger.debug('Building form', this.schema.$id)
      // Test in cache first
      this.validator = ajv.getSchema(this.schema.$id)
      if (!this.validator) {
        // Otherwise add it
        ajv.addSchema(this.schema, this.schema.$id)
        this.validator = ajv.compile(this.schema)
      }
      return this.buildFields()
    },
    fill (values) {
      if (!this.isReady) throw new Error('Cannot fill the form while not ready')
      logger.debug('Filling form', this.schema.$id, values)
      this.fields.forEach(field => {
        if (_.has(values, field.name)) {
          this.getField(field.name).reference.fill(_.get(values, field.name), values)
        } else {
          // The field has no value, then assign a default one
          this.getField(field.name).reference.clear()
        }
      })
    },
    values () {
      const values = {}
      _.forEach(this.fields, field => {
        if (!field.reference.isEmpty()) values[field.name] = field.reference.value()
      })
      return values
    },
    clear () {
      if (!this.isReady) throw new Error('Cannot clear the form while not ready')
      logger.debug('Clearing form', this.schema.$id)
      _.forEach(this.fields, field => field.reference.clear())
    },
    validate () {
      if (!this.isReady) throw new Error('Cannot validate the form while not ready')
      logger.debug('Validating form', this.schema.$id)
      const result = {
        isValid: false,
        values: this.values()
      }
      // If the validation fails, it iterates though the errors in order
      // to update the validation status of each field
      if (!this.validator(result.values)) {
        const locale = getLocale()
        if (AjvLocalize[locale]) {
          AjvLocalize[locale](this.validator.errors)
        }
        _.forEach(this.fields, field => {
          const error = this.hasFieldError(field.name)
          if (error) {
            field.reference.invalidate(error.message)
          } else {
            field.reference.validate()
          }
        })
        return result
      }
      _.forEach(this.fields, field => field.reference.validate())
      result.isValid = true
      return result
    },
    async apply (object) {
      if (!this.isReady) throw new Error('Cannot apply the form while not ready')
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i]
        await field.reference.apply(object, field.name)
      }
    },
    async submitted (object) {
      if (!this.isReady) throw new Error('Cannot run submitted on the form while not ready')
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i]
        await field.reference.submitted(object, field.name)
      }
    },
    async refresh () {
      // Clears the fomr states
      this.groups = []
      this.fields = []
      this.isReady = false
      // Build the new form if needed
      if (this.schema) await this.build()
    }
  }
}
</script>
