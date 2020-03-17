<template>
  <k-modal ref="modal" :title="title" :toolbar="toolbar" :buttons="[]" >
    <div slot="modal-content">
      <k-table service="features" :contextId="contextId" :schema-json="schema" :item-actions="featureActions" :base-query="baseQuery" />
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '../../../core/client'

export default {
  name: 'k-features-table',
  components: {
  },
  mixins: [
    kCoreMixins.refsResolver(['modal'])
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
    },
    baseQuery () {
      return { layer: this.layer._id }
    }
  },
  data () {
    return {
      toolbar: [{ name: 'close', icon: 'close', handler: () => this.close() }]
    }
  },
  methods: {
    async open () {
      await this.loadRefs()
      this.$refs.modal.openMaximized()
    },
    close () {
      this.$refs.modal.close()
      this.$emit('closed')
    }
  },
  created () {
    // laod the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-table'] = this.$load('collection/KTable')
  },
  beforeDestroy () {

  }
}
</script>
