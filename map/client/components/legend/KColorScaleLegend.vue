<template>
  <KLegendRenderer
    v-if="content"
    :label="label"
    :labelClass="labelClass"
  >
    <!-- content -->
    <div class="q-pa-xs">
      <KColorScale
        v-bind="content"
        :style="`height: ${height}px;`"
      />
    </div>
  </KLegendRenderer>
</template>

<script setup>
import KLegendRenderer from './KLegendRenderer.vue'
import { KColorScale } from '../../../../core/client/components'

// props
defineProps({
  label: {
    type: String,
    default: undefined
  },
  labelClass: {
    type: String,
    default: undefined
  },
  content: {
    type: Object,
    default: () => null
  },
  height: {
    type: Number,
    default: () => 40
  }
})
</script>
