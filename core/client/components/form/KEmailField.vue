<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <a :href="`mailto:${model}`">{{ model }}</a>
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    type="email"
    v-model="model"
    :label="label"
    clearable
    @blur="onChanged"
    @input="onChanged"
    :disabled="disabled"
    :error="hasError"
    :error-message="errorLabel"
    no-error-icon
    bottom-slots
  >
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-input>
</template>

<script>
import { QField, QInput } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-email-field',
  components: {
    QField,
    QInput
  },
  mixins: [mixins.baseField]
}
</script>
