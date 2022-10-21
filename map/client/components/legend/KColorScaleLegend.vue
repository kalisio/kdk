<template>
  <KLegendSection
    :label="label"
  >
    <!-- content -->
    <div class="q-pa-sm">
      <KColorScale
        v-bind="content"
        style="height: 46px;"
      />
    </div>
  </KLegendSection>
</template>

<script setup>
import KLegendSection from './KLegendSection.vue'
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
