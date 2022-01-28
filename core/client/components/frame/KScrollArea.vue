<template>
  <q-scroll-area
    id="scroll-area"
    :style="innerStyle"
    :thumb-style="thumbStyle"
    :bar-style="barStyle"
    @scroll="onScrolled"
  >
    <!-- content -->
    <slot />
  </q-scroll-area>
</template>

<script>
import { QScrollArea, colors } from 'quasar'

export default {
  name: 'k-scroll-area',
  components: {
    QScrollArea
  },
  props: {
    maxHeight: {
      type: Number,
      required: true
    }
  },
  computed: {
    innerStyle () {
      return `height: ${this.height}px;`
    }
  },
  data () {
    return {
      height: undefined,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: colors.getBrand('primary'),
        width: '6px'
      },
      barStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: colors.getBrand('accent'),
        width: '10px'
      }
    }
  },
  methods: {
    onScrolled (info) {
      this.height = Math.min(info.verticalSize, this.maxHeight)
    }
  }
}
</script>
