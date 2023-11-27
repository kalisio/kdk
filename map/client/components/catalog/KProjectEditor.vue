<template>
  <KModal
    id="project-editor-modal"
    :title="editorTitle"
    :buttons="buttons"
    v-model="isModalOpened"
  >
    <!-- Modal content -->
    <KForm
      :ref="onFormReferenceCreated"
      :schema="schema"
      @form-ready="onFormReady"
    />
  </KModal>
</template>

<script>
import { KModal } from '../../../../core/client/components'
import { KForm } from '../../../../core/client/components/form'
import { baseModal, service, objectProxy, schemaProxy, baseEditor } from '../../../../core/client/mixins'

export default {
  components: {
    KModal,
    KForm
  },
  mixins: [
    baseEditor,
    baseModal,
    service,
    objectProxy,
    schemaProxy
  ],
  props: {
    service: {
      type: String,
      default: 'projects'
    }
  },
  computed: {
    buttons () {
      const buttons = [
        {
          id: 'cancel-button',
          label: 'CANCEL',
          renderer: 'form-button',
          outline: true,
          disabled: this.processing,
          handler: () => this.closeModal()
        },
        {
          id: 'apply-button',
          label: this.applyButton,
          renderer: 'form-button',
          loading: this.processing,
          handler: () => this.apply()
        }
      ]
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
      // We at least needs a background layer
      // FIXME: how to do this as we only have IDs here
      /*
      const layers = this.form.values().layers
      if (!_.find(layers, { type: 'BaseLayer'})) {
        this.$notify({ type: 'negative', message: this.$t('KProjectEditor.BACKGROUND_LAYER_REQUIRED') })
        return
      }
      */
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
