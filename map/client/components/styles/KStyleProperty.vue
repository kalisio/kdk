<template>
  <q-item :dense="dense">
    <q-item-section class="col-auto">
      <q-icon :name="icon" :size="dense ? 'xs' : 'sm'"/>
    </q-item-section>
    <q-item-section>
      <q-item-label class="ellipsis">{{ $t(props.label) }}</q-item-label>
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
      <div v-else-if="props.type === 'shape'" class="row justify-center">
        <KShapePicker v-model="value" />
      </div>
      <!-- icon type -->
      <div v-else-if="type === 'icon'" class="row justify-center">
        <KIconPicker v-model="value" />
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { KColorPicker, KIconPicker, KShapePicker } from '../../../../core/client/components/input/index.js'

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
  label: {
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
const value = ref(props.modelValue)

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

// Hooks
watch(value, newValue => {
  emit('update:modelValue', newValue)
})

// Immediate
if (!value.value) value.value = props.default
</script>
