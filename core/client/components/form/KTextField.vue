<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
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
import mixins from '../../mixins'

export default {
  name: 'k-text-field',
  mixins: [mixins.baseField]
}
</script>
