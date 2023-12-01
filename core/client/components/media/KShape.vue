<template>
  <div>
    <div v-if="content" v-html="content" />
    <q-tooltip v-if="tooltip">
      {{ tooltip }}
    </q-tooltip>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { createShape } from '../../utils/utils.shapes.js'

// Props
const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  tooltip: {
    type: String,
    default: undefined
  }
})

// Computed
const content = computed(() => {
  const shape = createShape(props.options)
  return shape ? shape.html : undefined
})
</script>
