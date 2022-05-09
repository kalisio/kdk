<template>
  <div class="column justify-center full-width">
    <k-view ref="view" :values="object" :schema="schema" />
  </div>
</template>

<script>
import { baseViewer, service, objectProxy, schemaProxy } from '../../mixins'

export default {
  name: 'k-viewer',
  mixins: [
    baseViewer,
    service,
    objectProxy,
    schemaProxy
  ],
  created () {
    // Load the required components
    this.$options.components['k-view'] = this.$load('form/KView')
    // Refresh the view
    this.refresh()
  }
}
</script>
