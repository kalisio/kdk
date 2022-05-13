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
      <k-location-input id="location-input" v-model="model" v-bind="properties.field" class="full-width" />
    </template>
    <!--Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-field>
</template>

<script>
import { mixins as kCoreMixins } from '../../../../core/client'
import KLocationInput from '../KLocationInput.vue'

export default {
  name: 'k-location-field',
  components: {
    KLocationInput
  },
  mixins: [kCoreMixins.baseField],
  methods: {
    emptyModel () {
      return null
    },
    fill (value) {
      this.model = value
    }
  }
}
</script>
