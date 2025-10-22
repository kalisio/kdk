<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <div v-html="text" />
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    type="text"
    v-model="model"
    :label="label"
    :input-class="inputClass()"
    clearable
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    :autofocus="hasFocus"
    bottom-slots
    :debounce="debounce"
    @blur="onChanged"
    @update:model-value='onChanged'
  >
    <!-- Helper -->
    <template v-if="hasHelper" v-slot:append>
      <k-action
        :id="properties.name + '-helper'"
        :label="helperLabel"
        :icon="helperIcon"
        :tooltip="helperTooltip"
        :url="helperUrl"
        :dialog="helperDialog"
        :context="helperContext"
        @dialog-confirmed="onHelperDialogConfirmed"
        color="primary"
      />
    </template>
  </q-input>
</template>

<script>
import _ from 'lodash'
import { baseField } from '../../mixins'

export default {
  mixins: [baseField],
  computed: {
    text () {
      if (_.startsWith(this.model, 'http://') || _.startsWith(this.model, 'https://')) {
        return `<a href='${this.model}' target="_blank">${this.model}</a>`
      } else {
        return this.model
      }
    },
    debounce () {
      return _.get(this.properties, 'field.debounce', 0)
    }
  },
  methods: {
    inputClass () {
      return _.get(this.properties, 'field.inputClass', 'text-weight-regular')
    }
  }
}
</script>
