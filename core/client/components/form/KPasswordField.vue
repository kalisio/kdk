<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    :type="showPassword ? 'password' : 'text'"
    v-model="model"
    :label="label"
    clearable
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    :autofocus="hasFocus"
    bottom-slots
    :autocomplete="autocomplete"
    @blur="onChanged"
    @update:model-value="onChanged"
  >
    <template v-slot:append>
      <!-- Visibility icon -->
      <q-icon
        :id="properties.name + '-field-visibility'"
        :name="showPassword ? 'visibility_off' : 'visibility'"
        class="q-pl-md cursor-pointer"
        @click="showPassword = !showPassword"
      />
      <!-- Helper -->
      <KAction v-if="hasHelper"
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
import { random } from '@kalisio/common-core/utilities'
import { baseField } from '../../mixins'


export default {
  mixins: [baseField],
  data () {
    return {
      showPassword: true,
      autocomplete: this.properties.field?.autocomplete ?? 'on'
    }
  },
  created () {
    // generate a default password if required
    const suggest = this.properties.field?.suggest
    if (suggest) {
      const { length = 12, digits = 1, specials = 1 } = suggest
      this.properties.default = random.password({ length, digits, specials })
    }
  }
}
</script>
