<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :type="isPwd ? 'password' : 'text'"
    v-model="model"
    clearable
    @blur="onChanged"
    :disabled="disabled"
    :error="hasError"
    :error-message="errorLabel"
    no-error-icon
    bottom-slots
  >
    <template v-slot:append>
      <q-icon
        :id="properties.name + '-field-visibility'"
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwd = !isPwd"
      />
    </template>

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
  components: {
    QField,
    QInput,
    QIcon
  },
  mixins: [mixins.baseField],
  data () {
    return {
      isPwd: true
    }
  }
}
</script>
