<template>
  <k-modal
    id="add-layer-modal"
    :title="$t('KAddLayer.TITLE')"
    v-model="isModalOpened"
  >
    <div>
      <q-tabs align="justify" v-model="mode" inverted>
        <q-tab id="select-layer" name="select" icon="las la-project-diagram" v-if="modes.includes('select') && projectId" />
        <q-tab id="import-layer" name="import" icon="las la-desktop" v-if="modes.includes('import')" />
        <q-tab id="connect-layer" name="connect" icon="las la-plug" v-if="modes.includes('connect')" />
        <q-tab id="create-layer" name="create" icon="las la-edit" v-if="modes.includes('create')" />
      </q-tabs>
      <div>
        <q-tab-panels v-model="mode" animated>
          <q-tab-panel name="select" v-if="modes.includes('select')" :contextId="contextId">
           <k-select-layers @done="closeModal" />
          </q-tab-panel>
          <q-tab-panel name="import" v-if="modes.includes('import')">
           <k-import-layer @done="closeModal" />
          </q-tab-panel>
          <q-tab-panel name="connect" v-if="modes.includes('connect')">
            <k-connect-layer @done="closeModal" />
          </q-tab-panel>
          <q-tab-panel name="create" v-if="modes.includes('create')">
           <k-create-layer @done="closeModal" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </k-modal>
</template>

<script>
import { mixins as kCoreMixins } from '../../../../core/client'
import { KModal } from '../../../../core/client/components'
import { useProject } from '../../composables'
import KSelectLayers from './KSelectLayers.vue'
import KCreateLayer from './KCreateLayer.vue'
import KImportLayer from './KImportLayer.vue'
import KConnectLayer from './KConnectLayer.vue'

export default {
  name: 'k-add-layer',
  components: {
    KModal,
    KSelectLayers,
    KCreateLayer,
    KImportLayer,
    KConnectLayer
  },
  mixins: [kCoreMixins.baseModal],
  props: {
    contextId: {
      type: String,
      default: ''
    },
    defaultMode: {
      type: String,
      default: 'import'
    },
    defaultProjectMode: {
      type: String,
      default: 'select'
    },
    modes: {
      type: Array,
      default: ['select', 'import', 'connect', 'create']
    }
  },
  data () {
    return {
      mode: this.defaultMode
    }
  },
  mounted () {
    if (this.hasProject()) this.mode = this.defaultProjectMode
  },
  setup (props) {
    // Expose
    return {
      ...useProject({ contextId: props.contextId })
    }
  }
}
</script>
