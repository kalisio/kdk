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
        @update:model-value="onChanged"
        inline
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
    }
  }
}
</script>
