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
import _ from 'lodash'
import { mixins as kCoreMixins, composables as kCoreComposables } from '../../../core/client'
import { KModalEditor } from '../../../core/client/components'

export default {
  name: 'k-feature-editor',
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
    layerName: {
      type: String,
      default: ''
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
      layer: {}
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
        await this.kActivity.editFeaturesProperties(updatedFeature, this.layer)
      } else {
        await this.$api.getService(this.service).patch(updatedFeature._id, _.pick(updatedFeature, ['properties']))
      }
    },
    loadLayerSchema () {
      return _.get(this.layer, 'schema.content')
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
    if (this.layerName) this.layer = this.kActivity.getLayerByName(this.layerName)
    else this.layer = await this.$api.getService('catalog', this.contextId).get(this.layerId)
    this.service = _.get(this.layer, '_id') ? _.get(this.layer, 'service') : 'features-edition'
  },
  setup (props) {
    return {
      ...kCoreComposables.useCurrentActivity()
    }
  }
}
</script>
