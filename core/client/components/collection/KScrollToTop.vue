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
import _ from 'lodash'
import logger from 'loglevel'
import { ref, watch } from 'vue'
import { useQuasar, scroll as qScrollUtils } from 'quasar'
import { DefaultZIndex } from '../../layout.js'

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
  },
  zIndex: {
    type: Number,
    default: () => { return DefaultZIndex.fab }
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
  isVisible.value = qScrollUtils.getVerticalScrollPosition(targetElement) > 0
  logger.trace(`[KDK] (KScrollToTop) Refreshed with visibility: ${isVisible.value}`)
}, 100)
function scrollToTop () {
  const targetElement = document.getElementById(props.target)
  if (!targetElement) {
    logger.error('[KDK] Cannot find target element')
    return
  }
  qScrollUtils.setVerticalScrollPosition(targetElement, 0, props.duration)
  logger.trace('[KDK] (KScrollToTop) Scrolled to top')
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
  z-index: v-bind(zIndex);
}
</style>
