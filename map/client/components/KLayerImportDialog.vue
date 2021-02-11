<template>
  <k-modal ref="modal" :title="$t('KLayerImportDialog.TITLE')" :buttons="getButtons()" :toolbar="getToolbar()">
    <div slot="modal-content">
      <q-file for="file-input" v-model="pickedFile"
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
    getToolbar () {
      return [
        { id: 'close', tooltip: 'CLOSE', icon: 'las la-times', handler: () => { this.doCancel() } }
      ]
    },
    getButtons () {
      return [
        { id: 'import-button', label: 'KLayerImportDialog.IMPORT_BUTTON', color: 'primary', handler: () => this.doImport() }
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
