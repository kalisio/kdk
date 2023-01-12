<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ formattedDateTimeRange }}
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
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
      <KDateTimeRange
        v-model="model"
        :options="options"
        dense
        @update:modelValue="onChanged"
      />
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-field>
</template>

<script>
import _ from 'lodash'
import { baseField } from '../../mixins'
import KDateTimeRange from '../time/KDateTimeRange.vue'

export default {
  mixins: [baseField],
  components: {
    KDateTimeRange
  },
  computed: {
    formattedDateTimeRange () {
      // TODO
      return this.model
    },
    options () {
      return _.get(this.properties.field, 'options', {})
    }
  },
  methods: {
    emptyModel () {
      return null
    }
  }
}
</script>
