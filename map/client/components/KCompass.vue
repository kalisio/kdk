<template>
  <div
    ref="compassRef"
    @mousedown="onStartDrag"
    @touchstart="onStartDrag"
    style="position: relative"
  >
    <svg width="100%" heigh="100%" viewBox="0 0 100 100" onclick="computeDirection">
      <circle
        cx="50" cy="50" r="44"
        :stroke="getCssVar('accent')"
        stroke-width="10"
        fill="none"
      />
      <polygon
        points="50,25 40,70 50,60 60,70"
        :fill="getCssVar('primary')"
        :stroke="getCssVar('primary')"
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
      <line v-for="i in ticks" :key="i"
        x1="50" y1="10" x2="50" y2="14"
        :stroke="getCssVar('accent')"
        :transform="`rotate(${i * (360/ticks)}, 50, 50)`"
      />
    </svg>
    <div v-if="indicator"
      style="position: absolute; top: 35%; left: 110%;">
      <q-chip 
        color="primary" 
        text-color="white" 
        outline
        :label="`${modelValue}°`" 
      />
      <q-popup-edit
        v-model="direction"
        v-slot="scope"
        auto-save
      >
        <q-input 
          v-model.number="scope.value"
          suffix="°"
          autofocus 
          dense
          @keyup.enter="scope.set"
        />
      </q-popup-edit>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCssVar } from 'quasar'

// Props
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  indicator: {
    type: Boolean,
    default: true
  },
  ticks: {
    type: Number,
    default: 16
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Data
const compassRef = ref(null)

// Computed
const direction = computed({
  get: function () {
    return props.modelValue ? props.modelValue : 0
  },
  set: function (value) {
    emit('update:modelValue', value % 360)
  }
})

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
}
function onClicked (event) {
  const { x, y } = event
  computeDirection(x, y)
}
function onHandleDrag (event) {
  const { x, y } = event.type.startsWith('touch') ? event.changedTouches[0] : event
  computeDirection(x, y)
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
