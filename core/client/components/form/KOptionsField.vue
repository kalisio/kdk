<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip dense  />
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    :model-value="model"
    :label="label"
    borderless
    hide-bottom-space
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
  >
    <!-- Content -->
    <template v-slot:control>
      <q-option-group
        :id="properties.name + '-field'"
        v-model="model"
        :options="options()"
        :disable="disabled"
        :color="disabled ? 'grey-7' : 'primary'"
        @update:model-value="onChanged"
        inline>
        <template v-slot:label="opt">
          <span :class="model === opt.value ? selectedClass() : 'text-weight-regular'">
            {{ opt.label }}
          </span>
        </template>
      </q-option-group>
    </template>
    <!-- Helper -->
    <template v-if="hasHelper" v-slot:append>
      <k-action
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
import { QOptionGroup } from 'quasar'

export default {
  components: {
    QOptionGroup
  },
  mixins: [baseField],
  methods: {
    options () {
      const options = _.get(this.properties, 'field.options', [])
      return options.map(option => {
        // Check if we have a translation key or directly the label content
        const label = _.get(option, 'label', '')
        return Object.assign({}, option, { label: this.$tie(label) })
      })
    },
    selectedClass () {
      return _.get(this.properties, 'field.selectedClass', 'text-weight-regular')
    }
  }
}
</script>
