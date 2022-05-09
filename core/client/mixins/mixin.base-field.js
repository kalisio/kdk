import _ from 'lodash'

export const baseField = {
  props: {
    values: {
      type: Object,
      default: () => { return null }
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
    }
  },
  computed: {
    label () {
      // Check if we have a translation key or directly the label content
      const label = _.get(this.properties.field, 'label', '')
      return (this.$te(label) ? this.$t(label) : label)
    },
    helper () {
      // Check if we have a translation key or directly the helper content
      const helper = _.get(this.properties.field, 'helper', '')
      return (this.$te(helper) ? this.$t(helper) : helper)
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
      return (this.$te(error) ? this.$t(error) : error)
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
      return ''
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
    }
  },
  created () {
    if (this.values) this.updateValue(_.get(this.values, this.properties.name))
  }
}

