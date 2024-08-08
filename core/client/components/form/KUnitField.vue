<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <q-select v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :options="options"
    emit-value
    map-options
    :error="hasError"
    :error-message="errorLabel"
    :disable="disabled"
    bottom-slots
    @blur="onChanged"
    @update:model-value='onChanged'

  >
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="scope.opt.value"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
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
import { baseField } from '../../mixins'
import { Units } from '../../units'

export default {
  mixins: [baseField],
  computed: {
    options () {
      let units = Units.getUnits(_.get(this.properties, 'field.quantity'))
      const unitsFilter = _.get(this.properties, 'field.filter', [])
      if (!_.isEmpty(unitsFilter)) units = _.filter(units, unit => _.includes(unitsFilter, unit.name))
      return units.map(unit => {
        // Check if we have a translation key or directly the label content
        const label = _.get(unit, 'label', '')
        return { value: unit.name, label: this.$tie(label) }
      })
    }
  }
}
</script>
