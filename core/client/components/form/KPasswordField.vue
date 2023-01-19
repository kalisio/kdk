<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :type="showPassword ? 'password' : 'text'"
    v-model="model"
    :label="label"
    clearable
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
    @blur="onChanged"
    @update:model-value="onChanged"
  >
    <!-- Visibility icon -->
    <template v-slot:append>
      <q-icon
        :id="properties.name + '-field-visibility'"
        :name="showPassword ? 'visibility_off' : 'visibility'"
        class="q-pl-md cursor-pointer"
        @click="showPassword = !showPassword"
      />
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-input>
</template>

<script>
import _ from 'lodash'
import { baseField } from '../../mixins'
import generateRandomPassword from 'password-generator'

export default {
  mixins: [baseField],
  data () {
    return {
      showPassword: true
    }
  },
  created () {
    if (_.get(this.properties, 'field.suggest')) {
      const length = _.get(this.properties.field.suggest, 'length', 12)
      const rules = _.get(this.properties.field.suggest, 'rules', /[\w\d?-]/)
      _.set(this.properties, 'default', generateRandomPassword(length, false, rules))
    }
  }
}
</script>
