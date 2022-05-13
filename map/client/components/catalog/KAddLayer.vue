<template>
  <k-modal
    id="add-layer-modal"
    :title="$t('KAddLayer.TITLE')"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')"
  >
    <div>
      <q-tabs  align="justify" v-model="mode" inverted>
        <q-tab id="import-layer" name="import" icon="las la-desktop" />
        <q-tab id="connect-layer" name="connect" icon="las la-plug" />
        <q-tab id="create-layer" name="create" icon="las la-edit" />
      </q-tabs>
      <div>
        <q-tab-panels v-model="mode" animated>
          <q-tab-panel name="import">
           <k-import-layer @done="closeModal" />
          </q-tab-panel>
          <q-tab-panel name="connect">
            <k-connect-layer @done="closeModal" />
          </q-tab-panel>
          <q-tab-panel name="create">
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
    contextId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      mode: 'import'
    }
  }
}
</script>
