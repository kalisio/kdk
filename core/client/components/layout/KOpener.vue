<template>
  <div
    class="row justify-center items-center" 
    v-bind:class="{ 
      'k-opener-left': position === 'left', 
      'k-opener-right': position === 'right', 
      'k-opener-top': position === 'top', 
      'k-opener-bottom': position === 'bottom' 
    }"
    :style="computedStyle"
    v-touch-swipe.mouse="onSwipe"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    @click="onClick">
    <q-icon v-if="icon" :name="icon" color="white" size="sm" />
  </div>
</template>

<script>
import { colors } from 'quasar'

export default {
  name: 'k-opener',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'left',
      validator: (value) => {
        return ['left', 'right', 'top', 'bottom'].includes(value)
      }
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    computedStyle () {
      return 'background-color:' + colors.getBrand(this.color);
    }
  },
  data () {
    return {
      isOpened: this.value,
      isHovered: false,
      icon: null
    }
  },
  watch: {
    value: function (isOpened) {
      this.isOpened = isOpened
    }
  },
  methods: {
    onMouseOver () {
      this.isHovered = true
      switch(this.position) {
        case 'left':
          this.icon = this.isOpened ? 'las la-angle-left' : 'las la-angle-right'
          break
        case 'right':
          this.icon = this.isOpened ? 'las la-angle-right' : 'las la-angle-left'
          break
        case 'top':
          this.icon = this.isOpened ? 'las la-angle-up' : 'las la-angle-down'
          break
        default: // bottom
          this.icon = this.isOpened ? 'las la-angle-down' : 'las la-angle-up'
      }
    },
    onMouseLeave () {
      this.isHovered = false
      this.icon = null
    },
    onClick () {
      this.trigger()
    },
    onSwipe ({ evt, ...info }) {
      switch(this.position) {
        case 'left':
          if (info.direction === 'left' && this.isOpened) this.trigger()
          if (info.direction === 'right' && !this.isOpened) this.trigger()
          break
        case 'right':
          if (info.direction === 'left' && !this.isOpened) this.trigger()
          if (info.direction === 'right' && this.isOpened) this.trigger()
          break
        case 'top':
          if (info.direction === 'up' && this.isOpened) this.trigger()
          if (info.direction === 'down' && !this.isOpened) this.trigger()
          break
        default: // bottom
          if (info.direction === 'up' && !this.isOpened) this.trigger()
          if (info.direction === 'down' && this.isOpened) this.trigger()
      }
    },
    trigger () {
      this.$emit('input', !this.isOpened)
    }
  }
}
</script>

<style lang="stylus">
  .k-opener-left, .k-opener-right, .k-opener-top, .k-opener-bottom {
    opacity: 0.75;
    transition: 0.2s;
  }
  .k-opener-left, .k-opener-right {
    height: 96px;
    width: 10px;
  }
  .k-opener-top, .k-opener-bottom {
    height: 10px;
    width: 128px;
  }
  .k-opener-left {
    border-radius: 0px 5px 5px 0px;
  }
  .k-opener-right {
    border-radius: 5px 0px 0px 5px;
  }
  .k-opener-top {
    border-radius: 0px 0px 5px 5px;
  }
  .k-opener-bottom {
    border-radius: 5px 5px 0px 0px;
  }
  .k-opener-left:hover, .k-opener-right:hover, .k-opener-top:hover, .k-opener-bottom:hover {
    cursor: pointer;
    opacity: 1;
  }
  .k-opener-left:hover, .k-opener-right:hover {
    width: 32px;
  }
  .k-opener-top:hover, .k-opener-bottom:hover {
    height: 32px;
  }
</style>
