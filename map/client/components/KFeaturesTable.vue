<template>
  <k-modal
    id="features-table-modal"
    :title="title"
    :maximized="isModalMaximized"
    :buttons="buttons"
    v-model="isModalOpened"
  >
    <k-table
      service="features"
      :contextId="contextId"
      :schema-json="schema"
      :item-actions="actions"
      :base-query="layer.baseQuery"
      :style="`height: ${height}px; max-width: ${width}px;`">
      <template v-slot:empty-section>
        <div class="absolute-center">
          <k-stamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KTable.EMPTY_TABLE')" />
        </div>
      </template>
    </k-table>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import centroid from '@turf/centroid'
import { mixins as kCoreMixins } from '../../../core/client'
import { KTable, KModal, KStamp } from '../../../core/client/components'

export default {
  name: 'k-features-table',
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
    contextId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      layer: this.selectedLayer
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
        name: 'zoom-to',
        tooltip: this.$t('mixins.activity.ZOOM_TO_LABEL'),
        icon: 'zoom_out_map',
        handler: (context) => {
          // Use altitude or zoom level depending on engine
          this.kActivity.center(..._.get(centroid(context.item), 'geometry.coordinates'), this.kActivity.is2D() ? 18 : 750)
          this.closeModal()
        }
      }]
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
    async openModal () {
      // If not injected load it
      if (!this.layer) this.layer = await this.$api.getService('catalog').get(this.layerId)
      kCoreMixins.baseModal.methods.openModal.call(this, true)
    }
  }
}
</script>
