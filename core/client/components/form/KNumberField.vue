<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    type="number"
    v-model.number="model"
    :label="label"
    clearable
    :disabled="disabled"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slot
    @blur="onChanged"
    @update:model-value="onChanged"
      
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
