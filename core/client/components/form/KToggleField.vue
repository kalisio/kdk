<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip dense :icon="model ? 'las la-check' : 'las la-ban'" :color="model ? 'positive' : 'negative'" />
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :error-message="errorLabel"
    :error="hasError"
    :disabled="disabled"
    no-error-icon
    bottom-slots
  >
    <q-toggle
      :id="properties.name + '-field'"
      v-model="model"
      v-bind="properties.field"
      @blur="onChanged" />
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-field>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-toggle-field',
  mixins: [mixins.baseField],
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
