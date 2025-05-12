<template>
  <div>
    <q-btn id="icon-picker" :size="size" round>
      <KShape :options="shapeConfig" />
    </q-btn>
    <q-popup-proxy ref="popupProxyRef" cover transition-show="scale" transition-hide="scale">
      <div class="row wrap justify-evenly q-pa-sm" style="max-width: 160px; max-height: 500px;">
        <template v-for="shape in getShapes()" :key="shape.shape">
          <q-btn
            class="q-pa-sm"
            flat
            @click="onShapeSelected(shape)">
            <KShape :options="shape" style="cursor: pointer;" />
            <q-tooltip>{{ shape.shape }}</q-tooltip>
          </q-btn>
        </template>
      </div>
    </q-popup-proxy>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, watch, computed } from 'vue'
import { utils as kdkCoreUtils } from '@kalisio/kdk/core.client'
import KShape from '../media/KShape.vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: 'rect',
    validator: (value) => {
      return _.keys(kdkCoreUtils.Shapes).includes(value)
    }
  },
  size: {
    type: String,
    default: 'sm'
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Data
const popupProxyRef = ref(null)
const shape = ref(props.modelValue)
const shapeTypes = _.keys(kdkCoreUtils.Shapes)
const shapeSizes = {
  xs: 14,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 42
}

// Functions
function getShapes () {
  return shapeTypes
    .map(shape => ({ value: shape, shape, size: 32, opacity: 0.1, color: 'primary', stroke: { color: 'primary', width: 2 } }))
}
function onShapeSelected (selectedShape) {
  emit('update:modelValue', selectedShape.shape)
  shape.value = selectedShape.shape
  popupProxyRef.value.hide()
}

// Computed
const shapeConfig = computed(() => {
  const targetShape = getShapes().find(s => s.shape === shape.value) || getShapes()[0]
  targetShape.size = _.has(shapeSizes, props.size) ? shapeSizes[props.size] : props.size
  return targetShape
})

// Watch
watch(shape, newShape => {
  emit('update:modelValue', newShape)
})

</script>
