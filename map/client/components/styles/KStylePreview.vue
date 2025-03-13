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
import _ from 'lodash'
import { computed } from 'vue'
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

  const size = props.dense ? ['20px', '20px'] : ['24px', '24px']
  // Point
  if (props.type === 'point') {
    let stroke = _.get(props.style, 'stroke')
    if (stroke) {
      let width = _.get(stroke, 'width', 1)
      if (width > 1) width = width / 4
      stroke = { stroke: { width } }
    }
    return _.merge({}, props.style, { size }, stroke)
  }
  // Line
  if (props.type === 'line') {
    let width = _.get(props.style, 'width', 1)
    if (width > 1) width = width / 4
    return { shape: 'polyline', stroke: _.merge({}, props.style, { width }) }
  }
  // Polygon
  let stroke = _.get(props.style, 'stroke')
  if (stroke) {
    let width = _.get(stroke, 'width', 1)
    if (width > 1) width = width / 4
    stroke = { stroke: { width } }
  }
  return _.merge({}, props.style, { shape: 'polygon' }, { size }, stroke)
})
</script>
