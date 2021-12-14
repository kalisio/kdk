<template>
  <k-modal ref="modal"
    id="layer-style-modal"
    :title="$t('KLayerStyleEditor.EDIT_LAYER_STYLE_TITLE')"
    :buttons="buttons"
    :options="{}"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <div slot="modal-content">
      <k-layer-style-form :class="{ 'light-dimmed': inProgress }" ref="form"
        :options="options" :layer="layer"/>
      <q-spinner-cube color="primary" class="fixed-center" v-if="inProgress" size="4em"/>
    </div>
  </k-modal>
</template>

<script>
import logger from 'loglevel'
import _ from 'lodash'
import { mixins as kCoreMixins } from '../../../core/client'

export default {
  name: 'k-layer-style-editor',
  mixins: [
    kCoreMixins.baseModal,
    kCoreMixins.refsResolver()
  ],
  props: {
    layer: {
      type: Object,
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
      inProgress: false
    }
  },
  methods: {
    async open () {
      if (!this.$refs.modal) {
        this.setRefs(['modal'])
        await this.loadRefs()
      }
      this.openModal()
      if (!this.$refs.form) {
        this.setRefs(['form'])
        await this.loadRefs()
      }
      // Pick engine-based and generic styling options
      this.$refs.form.fill(_.pick(this.layer, ['leaflet', 'isSelectable']))
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
      // Update in memory
      _.forOwn(result.values, (value, key) => _.set(this.layer, key, value))
      this.inProgress = false
      this.$emit('applied')
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-layer-style-form'] = this.$load('KLayerStyleForm')
  }
}
</script>
