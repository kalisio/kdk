<template>
  <div
    :class="{'k-expandable-collapsed': !isExpanded, 'k-expandable-expanded': isExpanded }"
  >
    <!-- content -->
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

// props
const props = defineProps({
  isExpanded: {
    type: Boolean,
    default: false
  },
  minHeight: {
    type: Number,
    required: true
  },
  maxHeight: {
    type: Number,
    required: true
  }
})

// computed
const cssMinHeight = computed(() => {
  return `${props.minHeight}px`
})
const cssMaxHeight = computed(() => {
  return `${props.maxHeight}px`
})
</script>

<style lang="scss" scoped>
.k-expandable-collapsed {
  overflow: hidden;
  transition: 0.3s;
  min-height: v-bind('cssMinHeight');
  max-height: v-bind('cssMinHeight');
}
.k-expandable-expanded {
  transition: 0.3s;
  max-height: v-bind('cssMaxHeight');
}
</style>
