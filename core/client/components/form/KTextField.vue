<template>
  <div v-if="readOnly">
    {{ model }}
  </div>
  <q-input v-else
    :id="properties.name + '-field'"
    type="text"
    v-model="model"
    clearable
    @blur="onChanged"
    :disabled="disabled"
    :error="hasError"
    :error-message="errorLabel"
    no-error-icon
    bottom-slots
  >
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
