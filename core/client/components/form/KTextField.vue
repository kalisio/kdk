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
    :disabled="disabled"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
    @blur="onChanged"
    @update:model-value='onChanged'   
  >
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
