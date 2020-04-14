<template>
  <k-modal ref="modal"
    :title="$t('KLayerStyleEditor.EDIT_LAYER_STYLE_TITLE')"
    :toolbar="toolbar"
    :buttons="[]"
    :options="{}" :route="false">
    <div slot="modal-content">
      <k-layer-style-form :class="{ 'light-dimmed': inProgress }" ref="form"
        :options="options" :layer="layer"/>
      <div class="row justify-end" style="padding: 12px">
        <q-btn id="apply-button" color="primary" flat :label="$t('APPLY')" @click="onApply"/>
      </div>
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
    kCoreMixins.refsResolver()
  ],
  props: {
    layer: { type: Object, required: true },
    contextId: { type: String, default: '' },
    options: { type: Object, required: true } // Contains default style options
  },
  data () {
    return {
      toolbar: [{ name: 'close-action', label: this.$i18n.t('CLOSE'), icon: 'close', handler: () => this.close() }],
      inProgress: false
    }
  },
  methods: {
    async open () {
      if (!this.$refs.modal) {
        this.setRefs(['modal'])
        await this.loadRefs()
      }
      this.$refs.modal.open()
      if (!this.$refs.form) {
        this.setRefs(['form'])
        await this.loadRefs()
      }
      this.$refs.form.fill(_.pick(this.layer, ['leaflet']))
    },
    close () {
      this.$refs.modal.close()
      this.$emit('closed')
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
  created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-layer-style-form'] = this.$load('KLayerStyleForm')
  }
}
</script>
