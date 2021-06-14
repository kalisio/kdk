<template>
  <q-field
    :for="properties.name + '-field'"
    :value="model"
    :label="label"
    :error-message="errorLabel"
    :error="hasError"
    no-error-icon
  >
    <!-- Content -->
    <template v-slot:default>
      <k-location-input v-model="model" v-bind="properties.field" class="full-width" />
    </template>
    <!--Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-field>
</template>

<script>
import { mixins as kCoreMixins } from '../../../../core/client'

export default {
  name: 'k-location-field',
  mixins: [kCoreMixins.baseField],
  methods: {
    emptyModel () {
      return null
    },
    fill (value) {
      this.model = value
    }
  },
  created () {
    // load the required components
    this.$options.components['k-location-input'] = this.$load('KLocationInput')
  }
}
</script>
