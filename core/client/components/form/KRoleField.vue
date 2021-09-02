<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip dense  />
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :value="model"
    :label="label"
    @input="onChanged"
    borderless
    :error-message="errorLabel"
    :error="hasError"
    :disabled="disabled"
    bottom-slots
  >
    <!-- Content -->
    <template v-slot:default>
      <q-option-group
        :id="properties.name + '-field'"
        v-model="model"
        :options="roles()"
        inline />
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-field>
</template>

<script>
import mixins from '../../mixins'
import { RoleNames } from '../../../common/permissions'
import { QOptionGroup } from 'quasar'

export default {
  name: 'k-role-field',
  components: {
    QOptionGroup
  },
  mixins: [mixins.baseField],
  methods: {
    roles () {
      return _.map(RoleNames, role => { return { label: this.$t(_.upperCase(role)), value: role } })
    },
    emptyModel () {
      return RoleNames[0]
    },
    isEmpty () {
      // Can't actually be
      return false
    }
  }
}
</script>
