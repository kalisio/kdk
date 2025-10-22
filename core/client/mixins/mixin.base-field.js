import _ from 'lodash'
import { openURL } from 'quasar'
import { i18n } from '../i18n.js'

export const baseField = {
  props: {
    values: {
      type: Object,
      default: () => null
    },
    properties: {
      type: Object,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    label () {
      // Make use of 'description' metadata if nothing else is provided
      // cf. https://ajv.js.org/json-schema.html#metadata-keywords
      const description = _.get(this.properties, 'description', '')
      return i18n.tie(_.get(this.properties.field, 'label', description))
    },
    hasHelper () {
      return !_.isEmpty(_.get(this.properties.field, 'helper', {}))
    },
    helperLabel () {
      return _.get(this.properties.field.helper, 'label', null)
    },
    helperIcon () {
      return _.get(this.properties.field.helper, 'icon', undefined)
    },
    helperTooltip () {
      return _.get(this.properties.field.helper, 'tooltip', '')
    },
    helperUrl () {
      return _.get(this.properties.field.helper, 'url', null)
    },
    helperDialog () {
      return _.get(this.properties.field.helper, 'dialog', null)
    },
    helperContext () {
      return _.get(this.properties.field.helper, 'context', null)
    },
    hasFocus () {
      return _.get(this.properties.field, 'focus', false)
    },
    hasError () {
      return !_.isEmpty(this.error)
    },
    errorLabel () {
      // Check for overriden error label
      let error = _.get(this.properties.field, 'errorLabel', '')
      // If not use default validator error messages
      if (!error) error = this.error
      // Else check if we have a translation key or directly the error content
      return i18n.tie(error)
    },
    disabled () {
      return _.get(this.properties.field, 'disabled', false)
    }
  },
  data () {
    return {
      // The model to used for data binding with the field
      model: this.emptyModel(),
      // The error message
      error: ''
    }
  },
  watch: {
    values: function () {
      if (this.values) this.updateValue(_.get(this.values, this.properties.name))
      else this.clear()
    }
  },
  methods: {
    updateValue (value) {
      if (_.isNil(value)) this.clear()
      else this.fill(value)
    },
    emptyModel () {
      return null
    },
    isEmpty () {
      return _.isEqual(this.model, this.emptyModel())
    },
    value () {
      return this.model
    },
    fill (value) {
      this.model = value
      this.error = ''
    },
    clear () {
      this.fill(_.get(this.properties, 'default', this.emptyModel()))
    },
    validate () {
      this.error = ''
    },
    invalidate (error) {
      this.error = error
    },
    async onChanged () {
      // Quasar resets the model to null when clearing but in the schema an empty model might be a different value
      const nullable = _.get(this.properties, 'nullable', false)
      if (_.isNil(this.model) && !nullable) {
        this.clear()
      }
      // Tell the form that this field has a new value.
      // Consequently the form will validate or invalidate the field
      // Warning: This method must be called once the form is mounted
      // We need to force a refresh so that the model is correctly updated by Vuejs
      await this.$nextTick()
      this.$emit('field-changed', this.properties.name, this.model)
    },
    apply (object, field) {
      // To be overloaded if you need to perform specific operations before the form has been submitted
      // By default simply set the current value on the given object field to apply the form
      _.set(object, field, this.value())
    },
    submitted (object, field) {
      // To be overloaded if you need to perform specific operations after the form has been submitted
    },
    onHelperDialogConfirmed (context) {
      if (context.url) openURL(context.url)
    }
  },
  created () {
    if (this.values) this.updateValue(_.get(this.values, this.properties.name))
  }
}
