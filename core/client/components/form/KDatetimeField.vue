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
        v-bind="props"
        dense
        @update:modelValue="onChanged"
      />
    </template>
    <!-- Helper -->
    <template v-if="hasHelper" v-slot:append>
      <KAction
        :id="properties.name + '-helper'"
        :label="helperLabel"
        :icon="helperIcon"
        :tooltip="helperTooltip"
        :url="helperUrl"
        :dialog="helperDialog"
        :context="helperContext"
        @dialog-confirmed="onHelperDialogConfirmed"
        color="primary"
      />
    </template>
  </q-field>
</template>

<script>
import _ from 'lodash'
import { baseField } from '../../mixins'
import KAction from '../action/KAction.vue'
import KDateTime from '../time/KDateTime.vue'

export default {
  mixins: [baseField],
  components: {
    KAction,
    KDateTime
  },
  computed: {
    formattedDateTime () {
      return this.model
    },
    props () {
      return _.omit(_.get(this.properties, 'field'), ['component', 'dense'])
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
