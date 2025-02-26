<template>
  <KAction
    v-if="sticky"
    v-bind="props"
    :toggled="state === 'toggled'"
    :disabled="state === 'disabled'"
    :handler="toggleSticky"
  />
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { actionProps } from '../../utils/index.js'
import { Layout } from '../../layout.js'
import KAction from './KAction.vue'

// Props
const props = defineProps({
  stickyId: {
    type: String,
    required: true
  },
  ..._.omit(actionProps, ['url', 'handler', 'dialog', 'route', 'closePopup', 'toggled'])
})

// Computed
const sticky = computed(() => {
  return Layout.findSticky(props.stickyId)
})
const state = computed(() => {
  if (!sticky.value) return 'disabled'
  if (sticky.value.visible) return 'toggled'
})

// Functions
function toggleSticky (context, value) {
  if (value) Layout.showSticky(props.stickyId)
  else Layout.hideSticky(props.stickyId)
}
</script>
