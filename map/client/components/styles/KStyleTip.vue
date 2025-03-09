<template>
  <KLocationTip
    v-model="showTip"
    :location="location"
    :target="target"
    :anchor="anchor"
    :self="self"
    :offset="offset"
    :delay="delay"
    :no-parent-event="noParentEvent"
  />
</template>

<script setup>
import _ from 'lodash'
import { ref, watch } from 'vue'
import KLocationTip from '../location/KLocationTip.vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: null
  },
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
  target: {
    type: [Boolean, String],
    default: true
  },
  anchor: {
    type: String,
    default: 'bottom middle'
  },
  self: {
    type: String,
    default: 'top middle'
  },
  offset: {
    type: Array,
    default: [14, 14]
  },
  delay: {
    type: Number,
    default: 500
  },
  noParentEvent: {
    type: Boolean,
    default: false
  }
})

// Data
const showTip = ref(null)
const location = ref(null)

// Function
function refresh () {
  if (_.isNil(props.style)) return null
  if (props.type === 'point') {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [1.5, 43.2]
      },
      properties: {},
      style: props.style
    }
  }
  if (props.type === 'line') {
    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[0, 43], [0.5, 43.5], [1, 43], [1.5, 43.5]]
      },
      properties: {},
      style: props.style
    }
  }
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[[0.4, 42.6], [0, 43], [0.2, 43.3], [0.75, 43.5], [1.2, 43.3], [1.5, 43], [1, 42.5]]]
    },
    properties: {},
    style: props.style
  }
}

// Watch
watch(() => props.modelValue, (value) => {
  showTip.value = value
}, { immediate: true })
watch(() => props.style, (value) => {
  location.value = refresh()
}, { immediate: true, deep: true })
</script>
