<template>
  <k-modal 
    id="features-table-modal"
    :title="title"  
    :maximized="isModalMaximized"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <div slot="modal-content">
      <k-table service="features" :contextId="contextId" :schema-json="schema" :item-actions="featureActions" :base-query="layer.baseQuery" />
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '../../../core/client'

export default {
  name: 'k-features-table',
  mixins: [kCoreMixins.baseModal],
  props: {
    layer: {
      type: Object,
      required: true
    },
    contextId: {
      type: String,
      default: ''
    },
    featureActions: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed: {
    title () {
      return this.$t('KFeaturesTable.TITLE', { layer: this.layer.name })
    },
    schema () {
      return JSON.stringify(_.get(this.layer, 'schema.content'))
    }
  },
  methods: {
    open () {
      this.openModal(true)
    }
  },
  created () {
    // laod the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-table'] = this.$load('collection/KTable')
  }
}
</script>
