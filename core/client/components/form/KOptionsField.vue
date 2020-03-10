<template>
  <div v-if="readOnly">
    <q-chip dense>
      {{ model }}
    </q-chip>
  </div>
  <q-field v-else
    :error-message="errorLabel"
    :error="hasError"
    :disabled="disabled"
    no-error-icon
    bottom-slots
  >
    <q-option-group
      :id="properties.name + '-field'"
      v-bind="properties.field"
      v-model="model"
      @change="onChanged"
      @blur="onChanged" />

    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-field>
</template>

<script>
import _ from 'lodash'
import { QField, QOptionGroup } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-options-field',
  components: {
    QField,
    QOptionGroup
  },
  mixins: [mixins.baseField],
  methods: {
    emptyModel () {
      const type = _.get(this.properties.field, 'type', 'radio')
      if (type === 'radio') return ''
      return []
    }
  }
}
</script>
