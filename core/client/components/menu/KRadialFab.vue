<!-- Adapted from https://github.com/vparadis/vue-radial-menu -->
<template>
  <div>
    <span @click="toggle"><slot name="closed-menu-container" v-if="!isOpen"/></span>
    <span @click="toggle"><slot name="open-menu-container" v-if="isOpen"/></span>
    <KRadialFabItem v-if="isOpen"
      v-for="(action, index) in actions"
      :key="index" :width="itemSize" :height="itemSize"
      :left="items[index].left" :top="items[index].top" :handler="items[index].handler">
      <slot name="menu-item" v-bind="action"></slot>
    </KRadialFabItem>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import KRadialFabItem from './KRadialFabItem.vue'

const emit = defineEmits(['open', 'close'])

// Props
const props = defineProps({
  actions: {
    type: Array,
    required: true
  },
  startAngle: {
    type: Number,
    default: 0
  },
  endAngle: {
    type: Number,
    default: 180
  },
  itemSize: {
    type: Number,
    default: 36
  },
  offset: {
    type: Number,
    default: 0
  },
  radius: {
    type: Number,
    default: 100
  },
  closeOnClick: {
    type: Boolean,
    default: true
  }
})

// Data
const isOpen = ref(false)

// Computed
const items = computed(() => {
  const angle = props.endAngle - props.startAngle
  const angleStep = angle / Math.max((props.actions.length - 1), 1)
  const angles = (props.actions.length === 1
    ? [0.5 * angle * Math.PI / 180]
    : props.actions.map(
      (action, index) => props.startAngle + (props.offset + angleStep * index) * Math.PI / 180
    ))

  return props.actions.map((action, index) => ({
    left: -1 * (Math.cos(angles[index]) * props.radius), // -1 to have the items in the right order
    top: -Math.sin(angles[index]) * props.radius,
    handler: (props.closeOnClick ? close : null) // To prevent double emiting click event
  }))
})

// Functions
function open () {
  if (!isOpen.value) {
    isOpen.value = true
    emit('open')
  }
}
function close () {
  if (isOpen.value) {
    isOpen.value = false
    emit('close')
  }
}
function toggle () {
  if (isOpen.value) close()
  else open()
}

// Expose
defineExpose({
  isOpen,
  open,
  close,
  toggle
})
</script>

<style lang="scss">
  .vue-radial-menu-wrapper {
    position: relative;
    user-select: none;
    border-radius: 50%;
    font-size: 32px;
    font-weight: bold;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.24), 0 0 0 rgba(0, 0, 0, 0.16);
  }
  .vue-radial-menu-container {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    transition: all 0.2s ease;
    position: relative;
    z-index: 6;
  }
  .vue-radial-menu-container.open {
    transform: rotateZ(45deg);
  }
</style>
