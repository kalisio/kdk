<template>
  <div 
    ref="compassRef" 
    @mousedown="onStartDrag" 
    @touchstart="onStartDrag"
    @click="onClick"
  >
    <svg width="100%" heigh="100%" viewBox="0 0 100 100">
      <circle 
        cx="50" cy="50" r="44" 
        :stroke="getCssVar('accent')" 
        stroke-width="10" 
        fill="none" 
      />
      <polygon
        points="50,20 58,50 42,50"
        :fill="getCssVar('primary')" 
        :stroke="getCssVar('primary')" 
        :transform="`rotate(${direction}, 50, 50)`"
      />
      <polygon
        points="58,50 50,80 42,50"
        :stroke="getCssVar('primary')" 
        fill="none"
        :transform="`rotate(${direction}, 50, 50)`"
      />
      <text x="50" y="7" text-anchor="middle" alignment-baseline="middle" font-size="8px" fill="white">
        {{ $t('KCompass.NORTH') }}
      </text>
      <text x="96" y="50" text-anchor="end" alignment-baseline="middle" font-size="8px" fill="white">
        {{ $t('KCompass.EAST') }}
      </text>
      <text x="50" y="95" text-anchor="middle"  alignment-baseline="middle" font-size="8px" fill="white">
        {{ $t('KCompass.SOUTH') }}
      </text>
      <text x="3" y="50" text-anchor="start" alignment-baseline="middle" font-size="8px" fill="white">
        {{ $t('KCompass.WEST') }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getCssVar } from 'quasar'

// Props
const props = defineProps({
  modelValue: {
    type: Number,
    value: 0
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Data
const compassRef = ref(null)
const direction = ref(props.modelValue)

// Functions
function getRect () {
  if (!compassRef.value) return
  const compassRect = compassRef.value.getBoundingClientRect()
  return compassRect
}
function getCenter () {
  const compassRect = getRect()
  if (!compassRect) return
  return {
    x: compassRect.left + compassRect.width / 2,
    y: compassRect.top + compassRect.height / 2
  }
}
function computeDirection (x, y) {
  const center = getCenter()
  if (!center) return
  const dx = x - center.x
  const dy = y - center.y
  direction.value = (Math.round(Math.atan2(dy, dx) * 180 / Math.PI) + 450) % 360
  emit('update:modelValue', direction.value)
}
function onClick (event) {
  const { x, y } = event
  computeDirection(x, y)
}
function onHandleDrag (event) {
  const { x, y } = event.type.startsWith('touch') ? event.changedTouches[0] : event
  computeDirection(x,y)
}
function onStartDrag (event) {
  window.addEventListener('mousemove', onHandleDrag)
  window.addEventListener('touchmove', onHandleDrag)
  window.addEventListener('mouseup', onStropDrag)
  window.addEventListener('touchend', onStropDrag)
};
function onStropDrag () {
  window.removeEventListener('mousemove', onHandleDrag)
  window.removeEventListener('touchmove', onHandleDrag)
  window.removeEventListener('mouseup', onStartDrag)
  window.removeEventListener('touchend', onStartDrag)
}
</script>

<style lang="scss" scoped>
.compass {
  cursor: pointer;
}
</style>
