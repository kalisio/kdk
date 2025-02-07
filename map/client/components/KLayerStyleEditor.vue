<template>
  <k-modal
    id="layer-style-modal"
    :title="$t('KLayerStyleEditor.EDIT_LAYER_STYLE_TITLE')"
    :buttons="buttons"
    :options="{}"
    v-model="isModalOpened">
    <div>
      <k-layer-style-form :class="{ 'light-dimmed': inProgress }" :ref="onFormCreated"
        :options="options" :layer="layer" :is3D="is3D"/>
      <q-spinner-cube color="primary" class="fixed-center" v-if="inProgress" size="4em"/>
    </div>
  </k-modal>
</template>

<script>
import logger from 'loglevel'
import _ from 'lodash'
import config from 'config'
import { mixins as kCoreMixins, composables as kCoreComposables } from '../../../core/client'
import { KModal } from '../../../core/client/components'
import KLayerStyleForm from './KLayerStyleForm.vue'

export default {
  name: 'k-layer-style-editor',
  components: {
    KModal,
    KLayerStyleForm
  },
  emits: [
    'applied'
  ],
  mixins: [
    kCoreMixins.baseModal
  ],
  props: {
    layerId: {
      type: String,
      default: ''
    },
    layerName: {
      type: String,
      default: ''
    }
  },
  computed: {
    buttons () {
      return [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'apply-button', label: 'APPLY', renderer: 'form-button', handler: () => this.onApply() }
      ]
    },
    options () {
      return this.kActivity.activityOptions.engine
    },
    is3D () {
      return this.kActivity.is3D()
    }
  },
  data () {
    return {
      layer: {},
      inProgress: false
    }
  },
  methods: {
    onFormCreated (ref) {
      if (ref && !this.form) {
        this.form = ref
        // Pick engine-based and generic styling options
        this.form.fill(_.pick(this.layer, ['leaflet', 'cesium', 'isSelectable']))
      }
    },
    async onApply () {
      const result = this.form.validate()
      if (!result.isValid) return
      this.inProgress = true
      // If saved layer update it in DB
      if (this.layer._id) {
        try {
          await this.$api.getService('catalog').patch(this.layer._id, result.values)
        } catch (error) {
          // User error message on operation should be raised by error hook, otherwise this is more a coding error
          logger.error(error)
        }
      }
      // Update in memory
      _.forOwn(result.values, (value, key) => _.set(this.layer, key, value))
      // Actual layer update should be triggerred by real-time event
      // but as we might have in-memory only layer or not always use sockets we should perform it explicitely in this case
      if (!this.layer._id || (config.transport !== 'websocket')) {
        // Keep track of data as we will reset the layer
        const geoJson = await this.kActivity.toGeoJson(this.layer.name)
        // Reset layer with new setup
        await this.kActivity.resetLayer(this.layer)
        // Update data only when in memory as reset has lost it
        if (!this.layer._id) {
          this.kActivity.updateLayer(this.layer.name, geoJson)
        }
      }
      this.inProgress = false
      this.closeModal()
    },
    async openModal () {
      // If not injected load it
      if (this.layerName) this.layer = this.kActivity.getLayerByName(this.layerName)
      else this.layer = await this.$api.getService('catalog').get(this.layerId)
      kCoreMixins.baseModal.methods.openModal.call(this)
    }
  },
  setup (props) {
    return {
      ...kCoreComposables.useCurrentActivity()
    }
  }
}
</script>
