<template>
  <div
    class="row justify-center items-center"
    v-bind:class="{
      'k-opener-left': position === 'left',
      'k-opener-left-hovered': (position === 'left') && isHovered && isDesktop,
      'k-opener-right': position === 'right',
      'k-opener-right-hovered': (position === 'right') && isHovered && isDesktop,
      'k-opener-top': position === 'top',
      'k-opener-top-hovered': (position === 'top') && isHovered && isDesktop,
      'k-opener-bottom': position === 'bottom',
      'k-opener-bottom-hovered': (position === 'bottom') && isHovered && isDesktop
    }"
    v-on="isDesktop ? { mouseover: onMouseOver, mouseleave: onMouseLeave } : {}"
    v-touch-swipe.mouse="onSwipe"
    @click="onClick"
  >
    <q-icon v-if="icon" :name="icon" color="white" size="sm" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

// emit
const emit = defineEmits(['update:modelValue'])

// props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'left',
    validator: (value) => {
      return ['left', 'right', 'top', 'bottom'].includes(value)
    }
  }
})

// data
const $q = useQuasar()
const isDesktop = $q.platform.is.desktop
const isHovered = ref(false)
const icon = ref(null)

// computed
const isOpened = computed(() => {
  return props.modelValue
})

// functions
function onMouseOver () {
  if (!isDesktop) return
  isHovered.value = true
  switch (props.position) {
    case 'left':
      icon.value = isOpened.value ? 'las la-angle-left' : 'las la-angle-right'
      break
    case 'right':
      icon.value = isOpened.value ? 'las la-angle-right' : 'las la-angle-left'
      break
    case 'top':
      icon.value = isOpened.value ? 'las la-angle-up' : 'las la-angle-down'
      break
    default: // bottom
      icon.value = isOpened.value ? 'las la-angle-down' : 'las la-angle-up'
  }
}
function onMouseLeave () {
  if (!isDesktop) return
  isHovered.value = false
  icon.value = null
}
function onSwipe ({ evt, ...info }) {
  if (!info && !info.direction) return
  switch (props.position) {
    case 'left':
      if (info.direction === 'left' && isOpened.value) onClick()
      if (info.direction === 'right' && !isOpened.value) onClick()
      break
    case 'right':
      if (info.direction === 'left' && !isOpened.value) onClick()
      if (info.direction === 'right' && isOpened.value) onClick()
      break
    case 'top':
      if (info.direction === 'up' && isOpened.value) onClick()
      if (info.direction === 'down' && !isOpened.value) onClick()
      break
    default: // bottom
      if (info.direction === 'up' && !isOpened.value) onClick()
      if (info.direction === 'down' && isOpened.value) onClick()
  }
}
function onClick () {
  emit('update:modelValue', !isOpened.value)
}
</script>

<style lang="scss" scoped>
  .k-opener-left, .k-opener-right, .k-opener-top, .k-opener-bottom {
    opacity: 0.85;
    transition: 0.2s;
    background-color: var(--q-primary);
    border: 2px solid var(--q-secondary);
  }
  .k-opener-left, .k-opener-right {
    height: 110px;
    width: 24px;
  }
  .k-opener-top, .k-opener-bottom {
    height: 24px;
    width: 110px;
  }
  .k-opener-left {
    border-radius: 0px 8px 8px 0px;
  }
  .k-opener-right {
    border-radius: 8px 0px 0px 8px;
  }
  .k-opener-top {
    border-radius: 0px 0px 8px 8px;
  }
  .k-opener-bottom {
    border-radius: 8px 8px 0px 0px;
  }
  .k-opener-left-hovered, .k-opener-right-hovered, .k-opener-top-hovered, .k-opener-bottom-hovered {
    cursor: pointer;
    opacity: 1;
  }
  .k-opener-left-hovered, .k-opener-right-hovered {
    width: 40px;
  }
  .k-opener-top-hovered, .k-opener-bottom-hovered {
    height: 40px;
  }
</style>
