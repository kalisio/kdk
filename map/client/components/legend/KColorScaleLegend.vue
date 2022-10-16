<template>
  <KColorScale
    v-bind="content"
    style="height: 46px;"
  />
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
