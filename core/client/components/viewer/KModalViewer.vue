<template>
  <KModal
    id="modal-viewer"
    :title="viewerTitle"
    :buttons="getButtons()"
    v-model="isModalOpened"
  >
    <!-- Modal content -->
    <KView
      :values="object"
      :schema="schema"
    />
  </KModal>
</template>

<script>
import { KModal, KScrollArea } from '../frame'
import { KView } from '../form'
import { baseViewer, baseModal, service, objectProxy, schemaProxy } from '../../mixins'

export default {
  components: {
    KModal,
    KScrollArea,
    KView
  },
  mixins: [
    baseViewer,
    baseModal,
    service,
    objectProxy,
    schemaProxy
  ],
  methods: {
    getButtons () {
      return [
        { id: 'close-button', label: 'CLOSE', renderer: 'form-button', handler: () => this.closeModal() }
      ]
    },
    async openModal () {
      await this.refresh()
      this.isModalOpened = true
    }
  }
}
</script>
