<template>
  <k-modal
    id="modal-viewer"
    :title="viewerTitle" 
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <div slot="modal-content">
      <k-view :values="object" :schema="schema" />
    </div>
  </k-modal>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-modal-viewer',
  mixins: [
    mixins.baseViewer,
    mixins.baseModal,
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy
  ],
  methods: {
    async openModal () {
      await this.refresh()
      this.isModalOpened = true
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-view'] = this.$load('form/KView')
  }
}
</script>
