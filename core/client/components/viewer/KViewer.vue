<template>
  <div class="column justify-center full-width">
    <KView
      ref="view"
      :values="object"
      :schema="schema"
    />
  </div>
</template>

<script>
import KView from '../form/KView.vue'
import { baseViewer, service, objectProxy, schemaProxy } from '../../mixins'

export default {
  components: {
    KView
  },
  mixins: [
    baseViewer,
    service,
    objectProxy,
    schemaProxy
  ],
  created () {
    // Refresh the view
    this.refresh()
  }
}
</script>
