<template>
  <k-modal
    id="features-table-modal"
    :title="title"
    :maximized="isModalMaximized"
    :buttons="buttons"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <div slot="modal-content">
      <k-table 
        service="features" 
        :contextId="contextId" 
        :schema-json="schema" 
        :item-actions="featureActions" 
        :base-query="layer.baseQuery"
        :style="`height: ${height}px; max-width: ${width}px;`">
        <template slot="empty-section">
          <div class="absolute-center">
            <k-stamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KTable.EMPTY_TABLE')" />
          </div>
        </template>
      </k-table>
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
    buttons () {
      return [
        { id: 'close-button', label: 'CLOSE', renderer: 'form-button', handler: () => this.closeModal() },
      ]
    },
    width () {
      return this.$q.screen.width - 50
    },
    height () {
      return this.$q.screen.height - 80
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
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  }
}
</script>
