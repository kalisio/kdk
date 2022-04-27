<!-- Adapted from https://github.com/vparadis/vue-radial-menu -->
<template>
  <div>
    <span @click="toggle"><slot name="closed-menu-container" v-if="!isOpen"/></span>
    <span @click="toggle"><slot name="open-menu-container" v-if="isOpen"/></span>
    <slot v-if="isOpen"></slot>
  </div>
</template>

<script>
import { QBtn } from 'quasar'

export default {
  name: 'k-radial-fab',
  components: {
    QBtn
  },
  props: {
    startAngle: { type: Number, default: 0 },
    endAngle: { type: Number, default: 180 },
    itemSize: { type: Number, default: 36 },
    offset: { type: Number, default: 0 },
    radius: { type: Number, default: 100 },
    closeOnClick: { type: Boolean, default: true }
  },
  data () {
    return {
      isOpen: false
    }
  },
  beforeUpdate () {
    this.setChildProps()
  },
  methods: {
    open () {
      if (!this.isOpen) {
        this.isOpen = true
        this.$emit('open')
      }
    },
    close () {
      if (this.isOpen) {
        this.isOpen = false
        this.$emit('close')
      }
    },
    toggle () {
      if (this.isOpen) this.close()
      else this.open()
    },
    setChildProps () {
      // Not yet ready ?
      if (!this.$slots.default) return
      // Manually add prop data to the items
      const items = []
      this.$slots.default.forEach(vnode => {
        if (vnode.componentOptions && vnode.tag) items.push(vnode.componentOptions.propsData)
      })
      const { startAngle, endAngle, offset, radius } = this
      const angle = endAngle - startAngle
      const angleStep = angle / Math.max((items.length - 1), 1)
      const angles = (items.length === 1
        ? [0.5 * angle * Math.PI / 180]
        : items.map(
          (item, index) => startAngle + (offset + angleStep * index) * Math.PI / 180
        ))

      items.forEach((propData, index) => {
        propData.left =
          -1 * (Math.cos(angles[index]) * radius) // -1 to have the items in the right order
        propData.top = -Math.sin(angles[index]) * radius
        if (this.closeOnClick) propData.handler = this.close // To prevent double emiting click event
      })
    }
  }
}
</script>

<style lang="scss">
  .vue-radial-menu-wrapper {
    position: relative;
    user-select: none;
    border-radius: 50%;
    font-size: 32px;
    font-weight: bold;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.24), 0 0 0 rgba(0, 0, 0, 0.16);
  }
  .vue-radial-menu-container {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    transition: all 0.2s ease;
    position: relative;
    z-index: 6;
  }
  .vue-radial-menu-container.open {
    transform: rotateZ(45deg);
  }
</style>
