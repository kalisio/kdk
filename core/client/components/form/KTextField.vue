<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <div v-html="text" />
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    type="text"
    v-model="model"
    :label="label"
    clearable
    @blur="onChanged"
    @input="onChanged"
    :disabled="disabled"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-input>
</template>

<script>
import _ from 'lodash'
import { baseField } from '../../mixins'

export default {
  name: 'k-text-field',
  mixins: [baseField],
  computed: {
    text () {
      if (_.startsWith(this.model, 'http://') || _.startsWith(this.model, 'https://')) {
        return `<a href='${this.model}' target="_blank">${this.model}</a>`
      } else {
        return this.model
      }
    }
  }
}
</script>
