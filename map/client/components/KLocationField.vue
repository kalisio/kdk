<template>
  <q-field
    :for="properties.name + '-field'"
    :error-message="errorLabel"
    :error="hasError"
    no-error-icon
  >
    <!-- Location input -->
    <k-location-input v-model="model" class="full-width" />
    <!--Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-field>
</template>

<script>
import { mixins as kCoreMixins } from '../../../core/client'

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
