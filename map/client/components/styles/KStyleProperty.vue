<template>
  <q-item :dense="dense">
    <q-item-section class="col-auto">
      <q-icon :name="icon" :size="dense ? 'xs' : 'sm'"/>
    </q-item-section>
    <q-item-section>
      <q-item-label class="ellipsis">{{ props.name }}</q-item-label>
    </q-item-section>
    <q-item-section style="max-width: 50px;">
      <!-- size/opacity type -->
      <q-btn
        v-if="['size', 'opacity'].includes(props.type)"
        :label="value"
        size="0.8rem"
        outline
        dense
      >
        <q-popup-proxy cover>
          <q-slider id="style-property-slider"
            v-model="value"
            :min="min"
            :max="max"
            :step="step"
            label
            label-always
            dense
            :label-value="value + (props.unit || '')"
            :marker-labels="[{ value: min, label: min }, { value: max, label: max }]"
            style="min-height: 60px; width: 300px;"
            class="q-px-md q-pt-xl q-pb-sm"
          />
        </q-popup-proxy>
      </q-btn>
      <!-- color type -->
      <div v-else-if="props.type === 'color'"
        class="row justify-center"
      >
        <KColorPicker
          v-model="value"
          defaultView="palette"
          size="xs"
        />
      </div>
      <!-- shape type -->
      <q-select v-else-if="props.type === 'shape'"
        v-model="value"
        :options="getShapes()"
        emit-value
        map-options
        hide-bottom-space
        dense
      >
        <template v-slot:selected-item="scope">
          <!--div class="full-width row justify-center"-->
            <KShape :options="scope.opt" class="text-center" />
          <!--/div-->
        </template>
        <template v-slot:option="scope">
          <q-item clickable>
            <KShape
              v-bind="scope.itemProps"
              :options="scope.opt"
              class="q-pa-xs row justify-center"
            />
          </q-item>

        </template>
      </q-select>
      <!-- icon type -->
      <q-select v-else-if="type === 'icon'"
        v-model="value"
        :options="['las la-ruler', 'las la-shapes', 'las la-fill']"
        hide-bottom-space
        dense
      />
    </q-item-section>
  </q-item>
</template>

<script setup>
import _ from 'lodash'
import { ref, watch, computed } from 'vue'
import { utils as kdkCoreUtils } from '@kalisio/kdk/core.client'
import KShape from '../../../../core/client/components/media/KShape.vue'
import KColorPicker from '../../../../core/client/components/input/KColorPicker.vue'

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  default: {
    type: [String, Number, Object],
    default: null
  },
  name: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'size',
    validator: (value) => ['size', 'color', 'shape', 'icon', 'opacity'].includes(value)
  },
  min: {
    type: Number,
    default: 8
  },
  max: {
    type: Number,
    default: 24
  },
  unit: {
    type: String,
    default: null
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Data
const value = ref(props.modelValue || props.default)

// Computed
const min = computed(() => {
  return props.type === 'opacity' ? 0 : parseFloat(props.min)
})
const max = computed(() => {
  return props.type === 'opacity' ? 1 : parseFloat(props.max)
})
const step = computed(() => {
  return props.type === 'opacity' ? 0.01 : 1
})
const icon = computed(() => {
  switch (props.type) {
    case 'size':
      return 'las la-ruler'
    case 'color':
      return 'las la-palette'
    case 'shape':
      return 'las la-shapes'
    case 'icon':
      return 'las la-icons'
    case 'opacity':
      return 'las la-adjust'
  }
})
function getShapes () {
  return _.map(_.keys(_.omit(kdkCoreUtils.Shapes, 'add')), shape => {
    return ({ value: shape, shape, size: 24, opacity: 0.1, color: 'primary', stroke: { color: 'primary', width: 2 } })
  })
}

// Hooks
watch(value, newValue => {
  emit('update:modelValue', newValue)
})

</script>
