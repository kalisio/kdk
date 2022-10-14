<template>
  <div id="legend-box" class="column" :style="widgetStyle">
    <KLegend />
  </div>
</template>

<script>
import { baseWidget } from '../../../../core/client/mixins'
import KLegend from '../legend/KLegend.vue'

export default {
  components: {
    KLegend
  },
  mixins: [baseWidget]
}
</script>
