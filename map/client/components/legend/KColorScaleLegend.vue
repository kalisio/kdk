<template>
  <div class="column full-width">
    <KColorScale
      v-bind="content"
      style="height: 48px; width: 100%"
    />
  </div>
</template>

<script setup>
import { KColorScale } from '../../../../core/client/components'

// props
defineProps({
  content: {
    type: Object,
    required: true
  }
})
</script>
