<template>
  <div v-if="items.length > 0" class="q-pa-sm row">
    <template v-for="item in items" :key="item._id">
      <div :class="getItemClass()">
        <component
          :id="item._id"
          :service="service"
          :item="item"
          :contextId="contextId"
          :is="rendererComponent"
          v-bind="renderer"
          @item-selected="onItemSelected" />
      </div>
    </template>
    <div v-if="nbPages > 1" class="col-12">
      <q-pagination
        class="justify-center q-ma-md"
        v-model="currentPage"
        :max="nbPages"
        :input="true"
        @update:model-value="onPageChanged"
      />
    </div>
  </div>
  <div v-else>
    <slot name="empty-section">
      <div class="row justify-center">
        <KStamp icon="las la-exclamation-circle" icon-size="1.6rem" :text="$t('KGrid.EMPTY_GRID')" direction="horizontal" />
      </div>
    </slot>
  </div>
</template>

<script>
import KStamp from '../KStamp.vue'
import { service, baseCollection } from '../../mixins'
import { loadComponent } from '../../utils'

export default {
  components: {
    KStamp
  },
  mixins: [
    service,
    baseCollection
  ],
  props: {
    renderer: {
      type: Object,
      default: () => {
        return {
          component: 'collection/KCard'
        }
      }
    },
    baseQuery: {
      type: Object,
      default: () => {}
    },
    filterQuery: {
      type: Object,
      default: () => {}
    },
    listStrategy: {
      type: String
    }
  },
  computed: {
    rendererComponent () {
      return loadComponent(this.renderer.component)
    }
  },
  watch: {
    baseQuery: function () {
      this.resetCollection()
    },
    filterQuery: function () {
      this.resetCollection()
    }
  },
  methods: {
    getItemClass () {
      return this.renderer.class || 'q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2'
    },
    getCollectionBaseQuery () {
      return this.baseQuery
    },
    getCollectionFilterQuery () {
      return this.filterQuery
    }
  },
  created () {
    // Refresh collection
    this.refreshCollection()
    // Whenever the user abilities are updated, update collection as well
    this.$events.on('user-abilities-changed', this.refreshCollection)
  },
  beforeUnmount () {
    this.$events.off('user-abilities-changed', this.refreshCollection)
  }
}
</script>
