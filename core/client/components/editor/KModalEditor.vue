<template>
  <KModal
    id="editor-modal"
    :title="editorTitle"
    :buttons="buttons"
    v-model="isModalOpened"
  >
    <!-- Modal content -->
    <k-form
      :ref="onFormReferenceCreated"
      :schema="schema"
      @form-ready="onFormReady"
    />
  </KModal>
</template>

<script>
import { KModal, KScrollArea } from '../frame'
import { KForm } from '../form'
import { baseModal, service, objectProxy, schemaProxy, baseEditor } from '../../mixins'

export default {
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
      const buttons = [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', outline: true, disabled: this.processing,  handler: () => this.closeModal() },
        { id: 'apply-button', label: this.applyButton, renderer: 'form-button', loading: this.processing, handler: () => this.apply() }
      ]
      if (this.clearButton !== '') {
        buttons.push({
          id: 'clear-button', label: this.clearButton, renderer: 'form-button', outline: 'true', handler: () => this.clearEditor()
        })
      }
      if (this.resetButton !== '') {
        buttons.push({
          id: 'reset-button', label: this.resetButton, renderer: 'form-button', outline: 'true', handler: () => this.resetEditor()
        })
      }
      return buttons
    }
  },
  data () {
    return {
      processing: false
    }
  },
  methods: {
    async apply () {
      this.processing = true
      if (await baseEditor.methods.apply.call(this)) {
        this.processing = false
        this.closeModal()
      }
      this.processing = false
    },
    async openModal () {
      await this.refresh()
      baseModal.methods.openModal.call(this)
    }
  }
}
</script>
