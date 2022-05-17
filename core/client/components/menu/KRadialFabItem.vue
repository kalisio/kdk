<!-- Adapted from https://github.com/vparadis/vue-radial-menu -->
<template>
  <Transition name="radial-vue-radial-menu-item">
    <div
      :style="style"
      class="vue-radial-menu-item"
      @click="handleClick">
      <slot></slot>
    </div>
  </Transition>
</template>

<script>
export default {
  props: ['top', 'left', 'height', 'width', 'handler'],
  data () {
    const { top, left, height, width } = this
    return {
      style: {
        top: top + 'px',
        left: left + 'px',
        width: width + 'px',
        height: height + 'px'
      }
    }
  },
  methods: {
    handleClick (event) {
      this.$emit('click', event)
      if (this.handler) this.handler(event)
    }
  }
}
</script>

<style lang="scss">
  .vue-radial-menu-item {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
    transform: none;
    user-select: none;
  }
  .radial-vue-radial-menu-item-enter,
  .radial-vue-radial-menu-item-leave-to {
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%);
    opacity: 0;
  }
</style>
