<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    type="number"
    v-model.number="model"
    :label="label"
    clearable
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slot
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
