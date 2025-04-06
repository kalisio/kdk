<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ formattedDateTimeRange }}
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
      <KDateTimeRange
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
import KDateTimeRange from '../time/KDateTimeRange.vue'

export default {
  mixins: [baseField],
  components: {
    KAction,
    KDateTimeRange
  },
  computed: {
    formattedDateTimeRange () {
      // TODO
      return this.model
    },
    props () {
      return _.omit(_.get(this.properties, 'field'), ['component', 'dense'])
    }
  }
}
</script>
