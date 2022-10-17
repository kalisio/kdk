<template>
  <div id="legend-widget" class="column" :style="widgetStyle">
    <KLegend
      v-bind="props"
    />
  </div>
</template>

<script>
import { baseWidget } from '../../../../core/client/mixins'
import KLegend from '../legend/KLegend.vue'

export default {
  components: {
    KLegend
  },
  mixins: [baseWidget],
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    props () {
      return Object.assign({}, this.options, { maxHeight: this.widgetHeight })
    }
  }
}
</script>
