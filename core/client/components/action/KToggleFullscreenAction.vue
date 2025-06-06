<template>
  <KAction
    v-bind="props"
    :toggled="Fullscreen"
    :handler="toggleFullscreen"
  />
</template>

<script setup>
import _ from 'lodash'
import { actionProps, Fullscreen, toggleFullscreen } from '../../utils'
import KAction from './KAction.vue'

// Props
const props = defineProps(_.omit(actionProps, ['url', 'handler', 'dialog', 'route', 'closePopup', 'toggled']))
</script>
