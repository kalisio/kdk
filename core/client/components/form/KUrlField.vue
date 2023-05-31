<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <a href="model" target="_blank">{{ model }}</a>
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    type="url"
    v-model="model"
    :label="label"
    clearable
    @blur="onChanged"
    @update:model-value="onChanged"
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
  >
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-input>
</template>

<script>
import { baseField } from '../../mixins'

export default {
  mixins: [baseField]
}
</script>
