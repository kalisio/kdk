<template>
  <q-scroll-area
    id="scroll-area"
    ref="scrollArea"
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
import { getCssVar } from 'quasar'

export default {
  name: 'k-scroll-area',
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
        backgroundColor: getCssVar('primary'),
        width: '6px'
      },
      barStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: getCssVar('accent'),
        width: '10px'
      }
    }
  },
  methods: {
    onScrolled (info) {
      this.height = Math.min(info.verticalSize, this.maxHeight)
      this.$emit('scroll', info)
    },
    setScrollPosition (axis, offset, duration) {
      if (this.$refs.scrollArea) this.$refs.scrollArea.setScrollPosition(offset, duration)
    },
    getScrollPosition (axis) {
      if (this.$refs.scrollArea) return this.$refs.scrollArea.getScrollPosition()
      return 0
    }
  }
}
</script>
