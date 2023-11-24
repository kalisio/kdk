<template>
  <div>
    <div v-html="content" />
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
  return createShape(props.options)
})
</script>
