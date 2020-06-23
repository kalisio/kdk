<template>
  <textarea v-if="readOnly" readonly rows="6" :id="properties.name + '-field'">
    {{ model }}
  </textarea>
  <q-input v-else
    :for="properties.name + '-field'"
    type="textarea"
    v-model="model"
    clearable
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
  name: 'k-textarea-field',
  mixins: [mixins.baseField]
}
</script>
