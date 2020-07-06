<template>
  <k-modal ref="modal" :title="$t('KLayerImportDialog.TITLE')" :buttons="getButtons()">
    <div slot="modal-content">
      <q-file v-model="pickedFile"
        clearable counter
        :counter-label="counterLabel"
        :accept="accept"
        :label="$t('KLayerImportDialog.INPUT_HINT')" />
    </div>
  </k-modal>
</template>

<script>
import { QFile } from 'quasar'
import { KModal } from '../../../core/client/components/frame'

export default {
  name: 'k-layer-import-dialog',
  components: {
    KModal,
    QFile
  },
  props: {
    accept: {
      type: String,
      default: '.json,.geojson,application/json,application/geo+json'
    }
  },
  data () {
    return {
      pickedFile: null
    }
  },
  methods: {
    getButtons () {
      return [
        { name: 'import-button', label: this.$t('KLayerImportDialog.IMPORT_BUTTON'), color: 'primary', handler: () => this.doImport() },
        { name: 'cancel-button', label: this.$t('KLayerImportDialog.CANCEL_BUTTON'), color: 'primary', handler: () => this.doCancel() }
      ]
    },
    counterLabel ({ totalSize, filesNumber, maxFiles }) {
      return totalSize
    },
    open () {
      this.$refs.modal.open()
    },
    doCancel () {
      this.pickedFile = null
      this.$refs.modal.close()
    },
    doImport () {
      this.$refs.modal.close()
      if (this.pickedFile) {
        this.$emit('imported', this.pickedFile)
      }
    }
  }
}
</script>
