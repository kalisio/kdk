<template>
  <div class="column justify-center full-width">
    <k-view ref="view" :schema="schema" />
  </div>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-viewer',
  mixins: [
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy,
    mixins.baseViewer(['view']),
    mixins.refsResolver(['view'])
  ],
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refresh()
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-view'] = this.$load('form/KView')
    // Refresh the view
    this.refresh()
  }
}
</script>
