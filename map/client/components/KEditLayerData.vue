<template>
  <KAction v-bind="props" :toggled="isToggled">
  </KAction>
</template>

<script setup>
import { computed } from 'vue'
import { actionProps } from '../../../core/client/utils/utils.actions.js'
import KAction from '../../../core/client/components/action/KAction.vue'
import { useCurrentActivity } from '../composables/activity.js'

// Props
const props = defineProps(_.omit(actionProps, ['toggle', 'url', 'handler', 'route', 'dialog']))

// Data
const { CurrentActivity } = useCurrentActivity({ selection: false, probe: false })

// Computed
const isToggled = computed(() => {
  return CurrentActivity.value.isLayerEdited(props.context)
})
</script>
