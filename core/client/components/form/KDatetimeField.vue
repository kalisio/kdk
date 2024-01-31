<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ formattedDateTime }}
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
    stack-label
  >
    <!-- Prepend icons -->
    <template v-slot:control>
      <KDateTime
        v-model="model"
        :options="options"
        :min="min"
        :max="max"
        dense
        @update:modelValue="onChanged"
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
import _ from 'lodash'
import { baseField } from '../../mixins'
import KDateTime from '../time/KDateTime.vue'

export default {
  mixins: [baseField],
  components: {
    KDateTime
  },
  computed: {
    formattedDateTime () {
      // TODO
      return this.model
    },
    options () {
      return _.get(this.properties.field, 'options', {})
    },
    min () {
      return _.get(this.properties.field, 'min')
    },
    max () {
      return _.get(this.properties.field, 'max')
    }
  },
  methods: {
    emptyModel () {
      let now = Date.now()
      // ADD given offset in seconds if any
      if (this.properties.field.defaultOffset) {
        now += this.properties.field.defaultOffset * 1000
      }
      return new Date(now).toISOString()
    }
  }
}
</script>
