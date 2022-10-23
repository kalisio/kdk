<template>
  <KLegendRenderer
    :label="label"
  >
    <!-- content -->
    <div class="q-pa-sm">
      <KColorScale
        v-bind="content"
        style="height: 46px;"
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
  content: {
    type: Object,
    required: true
  }
})
</script>
