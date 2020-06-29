<template>
  <div v-if="readOnly">
    <q-chip :id="properties.name + '-field'" dense>
      {{ model }}
    </q-chip>
  </div>
  <q-select v-else
    :id="properties.name + '-field'"
    :multiple="multiple"
    :toggle="toggle"
    :radio="radio"
    :use-chips="chips"
    v-model="model"
    :options="options"
    @change="onChanged"
    @blur="onChanged"
    emit-value
    map-options
    :error="hasError"
    :error-message="errorLabel"
    :disabled="disabled"
    no-error-icon
    bottom-slots
  >
    <template v-if="helper" v-slot:hint>
      {{helper}}
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'

export default {
  name: 'k-select-field',
  mixins: [mixins.baseField],
  computed: {
    multiple () {
      return _.get(this.properties, 'field.multiple', false)
    },
    toggle () {
      return _.get(this.properties, 'field.toggle', false)
    },
    radio () {
      return _.get(this.properties, 'field.radio', false)
    },
    chips () {
      return _.get(this.properties, 'field.chips', false)
    },
    options () {
      const options = _.get(this.properties, 'field.options', [])
      return options.map(option => {
        // Check if we have a translation key or directly the label content
        const label = _.get(option, 'label', '')
        return Object.assign({}, option, { label: (this.$i18n.i18next.exists(label) ? this.$t(label) : label) })
      })
    }
  },
  methods: {
    emptyModel () {
      const multiple = _.get(this.properties, 'field.multiple', false)
      if (multiple) return []
      return (this.properties.type === 'object' ? {} : '')
    }
  }
}
</script>
