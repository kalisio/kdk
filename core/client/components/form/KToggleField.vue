<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip dense :icon="model ? 'las la-check' : 'las la-ban'" :color="model ? 'positive' : 'negative'" />
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    borderless
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
  >
    <!-- Control -->
    <template v-slot:control>
      <q-toggle
        :id="properties.name + '-field'"
        v-model="model"
        @blur="onChanged"
      />
    </template>
    <!-- Helper -->
    <template v-if="hasHelper" v-slot:append>
      <k-action
        :id="properties.name + '-helper'"
        :label="computedHelperLabel"
        :icon="computedHelperIcon"
        :tooltip="computedHelperTooltip"
        color="primary"
        :handler="onHelperClicked"
      />
    </template>
  </q-field>
</template>

<script>
import { baseField } from '../../mixins'

export default {
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
