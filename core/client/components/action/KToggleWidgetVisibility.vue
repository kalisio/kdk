<template>
  <KAction
    v-if="window"
    v-bind="props"
    :toggled="window.visible && window.current === widgetId"
    :handler="toggleWindow"
  />
</template>

<script setup>
import _ from 'lodash'
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

// Data
const window = Layout.findWindow(props.widgetId)

// Functions
function toggleWindow (context, value) {
  if (value) Layout.openWidget(props.widgetId)
  else Layout.closeWidget(props.widgetId)
}
</script>
