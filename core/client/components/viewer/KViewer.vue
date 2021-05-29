<template>
  <div class="column justify-center full-width">
    <k-view ref="view" :values="object" :schema="schema" />
  </div>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-viewer',
  mixins: [
    mixins.baseViewer,
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy
  ],
  watch: {
    $route (to, from) {
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
