<template>
  <k-modal
    id="add-layer-modal"
    v-model="isModalOpened"
  >
    <div>
      <q-tabs align="justify" v-model="mode" inverted>
        <q-tab id="import-layer" name="import" icon="las la-desktop" v-if="modes.includes('import')" />
        <q-tab id="connect-layer" name="connect" icon="las la-plug" v-if="modes.includes('connect')" />
        <q-tab id="create-layer" name="create" icon="las la-edit" v-if="modes.includes('create')" />
      </q-tabs>
      <div>
        <q-tab-panels v-model="mode" animated>
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
import KCreateLayer from './KCreateLayer.vue'
import KImportLayer from './KImportLayer.vue'
import KConnectLayer from './KConnectLayer.vue'

export default {
  name: 'k-add-layer',
  components: {
    KModal,
    KCreateLayer,
    KImportLayer,
    KConnectLayer
  },
  mixins: [kCoreMixins.baseModal],
  props: {
    defaultMode: {
      type: String,
      default: 'import'
    },
    modes: {
      type: Array,
      default: ['import', 'connect', 'create']
    }
  },
  data () {
    return {
      mode: this.defaultMode
    }
  }
}
</script>
