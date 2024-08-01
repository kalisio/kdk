<template>
  <KAction
    ref="actionRef"
    v-bind="props"
    :handler="toggleFullscreen"
  />
</template>

<script setup>
import _ from 'lodash'
import { ref, watch } from 'vue'
import { actionProps, isFullscreen, toggleFullscreen } from '../../utils'
import KAction from './KAction.vue'

// Props
const props = defineProps(_.omit(actionProps, ['url', 'handler', 'dialog', 'route', 'closePopup']))

// Data
const actionRef = ref(null)

// Watch
watch(isFullscreen, () => {
  if (actionRef.value.isToggled !== isFullscreen.value) actionRef.value.toggle()
})
</script>