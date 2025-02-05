<template>
  <KModal
    id="features-table-modal"
    :title="title"
    widthPolicy="wide"
    :buttons="buttons"
    v-model="isModalOpened"
  >
    <KTable
      :service="service"
      :contextId="contextId"
      :schema="schema"
      :item-actions="actions"
      :base-query="layer.baseQuery"
    >
      <template v-slot:empty-section>
        <div class="absolute-center">
          <KStamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KTable.EMPTY_TABLE')" />
        </div>
      </template>
    </KTable>
  </KModal>
</template>

<script>
import _ from 'lodash'
import centroid from '@turf/centroid'
import { mixins as kCoreMixins, composables as kCoreComposables } from '../../../core/client'
import { KTable, KModal, KStamp } from '../../../core/client/components'

export default {
  inject: ['kActivity', 'selectedLayer'],
  components: {
    KTable,
    KModal,
    KStamp
  },
  mixins: [kCoreMixins.baseModal],
  props: {
    layerId: {
      type: String,
      default: ''
    },
    layerName: {
      type: String,
      default: ''
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
  computed: {
    title () {
      return this.$t('KFeaturesTable.TITLE') + ` ${this.layer.name}`
    },
    buttons () {
      return [
        { id: 'close-button', label: 'CLOSE', renderer: 'form-button', handler: () => this.closeModal() }
      ]
    },
    actions () {
      return [{
        id: 'zoom-to',
        tooltip: this.$t('mixins.activity.ZOOM_TO_LABEL'),
        icon: 'zoom_out_map',
        handler: (context) => {
          // Use altitude or zoom level depending on engine
          this.kActivity.center(..._.get(centroid(context.item), 'geometry.coordinates'), this.kActivity.is2D() ? 18 : 750)
          this.closeModal()
        }
      }]
    },
    schema () {
      return _.get(this.layer, 'schema.content')
    }
  },
  methods: {
    async openModal () {
      // If not injected load it
      if (this.layerName) this.layer = this.kActivity.getLayerByName(this.layerName)
      else this.layer = await this.$api.getService('catalog', this.contextId).get(this.layerId)
      this.service = _.get(this.layer, '_id') ? 'features' : 'features-edition'
      kCoreMixins.baseModal.methods.openModal.call(this, true)
    }
  },
  setup (props) {
    return {
      ...kCoreComposables.useCurrentActivity()
    }
  }
}
</script>
