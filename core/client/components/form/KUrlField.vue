<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <a href="model" target="_blank">{{ model }}</a>
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    type="url"
    v-model="model"
    :label="label"
    clearable
    @blur="onChanged"
    @update:model-value="onChanged"
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
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
