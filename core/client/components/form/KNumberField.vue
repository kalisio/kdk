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
        :label="helperLabel"
        :icon="helperIcon"
        :tooltip="helperTooltip"
        :url="helperUrl"
        :dialog="helperDialog"
        :context="helperContext"
        @dialog-confirmed="onHelperDialogConfirmed"
        color="primary"
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
