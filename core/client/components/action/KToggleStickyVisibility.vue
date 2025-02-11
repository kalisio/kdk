<template>
  <KAction
    v-if="sticky"
    v-bind="props"
    :toggled="sticky.visible"
    :handler="toggleSticky"
  />
</template>

<script setup>
import _ from 'lodash'
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

// Data
const sticky = Layout.findSticky(props.stickyId)

// Functions
function toggleSticky (context, value) {
  if (value) Layout.showSticky(props.stickyId)
  else Layout.hideSticky(props.stickyId)
}
</script>
