<template>
  <div>
    <div v-if="readOnly" :id="properties.name + '-field'">
      <div class="full-width k-color-field" />
    </div>
    <q-field v-else
      :for="properties.name + '-field'"
      :id="properties.name + '-field'"
      :ref="onReferenceCreated"
      :label="label"
      stack-label
      v-model="model"
      :error-message="errorLabel"
      :error="hasError"
      :disable="disabled"
      :clearable="isClearable()"
      bottom-slots
      @clear="model=''">
      <!-- control -->
      <template v-slot:control>
        <div class="full-width k-color-field" />
        <q-dialog v-model="picker">
          <q-color
            no-header
            format-model="hex"
            v-model="model"
            default-view="palette"
          />
        </q-dialog>
      </template>
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
    </q-field>
  </div>
</template>

<script>
import { baseField } from '../../mixins'

export default {
  mixins: [baseField],
  data () {
    return {
      picker: false
    }
  },
  methods: {
    onReferenceCreated (ref) {
      // https://github.com/quasarframework/quasar/issues/8956
      if (ref) {
        ref.$el.onclick = () => { this.picker = true }
      }
    },
    isClearable () {
      return _.get(this.properties, 'field.clearable', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.k-color-field {
  background-color: v-bind(model);
  height: 16px;
  border-radius: 5px;
}
</style>
