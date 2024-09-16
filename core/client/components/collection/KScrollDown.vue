<template>
  <div>
    <q-spinner v-if="loading"
      color="primary"
      :size="size"
    />
    <KAction v-else
      v-if="isVisible"
      id="scroll-down"
      :color="color"
      :icon="icon"
      :size="size"
      :handler="scrollOnce"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { ref, watch } from 'vue'
import { useQuasar, scroll as qScrollUtils } from 'quasar'
import { clamp } from '../../utils'

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
const isVisible = ref(false)

// Watch
watch(() => [$q.screen.width, $q.screen.height], () => {
  refresh()
})

// Functions
const refresh = _.debounce(() => {
  const targetElement = document.getElementById(props.target)
  if (!targetElement) {
    logger.error('[KDK] Cannot find target element')
    return
  }
  const containerHeight = targetElement.offsetHeight
  const scrollHeight = qScrollUtils.getScrollHeight(targetElement)
  const diff = scrollHeight - containerHeight
  if (diff <= 0) isVisible.value = false
  else {
    const ratio = clamp(qScrollUtils.getVerticalScrollPosition(targetElement) / diff, 0, 1)
    const percent = Math.round(ratio * 10000) / 10000
    isVisible.value = percent < 0.99
  }
  logger.trace(`[KDK] (KScrollDown) Refreshed with visibility: ${isVisible.value}`)
}, 100)
function scrollOnce () {
  const targetElement = document.getElementById(props.target)
  if (!targetElement) {
    logger.error('[KDK] Cannot find target element')
    return
  }
  const position = qScrollUtils.getVerticalScrollPosition(targetElement)
  const offset = targetElement.offsetHeight * 0.75
  qScrollUtils.setVerticalScrollPosition(targetElement, position + offset, props.duration)
  logger.trace(`[KDK] (KScrollDown) Scrolled down with offset: ${offset}`)
  refresh()
}

// Expose
defineExpose({
  refresh
})
</script>
