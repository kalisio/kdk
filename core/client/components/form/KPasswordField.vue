<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :type="isPwd ? 'password' : 'text'"
    v-model="model"
    :label="label"
    clearable
    @blur="onChanged"
    :disabled="disabled"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
  >
    <!-- Visibility icon -->
    <template v-slot:append>
      <q-icon
        :id="properties.name + '-field-visibility'"
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwd = !isPwd"
      />
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-input>
</template>

<script>
import { QField, QInput, QIcon } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-password-field',
  mixins: [mixins.baseField],
  data () {
    return {
      isPwd: true
    }
  }
}
</script>
