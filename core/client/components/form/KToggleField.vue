<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip dense :icon="model ? 'las la-check' : 'las la-ban'" :color="model ? 'positive' : 'negative'" />
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :value="model"
    :label="label"
    borderless
    :error-message="errorLabel"
    :error="hasError"
    :disabled="disabled"
    bottom-slots
  >
    <!-- Content -->
    <template v-slot:default>
      <q-toggle
        :id="properties.name + '-field'"
        v-model="model"
        @blur="onChanged" />
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-field>
</template>

<script>
import { baseField } from '../../mixins'

export default {
  name: 'k-toggle-field',
  mixins: [baseField],
  methods: {
    emptyModel () {
      return false
    },
    isEmpty () {
      // Can't actually be
      return false
    }
  }
}
</script>
