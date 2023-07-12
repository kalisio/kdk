<!-- Adapted from https://github.com/vparadis/vue-radial-menu -->
<template>
  <Transition name="radial-vue-radial-menu-item">
    <div
      :style="style"
      class="vue-radial-menu-item"
      @click="handleClick">
      <slot></slot>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['click'])

// Props
const props = defineProps({
  top: {
    type: Number,
    required: true
  },
  left: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  handler: {
    type: Function,
    default: null
  }
})

// Computed
const style = computed(() => ({
  top: Math.round(props.top) + 'px',
  left: Math.round(props.left) + 'px',
  width: Math.round(props.width) + 'px',
  height: Math.round(props.height) + 'px'
}))

// Functions
function handleClick (event) {
  emit('click', event)
  if (props.handler) props.handler(event)
}
</script>

<style lang="scss">
  .vue-radial-menu-item {
    position: absolute;
    display: flex;
    align-items: center;
    transition: all 0.2s ease;
    transform: none;
    user-select: none;
  }
  .radial-vue-radial-menu-item-enter,
  .radial-vue-radial-menu-item-leave-to {
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%);
    opacity: 0;
  }
</style>
