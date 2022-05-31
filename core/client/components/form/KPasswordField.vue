<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :type="isPassword ? 'password' : 'text'"
    v-model="model"
    :label="label"
    clearable
    :disabled="disabled"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
    @blur="onChanged"
    @update:model-value="onChanged"
  >
    <!-- Visibility icon -->
    <template v-slot:append>
      <q-icon
        :id="properties.name + '-field-visibility'"
        :name="isPassword ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPassword = !isPassword"
      />
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-input>
</template>

<script>
import { baseField } from '../../mixins'

export default {
  mixins: [baseField],
  data () {
    return {
      isPassword: true
    }
  }
}
</script>
