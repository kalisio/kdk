<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <a :href="`tel:${model}`">{{ model }}</a>
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    type="tel"
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
    <!-- Helper -->
    <template v-if="hasHelper" v-slot:append>
      <k-action
        :id="properties.name + '-helper'"
        :label="computedHelperLabel"
        :icon="computedHelperIcon"
        :tooltip="computedHelperTooltip"
        color="primary"
        :handler="onHelperClicked"
      />
    </template>
  </q-input>
</template>

<script>
import { baseField } from '../../mixins'

export default {
  mixins: [baseField]
}
</script>
