<template>
  <div v-if="style">
    <KShape :options="shapeOptions" />
    <KStyleTip
      :style="style"
      :type="type"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getShapeFromPointStyle, getShapeFromLineStyle, getShapeFromPolygonStyle } from '../../utils/utils.style.js'
import KShape from '../../../../core/client/components/media/KShape.vue'
import KStyleTip from './KStyleTip.vue'

// Props
const props = defineProps({
  style: {
    type: Object,
    default: () => null
  },
  type: {
    type: String,
    default: 'point',
    validator: (value) => {
      return ['point', 'line', 'polygon'].includes(value)
    }
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Computed
const shapeOptions = computed(() => {
  const size = props.dense ? [20, 20] : [24, 24]
  switch (props.type) {
    case 'point':
      return getShapeFromPointStyle(props.style, size)
    case 'line':
      return getShapeFromLineStyle(props.style, size)
    default:
      return getShapeFromPolygonStyle(props.style, size)
  }
})
</script>
