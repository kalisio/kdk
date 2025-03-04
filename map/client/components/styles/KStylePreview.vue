<template>
    <KShape :options="options" />
</template>
<script setup>
import { computed } from 'vue'
import _ from 'lodash'
import KShape from '../../../../core/client/components/media/KShape.vue'
import { DefaultStyle } from '../../utils.map'

const props = defineProps({
  type: {
    type: String,
    default: 'point',
    validator: (value) => ['point', 'line', 'polygon'].includes(value)
  },
  options: {
    type: Object,
    default: {}
  }
})

const options = computed(() => {
  const override = {
    point: {
      size: ['20px', '20px']
    },
    line: {
      shape: 'triangle',
      size: ['20px', '20px'],
      opacity: 0,
      stroke: {
        width: _.get(props, ['options', props.type, 'width'], _.get(DefaultStyle, 'line.stroke.width', 2)),
        color: _.get(props, ['options', props.type, 'color'], _.get(DefaultStyle, 'line.stroke.color', '#ff0000')),
        opacity: _.get(props, ['options', props.type, 'opacity'], _.get(DefaultStyle, 'line.stroke.opacity', 1))
      }
    },
    polygon: {
      shape: 'rect',
      size: ['20px', '20px']
    }
  }

  return _.merge({}, props.options[props.type], override[props.type])
})

</script>
