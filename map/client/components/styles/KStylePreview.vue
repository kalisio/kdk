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
  switch (props.type) {
    case 'point': {
      let width = _.get(props.style, 'stroke.width', 1)
      if (width > 1) width = width / 3
      return _.merge({}, props.style, { size, stroke: { width } })
    }
    case 'line': {
      let width = _.get(props.style, 'width', 1)
      if (width > 1) width = width / 3
      return { shape: 'polyline', stroke: _.merge({}, props.style, { width, clipPath: false }) }
    }
    default: {
      let width = _.get(props.style, 'stroke.width', 1)
      if (width > 1) width = width / 3
      return _.merge({ shape: 'polygon', size }, props.style, { stroke: { width } })
    }
  }
})
</script>
