<template>
  <div class="k-ribbon">
    {{ text }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getHtmlColor } from '../../utils/utils.colors.js'
const width = 500

// Props
const props = defineProps({
  text: {
    type: String,
    default: undefined
  },
  size: {
    type: Number,
    default: 28
  },
  color: {
    type: String,
    default: 'primary'
  },
  textColor: {
    type: String,
    default: 'white'
  },
  position: {
    type: String,
    default: 'top-left',
    validator: (value) => {
      return ['top-left', 'top-right', 'bottom-right', 'bottom-left'].includes(value)
    }
  },
  origin: {
    type: Number,
    default: 80
  },
  letterSpacing: {
    type: Number,
    default: 2
  }
})

// Computed
const computedWidth = computed(() => {
  return `${width}px`
})
const computedHeight = computed(() => {
  return `${props.size}px`
})
const computedColor = computed(() => {
  return getHtmlColor(props.color)
})
const computedTextColor = computed(() => {
  return getHtmlColor(props.textColor)
})
const computedLetterSpacing = computed(() => {
  return `${props.letterSpacing}px`
})
const translation = computed(() => {
  if (props.position === 'top-left') return `${props.origin - (width / 2)}px, ${props.origin - (props.size / 2)}px`
  if (props.position === 'top-right') return `${(width / 2) - props.origin}px, ${props.origin - (props.size / 2)}px`
  if (props.position === 'bottom-right') return `${(width / 2) - props.origin}px, ${(props.size / 2) - props.origin}px`
  if (props.position === 'bottom-left') return `${props.origin - (width / 2)}px, ${(props.size / 2) - props.origin}px`
})
const rotation = computed(() => {
  if (props.position === 'top-left' || props.position === 'bottom-right') return '-45deg'
  return '45deg'
})
</script>

<style lang="scss" scope>
.k-ribbon {
  width: v-bind(computedWidth);
  height: v-bind(computedHeight);
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(v-bind(translation)) rotate(v-bind(rotation));
  background-color: v-bind(computedColor);
  color: v-bind(computedTextColor);
  letter-spacing: v-bind(computedLetterSpacing);
}
</style>
