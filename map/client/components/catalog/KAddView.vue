<template>
  <k-modal
    id="add-view-modal"
    :title="title"
    v-model="isModalOpened"
  >
    <div>
      <q-tabs v-if="projectId" align="justify" v-model="mode" inverted>
        <q-tab id="select-view" name="select" icon="las la-project-diagram" v-if="modes.includes('select')" />
        <q-tab id="create-view" name="create" icon="las la-edit" v-if="modes.includes('create')" />
      </q-tabs>
      <div>
        <q-tab-panels v-model="mode" animated>
          <q-tab-panel name="select" v-if="modes.includes('select')" :contextId="contextId">
            <Suspense><k-select-views :contextId="contextId" @done="closeModal" /></Suspense>
          </q-tab-panel>
          <q-tab-panel name="create" v-if="modes.includes('create')" :contextId="contextId">
            <k-create-view @done="closeModal" />
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
import KSelectViews from './KSelectViews.vue'
import KCreateView from './KCreateView.vue'

export default {
  name: 'k-add-view',
  components: {
    KModal,
    KSelectViews,
    KCreateView
  },
  mixins: [kCoreMixins.baseModal],
  props: {
    contextId: {
      type: String,
      default: ''
    },
    defaultMode: {
      type: String,
      default: 'create'
    },
    defaultProjectMode: {
      type: String,
      default: 'select'
    },
    modes: {
      type: Array,
      default: ['select', 'create']
    }
  },
  data () {
    return {
      mode: this.defaultMode
    }
  },
  computed: {
    title () {
      if (this.hasProject()) {
        return (this.mode === 'select' ? this.$t('KAddView.PROJECT_TITLE') : this.$t('KAddView.TITLE'))
      } else {
        return this.$t('KAddView.TITLE')
      }
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
