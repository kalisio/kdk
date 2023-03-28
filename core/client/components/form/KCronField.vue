<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    type="text"
    v-model="model"
    :label="label"
    clearable
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    :rules="validationRules"
    bottom-slots
    @blur="onChanged"
    @update:model-value='onChanged'
  >
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-input>
</template>

<script>
import { baseField } from '../../mixins'

export default {
  mixins: [baseField],
  computed: {
    validationRules () {
      // regexp from https://regexr.com/4jp54
      const cronRegExp = /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/g
      return [
        (value) => cronRegExp.test(value) || 'Invalid CRON expression'
      ]
    }
  }
}
</script>
