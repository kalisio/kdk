<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <q-select v-else
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :options="options"
    emit-value
    map-options
    :error="hasError"
    :error-message="errorLabel"
    :disabled="disabled"
    bottom-slots
    @change="onChanged"
    @blur="onChanged"
    @update:model-value='onChanged'
      
  >
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        :id="scope.opt.value"
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
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
      const units = Units.getUnits(_.get(this.properties, 'field.quantity'))
      return units.map(unit => {
        // Check if we have a translation key or directly the label content
        const label = _.get(unit, 'label', '')
        return { value: unit.name, label: (this.$te(label) ? this.$t(label) : label) }
      })
    }
  }
}
</script>
