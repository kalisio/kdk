<template>
  <k-menu v-if="menu && count > 0"
    icon="las la-bars" id="time-series-selector"
    :content="timeSeries"
    action-renderer="item"
    :dense="dense"
    :badge="{ color: 'accent', label: count }"
  />
  <k-panel v-if="!menu && count > 0"
    id="time-series-selector"
    :content="timeSeries"
    action-renderer="item"
    :dense="dense"
    direction="vertical"
  />
</template>

<script setup>
import { computed } from 'vue'
import { KPanel, KMenu } from '../../../../core/client/components'

const props = defineProps({
  timeSeries: { type: Array, default: () => [] },
  dense: { type: Boolean, default: false },
  menu: { type: Boolean, default: true }
})

const count = computed(() => {
  return _.filter(props.timeSeries, { visible: true }).length
})
</script>
: