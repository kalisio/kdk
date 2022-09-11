<template>
  <q-scroll-area
    id="scroll-area"
    ref="scrollArea"
    class="k-scroll-area"
    :visible="visible"
    :thumb-style="cssThumbStyle"
    @scroll="onScrolled"
  >
    <!-- content -->
    <slot />
  </q-scroll-area>
</template>

<script setup>
import { ref, computed, watch, defineExpose } from 'vue'
import { getCssVar } from 'quasar'

// props
const props = defineProps({
  maxHeight: {
    type: Number,
    required: true
  },
  visible: {
    type: Boolean,
    default: true
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// emit
const emit = defineEmits(['scrolled'])

// data
const scrollArea = ref()
const height = ref(0)

// computed
const cssHeight = computed(() => {
  return `${height.value}px`
})
const cssThumbStyle = computed(() => { 
  return {
    right: '4px',
    borderRadius: '4px',
    backgroundColor: getCssVar('primary'),
    width: props.visible ? props.dense ? '4px' : '8px' : '0px'
  }
})

// functions
function onScrolled (info) {
  height.value = Math.min(info.verticalSize, props.maxHeight)
  emit('scrolled', info)
}
function setScrollPosition (axis, offset, duration) {
  scrollArea.value.setScrollPosition(axis, offset, duration)
}
function getScrollPosition (axis) {
  if (axis === 'vertical') return scrollArea.value.getScrollPosition().top
  return scrollArea.value.getScrollPosition().left
}

// watch
watch(() => props.maxHeight, (maxHeight) => { 
  height.value = Math.min(scrollArea.value.getScroll().verticalSize, maxHeight)
})

// expose methods
defineExpose({ 
  getScrollPosition,
  setScrollPosition
})
</script>

<style lang="scss" scoped>
.k-scroll-area {
  height: v-bind(cssHeight);
}
</style>
