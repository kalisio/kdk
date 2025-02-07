<template>
  <k-modal
    id="project-manager-modal"
    :title="title"
    v-model="isModalOpened"
  >
    <div>
      <q-tabs align="justify" v-model="mode" inverted>
        <q-tab id="select-layers" name="select-layers" icon="las la-layer-group" v-if="modes.includes('select-layers')" />
        <q-tab id="select-views" name="select-views" icon="las la-star" v-if="modes.includes('select-views')" />
      </q-tabs>
      <div>
        <q-tab-panels v-model="mode" animated>
          <q-tab-panel name="select-layers" v-if="modes.includes('select-layers')">
            <Suspense><k-select-layers @done="closeModal" /></Suspense>
          </q-tab-panel>
          <q-tab-panel name="select-views" v-if="modes.includes('select-views')">
            <Suspense><k-select-views @done="closeModal" /></Suspense>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </k-modal>
</template>

<script>
import { mixins as kCoreMixins } from '../../../../core/client'
import { KModal } from '../../../../core/client/components'
import KSelectLayers from './KSelectLayers.vue'
import KSelectViews from './KSelectViews.vue'

export default {
  name: 'k-project-manager',
  components: {
    KModal,
    KSelectLayers,
    KSelectViews
  },
  mixins: [kCoreMixins.baseModal],
  props: {
    defaultMode: {
      type: String,
      default: 'select-layers'
    },
    modes: {
      type: Array,
      default: ['select-layers', 'select-views']
    }
  },
  data () {
    return {
      mode: this.defaultMode
    }
  }
}
</script>
