<template>
  <q-item class="row no-wrap justify-start">
    <q-item-section class="col-auto">
      <q-icon :name="icon" size="2em"/>
    </q-item-section>
    <q-item-section class="col-grow">
      <q-item-label>{{ props.name }}</q-item-label>
    </q-item-section>
    <q-item-section class="col-2 items-center">
      <q-slider v-if="['size', 'opacity'].includes(props.type)" id="style-property-slider" v-model="value"
        :min="min" :max="max" :step="step"
        label label-always :label-value="value + (props.unit || '')"/>
      <KColorPicker v-else-if="props.type === 'color'" v-model="value" />
      <q-select v-else-if="props.type === 'shape'" v-model="value" :options="getShapes()" emit-value map-options bottom-slots>
        <template v-slot:selected-item="scope"><KShape :options="scope.opt"/></template>
        <template v-slot:option="scope"><KShape class="row justify-center" v-bind="scope.itemProps" :options="scope.opt"/></template>
      </q-select>
      <q-select v-else-if="props.type === 'icon'" v-model="value" :options="['las la-ruler', 'las la-shapes', 'las la-fill']" />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import KShape from '../../../../core/client/components/media/KShape.vue'
import KColorPicker from '../../../../core/client/components/input/KColorPicker.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: '#FF0000'
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
  icon: {
    type: String,
    default: ''
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
  }
})

const emit = defineEmits(['update:modelValue'])
const value = ref(props.modelValue)

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
  if (props.icon) return props.icon

  switch (props.type) {
    case 'size':
      return 'las la-ruler'
    case 'color':
      return 'las la-fill'
    case 'shape':
      return 'las la-shapes'
    case 'icon':
      return 'las la-icons'
    case 'opacity':
      return 'las la-adjust'
  }
})

function getShapes () {
  return ['none', 'circle', 'triangle-down', 'triangle', 'triangle-right', 'triangle-left', 'rect', 'diamond', 'star', 'marker-pin', 'square-pin']
    .map(shape => ({ value: shape, shape, size: 32, opacity: 0.1, color: 'primary', stroke: { color: 'primary', width: 2 } }))
}

watch(value, newValue => {
  emit('update:modelValue', newValue)
})

</script>
