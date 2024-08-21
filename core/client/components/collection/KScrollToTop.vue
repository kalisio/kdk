<template>
  <KAction
    v-if="isVisible"
    id="back-to-top"
    tooltip="KScrollToTop.TOOLTIP"
    icon="vertical_align_top" 
    color="accent"
    :flat="false"
    :size="size"
    :handler="scrollToTop"
  />
</template>

<script setup>
import { ref } from 'vue'
import { scroll } from 'quasar'

// Props
const props = defineProps({
  target: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'vertical_align_top'
  },
  size: {
    type: String,
    default: 'md'
  },
  duration: {
    type: Number,
    default: 300
  }
})

// Data
const { setVerticalScrollPosition, getVerticalScrollPosition } = scroll
const isVisible = ref(false)

// Functions
function refresh () {
  const targetElement = document.getElementById(props.target)
  if (!targetElement) return
  isVisible.value = getVerticalScrollPosition(targetElement) > 0
}
function scrollToTop () {
  const targetElement = document.getElementById(props.target)
  if (!targetElement) return
  setVerticalScrollPosition(targetElement, 0, props.duration)
  refresh()
}

// Expose
defineExpose({
  refresh
})
</script>