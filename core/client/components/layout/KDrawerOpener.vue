<template>
  <div
    class="row justify-center items-center" 
    v-bind:class="{ 'k-drawer-opener-left': position === 'left', 'k-drawer-opener-right': position === 'right' }"
    v-touch-swipe.mouse.horizontal="onSwipe"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    @click="onClick">
    <q-icon v-if="isHovered" :name="icon" color="white" size="md" />
  </div>
</template>

<script>
export default {
  name: 'k-drawer-opener',
  props: {
    position: {
      type: String,
      default: 'left',
      validator: (value) => {
        return ['left', 'right'].includes(value)
      }
    }
  },
  data () {
    return {
      isHovered: false,
      icon: this.position === 'left' ? 'chevron_right' : 'chevron_left'
    }
  },
  inject: ['klayout'],
  methods: {
    onMouseOver () {
      this.isHovered = true
       if (this.position === 'left') {
        if (this.klayout.isLeftDrawerVisible) this.icon = 'chevron_left'
        else this.icon = 'chevron_right'
      } else {
        if (this.klayout.isRightDrawerVisible) this.icon = 'chevron_right'
        else this.icon = 'chevron_left'
      }
    },
    onMouseLeave () {
      this.isHovered = false
    },
    onClick () {
      if (this.position === 'left') this.klayout.toggleLeftDrawer()
      else this.klayout.toggleRightDrawer()
    },
    onSwipe ({ evt, ...info }) {
      if (this.position === 'left') {
        if (info.direction === 'right') this.klayout.showLeftDrawer()
        if (info.direction === 'left') this.klayout.hideLeftDrawer()
      } else {
        if (info.direction === 'left') this.klayout.showRightDrawer()
        if (info.direction === 'right') this.klayout.hideRightDrawer()
      }
    }
  }
}
</script>

<style lang="stylus">
  .k-drawer-opener-left, .k-drawer-opener-right {
    height: 96px;
    width: 12px;
    background: $primary
    transition: 0.2s;
  }
  .k-drawer-opener-left {
    border-radius: 0px 5px 5px 0px;
  }
  .k-drawer-opener-right {
    border-radius: 5px 0px 0px 5px;
  }
  .k-drawer-opener-left:hover, .k-drawer-opener-right:hover {
    cursor: pointer;
    height: 96px;
    width: 32px;
    transition: 0.2s;
  }
</style>
