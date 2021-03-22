<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <a :href="`tel:${model}`">{{ model }}</a>
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    type="tel"
    v-model="model"
    :label="label"
    clearable
    @blur="onChanged"
    @input="onChanged"    
    :disabled="disabled"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots>
     <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-input>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-phone-field',
  mixins: [mixins.baseField]
}
</script>
