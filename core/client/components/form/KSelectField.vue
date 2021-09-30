<template>
  <div v-if="readOnly">
    <q-chip :id="properties.name + '-field'" dense>
      {{ model }}
    </q-chip>
  </div>
  <q-select v-else
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :multiple="multiple"
    :toggle="toggle"
    :radio="radio"
    :use-chips="chips"
    :options="options"
    @change="onChanged"
    @blur="onChanged"
    @input='onChanged'
    emit-value
    map-options
    :clearable="clearable"
    :error="hasError"
    :error-message="errorLabel"
    :disabled="disabled"
    bottom-slots>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        :id="getId(scope.opt)"
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
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
    clearable () {
      return _.get(this.properties, 'field.clearable', true)
    },
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
    getId (option) {
      let id = option.value
      // Complex object ?
      if (typeof id === 'object') {
        // Extract value property or use label if none
        const valueField = _.get(this.properties, 'field.valueField')
        if (valueField) id = _.get(id, valueField)
        else id = option.label
      } else {
        // Ensure string not eg number
        id = id.toString()
      }
      return _.kebabCase(id)
    },
    emptyModel () {
      const multiple = _.get(this.properties, 'field.multiple', false)
      if (multiple) return []
      return (this.properties.type === 'object' ? {} : '')
    }
  }
}
</script>
