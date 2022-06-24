<template>
  <KModalEditor
    id="layer-editor"
    :router-mode="false"
    :ref="onEditorCreated"
    :service="service"
    perspective="properties"
    :objectId="featureId"
    :contextId="contextId"
    :schema-function="loadLayerSchema"
    @applied="onFeatureEdited"
    @closed="closeModal()"
  />
</template>

<script>
import config from 'config'
import { mixins as kCoreMixins } from '../../../core/client'
import { updatePropertiesSchema } from '../utils.js'
import { KModalEditor } from '../../../core/client/components'

export default {
  name: 'k-feature-editor',
  inject: ['kActivity', 'selectedLayer'],
  components: {
    KModalEditor
  },
  mixins: [
    kCoreMixins.baseModal
  ],
  props: {
    layerId: {
      type: String,
      required: true
    },
    featureId: {
      type: String,
      required: true
    },
    contextId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      service: 'features',
      layer: this.selectedLayer
    }
  },
  methods: {
    onEditorCreated (ref) {
      if (ref && !this.editor) {
        this.editor = ref
        if (this.isModalOpened) this.openModal()
      }
    },
    async onFeatureEdited (updatedFeature) {
      // Save in DB or in memory
      if (this.layer._id) {
        await this.kActivity.editFeaturesProperties(updatedFeature)
      } else {
        await this.$api.getService('features-edition').patch(updatedFeature._id, _.pick(updatedFeature, ['properties']))
      }
    },
    async loadLayerSchema () {
      return updatePropertiesSchema(_.get(this.layer, 'schema.content'))
    },
    async openModal () {
      kCoreMixins.baseModal.methods.openModal.call(this)
      if (this.editor) this.editor.openModal()
    },
    async closeModal () {
      kCoreMixins.baseModal.methods.closeModal.call(this)
    }
  },
  async created () {
    // If not injected load it
    if (!this.layer) this.layer = await this.$api.getService('catalog').get(this.layerId)
    this.service = _.get(this.layer, '_id') ? 'features' : 'features-edition'
  }
}
</script>
