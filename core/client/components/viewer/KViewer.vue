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
  created () {
    // Load the required components
    this.$options.components['k-view'] = this.$load('form/KView')
    // Refresh the view
    this.refresh()
  }
}
</script>
