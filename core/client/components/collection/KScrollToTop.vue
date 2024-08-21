<template>
  <div class="k-scroll-to-top">
    <KAction
      v-if="isVisible"
      id="scroll-to-top"
      tooltip="KScrollToTop.TOOLTIP"
      :icon="icon" 
      :color="color"
      :flat="false"
      :size="size"
      :handler="scrollToTop"
    />
</div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar, scroll } from 'quasar'

// Props
const props = defineProps({
  target: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'grey-7'
  },
  icon: {
    type: String,
    default: 'las la-arrow-up'
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
const $q = useQuasar()
const { setVerticalScrollPosition, getVerticalScrollPosition } = scroll
const isVisible = ref(false)

// Watch
watch(() => [$q.screen.width, $q.screen.height], () => {
  refresh()
})

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

<style lang="scss" scoped>
.k-scroll-to-top {
  position: relative;
  transform: translate(-48px, -24px);
}
</style>