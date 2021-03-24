<template>
  <k-modal 
    id="editor-modal"
    :title="editorTitle" 
    :buttons="buttons" 
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <div slot="modal-content">
      <k-form :class="{ 'light-dimmed': applyInProgress }" ref="form" :schema="schema" @field-changed="onFieldChanged" />
      <q-spinner-cube color="primary" class="fixed-center" v-if="applyInProgress" size="4em" />
    </div>
  </k-modal>
</template>

<script>
import { KModal } from '../frame'
import { KForm } from '../form'
import mixins from '../../mixins'

export default {
  name: 'k-modal-editor',
  components: {
    KModal,
    KForm
  },
  mixins: [
    mixins.baseEditor(['form']),
    mixins.refsResolver(['form']),
    mixins.baseModal,
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy
  ],
  computed: {
    buttons () {
      const buttons = [{
        id: 'apply-button', label: this.applyButton, renderer: 'form-button', handler: () => this.apply()
      }]
      if (this.clearButton !== '') {
        buttons.push({
          id: 'clear-button', label: this.clearButton, renderer: 'form-button', outline: 'true', handler: () => this.clear()
        })
      }
      if (this.resetButton !== '') {
        buttons.push({
          id: 'reset-button', label: this.resetButton,renderer: 'form-button', outline: 'true', handler: () => this.reset()
        })
      }
      return buttons
    }
  },
  methods: {
    openModal () {
      this.refresh()
      this.isModalOpened = true
    },
    onFieldChanged (field, value) {
      this.$emit('field-changed', field, value)
    }
  },
  created () {
    // Catch applied event
    this.$on('applied', this.closeModal)
  },
  beforeDestroy () {
    // Remove event connections
    this.$off('applied', this.closeModal)
  }
}
</script>
