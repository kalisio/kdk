<template>
  <k-modal
    id="modal-viewer"
    :title="viewerTitle"
    :buttons="getButtons()"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')"
  >
    <k-view :values="object" :schema="schema" />
  </k-modal>
</template>

<script>
import { KModal, KScrollArea } from '../frame'
import { KView } from '../form'
import { baseViewer, baseModal, service, objectProxy, schemaProxy } from '../../mixins'

export default {
  name: 'k-modal-viewer',
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
