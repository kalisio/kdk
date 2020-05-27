<template>
  <div v-if="isAuthenticated">
    <k-layout  />
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-home',
  data () {
    return {
      isAuthenticated: false
    }
  },
  methods: {
    refresh () {
      this.isAuthenticated = !_.isNil(this.$store.get('user'))
    }
  },
  created () {
    // load the layout component
    this.$options.components['k-layout'] = this.$load('layout/KLayout')
    // Initialize the user if any
    this.refresh()
    this.$events.$on('user-changed', this.refresh)
  },
  beforeDestroy () {
    this.$events.$off('user-changed', this.refresh)
  }
}
</script>
