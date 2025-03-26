<template>
  <Teleport v-if="targetAvailable" :to="'#' + targetId">
    <component
      :is="loadComponent(follower.component)"
      :class="'teleported absolute-' + position"
      :style="dynamicStyles"
      ref="componentRef"
      v-bind="{ ...follower, component: null }"
    />
  </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { loadComponent } from '../utils'

const props = defineProps({
  follower: {
    type: Object,
    required: true
  },
  targetId: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'top-right'
  },
  offset: {
    type: [Number, Array],
    default: [0, 0]
  }
})

const targetAvailable = ref(false)
const dynamicStyles = ref({})
const componentRef = ref(null)

onMounted(() => {
  const observer = new MutationObserver(() => {
    const targetElement = document.getElementById(props.targetId)
    if (targetElement) {
      // wait for dom flush
      nextTick(() => {
        if (!componentRef.value) return
        const el = componentRef.value.$el || componentRef.value
        if (!el) return
        const positions = props.position.split('-')
        const xOrY = { left: 0, right: 0, top: 1, bottom: 1 }
        positions.forEach((position) => {
          if (props.position.includes(position)) {
            dynamicStyles.value[position] =
              -props.offset[xOrY[position]] -
              (xOrY[position] // in js, 1 = true and 0 = false
                ? el.clientHeight / 2
                : el.clientWidth / 2) +
              'px'
          }
        })
      })

      targetAvailable.value = true
    }
    if (!targetElement && targetAvailable) {
      targetAvailable.value = false
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })

  onBeforeUnmount(() => {
    observer.disconnect()
  })
})
</script>
