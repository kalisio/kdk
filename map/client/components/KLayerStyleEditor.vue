<template>
  <k-modal
    id="layer-style-modal"
    :title="$t('KLayerStyleEditor.EDIT_LAYER_STYLE_TITLE')"
    :buttons="buttons"
    :options="{}"
    v-model="isModalOpened">
    <div>
      <k-layer-style-form :class="{ 'light-dimmed': inProgress }" :ref="onFormCreated"
        :options="options" :layer="layer"/>
      <q-spinner-cube color="primary" class="fixed-center" v-if="inProgress" size="4em"/>
    </div>
  </k-modal>
</template>

<script>
import logger from 'loglevel'
import _ from 'lodash'
import { mixins as kCoreMixins } from '../../../core/client'
import { KModal } from '../../../core/client/components'
import KLayerStyleForm from './KLayerStyleForm.vue'

export default {
  name: 'k-layer-style-editor',
  inject: ['kActivity'],
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
      required: true
    },
    contextId: {
      type: String,
      default: ''
    },
    options: { // Contains default style options
      type: Object,
      required: true
    }
  },
  computed: {
    buttons () {
      return [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'apply-button', label: 'APPLY', renderer: 'form-button', handler: () => this.onApply() }
      ]
    }
  },
  data () {
    return {
      inProgress: false,
      layer: {}
    }
  },
  methods: {
    onFormCreated (ref) {
      if (ref && !this.form) {
        this.form = ref
        // Pick engine-based and generic styling options
        this.form.fill(_.pick(this.layer, ['leaflet', 'isSelectable']))
      }
    },
    async onApply () {
      const result = this.$refs.form.validate()
      if (!result.isValid) return
      this.inProgress = true
      // If saved layer update it in DB
      if (this.layer._id) {
        try {
          await this.$api.getService('catalog', this.contextId).patch(this.layer._id, result.values)
        } catch (error) {
          // User error message on operation should be raised by error hook, otherwise this is more a coding error
          logger.error(error)
        }
      }
      // FIXME: Actual layer update should be triggerred by real-time event
      // but as we might not always use sockets we should perform it explicitely in this case
      this.inProgress = false
      this.closeModal()
    },
    async openModal () {
      this.layer = await this.$api.getService('catalog').get(this.layerId)
      kCoreMixins.baseModal.methods.openModal.call(this)
    }
  }
}
</script>
