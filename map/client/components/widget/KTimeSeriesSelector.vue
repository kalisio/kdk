<template>
  <k-panel
    id="time-series-selector"
    :content="timeSeries"
    action-renderer="item"
    :dense="dense"
    direction="vertical"
  />
</template>

<script>
import { KPanel } from '../../../../core/client/components'

export default {
  name: 'k-time-series-selector',
  components: {
    KPanel
  },
  props: {
    timeSeries: {
      type: Array,
      default: () => []
    },
    dense: {
      type: Boolean,
      default: false
    }
  }
}
</script>
