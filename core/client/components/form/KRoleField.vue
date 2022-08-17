<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip dense  />
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :model-value="model"
    :label="label"
    borderless
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
    @update:model-value="onChanged"
  >
    <!-- Content -->
    <template v-slot:control>
      <q-option-group
        :id="properties.name + '-field'"
        v-model="model"
        :options="roles()"
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
import { RoleNames } from '../../../common/permissions'
import { QOptionGroup } from 'quasar'

export default {
  components: {
    QOptionGroup
  },
  mixins: [baseField],
  methods: {
    roles () {
      return this.roleNames ? _.map(this.roleNames, role => { return { label: this.$t(_.upperCase(role)), value: role } }) : []
    },
    emptyModel () {
      return this.roleNames ? this.roleNames[0] : ''
    },
    isEmpty () {
      // Can't actually be
      return false
    }
  },
  created () {
    this.roleNames = _.get(this.properties, 'field.roles', RoleNames)
  }
}
</script>
