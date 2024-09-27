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
  offset: {
    type: Number,
    default: 80
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
const translation = computed(() => {
  if (props.position === 'top-left') return `${props.offset - (width / 2)}px, ${props.offset - (props.size / 2)}px`
  if (props.position === 'top-right') return `${(width / 2) - props.offset}px, ${props.offset - (props.size / 2)}px`
  if (props.position === 'bottom-right') return `${(width / 2) - props.offset}px, ${(props.size / 2) - props.offset}px`
  if (props.position === 'bottom-left') return `${props.offset - (width / 2)}px, ${(props.size / 2) - props.offset}px`
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
}
</style>
