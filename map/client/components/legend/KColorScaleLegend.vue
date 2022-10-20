<template>
  <div class="column full-width q-gutter-xs">
    <div v-if="label" class="ellipsis text-caption" >
      {{ label }}
    </div> 
    <div class="q-pa-sm">
      <KColorScale
        v-bind="content"
        style="height: 46px;"
      />
    </div>
  </div>
</template>

<script setup>
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
