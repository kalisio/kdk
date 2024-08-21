<template>
  <div>
    <q-spinner v-if="loading"
      color="primary"
      :size="size"
    />
    <KAction v-else
      v-if="isVisible"
      id="load-more"
      icon="las la-angle-double-down" 
      color="accent"
      :size="size"
      :flat="false"
      :handler="scrollOnce"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar, scroll } from 'quasar'
import { clamp } from '../../utils'

// Props
const props = defineProps({
  target: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'las la-angle-double-down'
  },
  size: {
    type: String,
    default: 'md'
  },
  loading: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 200
  }
})

// Data
const $q = useQuasar()
const { setVerticalScrollPosition, getVerticalScrollPosition, getScrollHeight } = scroll
const isVisible = ref(false)

// Watch
watch(() => [$q.screen.width, $q.screen.height], () => {
  refresh()
})

// Functions
function refresh () {
  let targetElement = document.getElementById(props.target)
  if (!targetElement) return 
  const containerHeight = targetElement.offsetHeight
  const scrollHeight = getScrollHeight(targetElement)
  const diff = scrollHeight - containerHeight
  if (diff <= 0) isVisible.value = false
  else {
    const ratio = clamp(getVerticalScrollPosition(targetElement) / diff, 0, 1)
    const percent = Math.round(ratio * 10000) / 10000
    isVisible.value = percent < 1
  }
}
function scrollOnce () {
  const targetElement = document.getElementById(props.target)
  if (!targetElement) return
  const position = getVerticalScrollPosition(targetElement)
  setVerticalScrollPosition(targetElement, position + targetElement.offsetHeight, props.duration)
  refresh()
}

// Expose
defineExpose({
  refresh
})
</script>