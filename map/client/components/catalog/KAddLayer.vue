<template>
  <k-modal
    id="add-layer-modal"
    :title="$t('KAddLayer.TITLE')"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <div slot="modal-content">
      <q-tabs  align="justify" v-model="mode" inverted>
        <q-tab name="import" icon="las la-desktop" />
        <q-tab name="connect" icon="las la-plug" />
        <q-tab name="create" icon="las la-edit" />
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

export default {
  name: 'k-add-layer',
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
  },
  created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-create-layer'] = this.$load('catalog/KCreateLayer')
    this.$options.components['k-import-layer'] = this.$load('catalog/KImportLayer')
    this.$options.components['k-connect-layer'] = this.$load('catalog/KConnectLayer')
  }
}
</script>
