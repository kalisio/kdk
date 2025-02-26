<template>
  <KAction
    v-if="window"
    v-bind="props"
    :toggled="state === 'toggled'"
    :disabled="state === 'disabled'"
    :handler="toggleWindow"
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
  widgetId: {
    type: String,
    required: true
  },
  ..._.omit(actionProps, ['url', 'handler', 'dialog', 'route', 'closePopup', 'toggled'])
})

// Computed
const window = computed(() => {
  return _.get(Layout.findWindow(props.widgetId), 'window')
})
const state = computed(() => {
  if (!window.value) return 'disabled'
  if (window.value.visible && (window.value.current === props.widgetId)) return 'toggled'
})

// Functions
function toggleWindow (context, value) {
  if (value) Layout.openWidget(props.widgetId)
  else Layout.closeWidget(props.widgetId)
}
</script>
