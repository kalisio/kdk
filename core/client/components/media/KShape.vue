<template>
  <div>
    <div v-html="content" />
    <q-tooltip v-if="tooltip">
      {{ tooltip }}
    </q-tooltip>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { getCssVar } from 'quasar'
import { Shapes, createShape } from '../../utils/utils.shapes.js'

// props
const props = defineProps({
  shape: {
    type: String,
    default: 'circle',
    validator: (value) => {
      return Object.keys(Shapes).includes(value)
    }
  },
  width: {
    type: Number,
    default: 24
  },
  height: {
    type: Number,
    default: 24
  },
  fill: {
    type: String,
    default: getCssVar('primary')
  },
  fillOpacity: {
    type: Number,
    default: 1
  },
  stroke: {
    type: String,
    default: 'black'
  },
  strokeWidth: {
    type: Number,
    default: 0
  },
  strokeLineCap: {
    type: String,
    default: 'butt'
  },
  strokeLineJoin: {
    type: String,
    default: 'miter'
  },
  icon: {
    type: Object,
    default: undefined
  },
  tooltip: {
    type: String,
    default: undefined
  }
})

// Computed
const content = computed(() => {
  return createShape(_.omit(props, ['tooltip']))
})
</script>
