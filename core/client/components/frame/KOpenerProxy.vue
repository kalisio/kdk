<template>
  <div v-bind:class="{
    'row items-center no-wrap': position === 'left' || position === 'right',
    'column items-center': position === 'bottom' || position === 'top'
    }"
  >
    <k-opener v-if="position === 'right' || position === 'bottom'" v-model="isOpened" :position="position" :color="color" />
    <component v-if="isOpened" :is="componentKey" />
    <k-opener v-if="position === 'left' || position === 'top'" v-model="isOpened" :position="position" :color="color" />
  </div>
</template>

<script>
import path from 'path'
import _ from 'lodash'

export default {
  name: 'k-opener-proxy',
  props: {
    component: {
      type: String,
      required: true
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
      default: 'secondary'
    },
    opened: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      componentKey: undefined,
      isOpened: false
    }
  },
  created () {
    // Initialize data
    this.componentKey = _.kebabCase(path.basename(this.component))
    this.isOpened = this.opened
    // Load the required components
    this.$options.components['k-opener'] = this.$load('frame/KOpener')
    this.$options.components[this.componentKey] = this.$load(this.component)
  }
}
</script>
