<template>
  <Teleport v-if="targetElement" :to="'#' + targetId">
    <div :style="computedStyle">
      <component
        :is="loadComponent(follower.component)"
        v-bind="computedProps"
      />
    </div>
  </Teleport>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, onMounted } from 'vue'
import { loadComponent } from '../utils'

// Props
const props = defineProps({
  follower: {
    type: Object,
    required: true
  },
  targetId: {
    type: String,
    required: true
  },
  anchor: {
    type: String,
    default: 'top-right'
  },
  offset: {
    type: Array,
    default: [0, 0]
  }
})

// Data
const targetElement = ref(null)

// Computed
const computedProps = computed(() => {
  return _.omit(props.follower, ['component'])
})
const computedStyle = computed(() => {
  const hOffset = `${props.offset[0]}px`
  const vOffset = `${props.offset[1]}px`
  const style = {
    position: 'absolute'
  }
  switch (props.anchor) {
    case 'top-right':
      style.top = vOffset
      style.right = hOffset
      break
    case 'top-left':
      style.top = vOffset
      style.left = hOffset
      break
    case 'bottom-left':
      style.bottom = vOffset
      style.left = hOffset
      break
    default: // bottom-right
      style.bottom = vOffset
      style.right = hOffset
      break
  }
  return style
})

// Hooks
onMounted(() => {
  targetElement.value = document.getElementById(props.targetId)
})
</script>
