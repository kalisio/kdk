<template>
  <div v-if="readOnly">
    <KColorScale v-bind="model" style="max-height: 46px" />
  </div>
  <q-select v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :options="getOptions()"
    options-selected-class="hidden"
    emit-value
    map-options
    :clearable="isClearable()"
    :error="hasError"
    :error-message="errorLabel"
    :disable="disabled"
    bottom-slots
    @blur="onChanged"
    @update:model-value="onChanged"
  >
    <!-- Selected display -->
    <template v-slot:selected-item="scope">
       <q-item class="full-width">
        <q-item-section>
          <q-item-label>
            <KColorScale
              :key="scope.opt.label"
              v-bind="scope.opt.value"
              style="max-height: 46px;"
            />
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="getId(scope.opt)"
      >
        <q-item-section>
          <q-item-label>
            <KColorScale
              v-bind="scope.opt.value"
              style="max-height: 46px;"
            />
          </q-item-label>
        </q-item-section>
      </q-item>
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
  </q-select>
</template>

<script>
import _ from 'lodash'
import { KColorScale } from '../media'
import { baseField } from '../../mixins'

export default {
  components: {
    KColorScale
  },
  mixins: [baseField],
  methods: {
    getId (option) {
      return _.kebabCase(option.name)
    },
    getOptions () {
      return _.get(this.properties, 'field.options', [])
    },
    isClearable () {
      return _.get(this.properties, 'field.clearable', true)
    }
  }
}
</script>
