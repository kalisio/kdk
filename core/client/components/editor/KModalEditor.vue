<template>
  <k-modal
    id="editor-modal"
    :title="editorTitle"
    :buttons="buttons"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
      <k-form 
        :ref="onFormReferenceCreated" 
        :schema="schema" 
      />
  </k-modal>
</template>

<script>
import { KModal, KScrollArea } from '../frame'
import { KForm } from '../form'
import { baseModal, service, objectProxy, schemaProxy, baseEditor } from '../../mixins'

export default {
  name: 'k-modal-editor',
  emits: ['opened', 'closed'],
  components: {
    KModal,
    KScrollArea,
    KForm
  },
  mixins: [
    baseEditor,
    baseModal,
    service,
    objectProxy,
    schemaProxy
  ],
  computed: {
    buttons () {
      let buttons = [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'apply-button', label: this.applyButton, renderer: 'form-button', handler: () => this.apply() }
      ]
      if (this.clearButton !== '') {
        buttons.push({
          id: 'clear-button', label: this.clearButton, renderer: 'form-button', outline: 'true', handler: () => this.clear()
        })
      }
      if (this.resetButton !== '') {
        buttons.push({
          id: 'reset-button', label: this.resetButton, renderer: 'form-button', outline: 'true', handler: () => this.reset()
        })
      }
      return buttons
    }
  },
  methods: {
    async apply () {
      if (await baseEditor.methods.apply.bind(this)()) this.closeModal()
    },
    openModal () {
      baseModal.methods.openModal.bind(this)()
      this.refresh()
    }
  }
}
</script>
