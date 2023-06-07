<template>
  <div v-if="readOnly">
    <KColorScale v-bind="model" style="max-height: 46px" />
  </div>
  <q-select v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :options="options"
    options-selected-class="hidden"
    emit-value
    map-options
    :clearable="clearable"
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
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
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
  computed: {
    clearable () {
      return _.get(this.properties, 'field.clearable', true)
    },
    options () {
      return _.get(this.properties, 'field.options', [])
    }
  },
  methods: {
    getId (option) {
      return _.kebabCase(option.name)
    },
    emptyModel () {
      return null
    }
  }
}
</script>
