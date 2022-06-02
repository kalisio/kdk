<template>
  <q-scroll-area
    id="scroll-area"
    :ref="onScrollAreaCreated"
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
  props: {
    maxHeight: {
      type: Number,
      required: true
    }
  },
  emits: ['scrolled'],
  computed: {
    innerStyle () {
      return `height: ${this.height}px;`
    }
  },
  data () {
    return {
      height: 0,
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
  watch: {
    maxHeight: {
      handler () {
        this.height = this.scrollArea ? Math.min(this.scrollArea.getScroll().verticalSize, this.maxHeight) : this.maxHeight
      }
    }
  },
  methods: {
    onScrollAreaCreated (ref) {
      this.scrollArea = ref
    },
    onScrolled (info) {
      this.height = Math.min(info.verticalSize, this.maxHeight)
      this.$emit('scrolled', info)
    },
    setScrollPosition (axis, offset, duration) {
      if (this.scrollArea) this.scrollArea.setScrollPosition(axis, offset, duration)
    },
    getScrollPosition (axis) {
      if (this.scrollArea) {
        if (axis === 'vertical') return this.scrollArea.getScrollPosition().top
        return this.scrollArea.getScrollPosition().left
      }
      return 0
    }
  }
}
</script>
