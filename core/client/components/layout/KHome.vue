<template>
  <div v-if="isAuthenticated">
    <KLayout />
  </div>
</template>

<script>
import _ from 'lodash'
import KLayout from './KLayout.vue'

export default {
  components: {
    KLayout
  },
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
    // Initialize the user if any
    this.refresh()
    this.$events.on('user-changed', this.refresh)
  },
  beforeUnmount () {
    this.$events.off('user-changed', this.refresh)
  }
}
</script>
