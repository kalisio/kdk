<template>
  <q-scroll-area 
    :style="innerStyle" 
    :thumb-style="thumbStyle" 
    :bar-style="barStyle" 
    @scroll="onScrolled">
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
      value: undefined
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
      const maxHeight = this.maxHeight || window.innerHeight * .7  // 70vh
      this.height = Math.min(info.verticalSize, maxHeight)
    }
  }
}
</script>
