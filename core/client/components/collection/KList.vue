<template>
  <div>
    <div v-if="items.length > 0" class="row">
      <div class="col-12">
        <q-list highlight separator>
          <template v-for="item in items">
            <component :id="'item-' + item._id" :key="item._id" :item="item" :contextId="contextId" :is="renderer.component" v-bind="renderer" @item-selected="onItemSelected" />
          </template>
        </q-list>
      </div>
      <div v-if="nbPages > 1" class="col-12">
        <div class="row justify-center">
          <q-pagination v-model="currentPage" :max="nbPages" @input="onPageChanged" :input="true" />
        </div>
      </div>
    </div>
    <div v-else class="absolute-center">
      <slot id="empty-list" name="empty-list">
        <k-label :text="$t('KList.EMPTY_LIST')" icon-size="3rem" />
      </slot>
    </div>
  </div>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-list',
  mixins: [
    mixins.service,
    mixins.baseCollection
  ],
  props: {
    renderer: {
      type: Object,
      default: () => {
        return {
          component: 'collection/KItem'
        }
      }
    },
    baseQuery: {
      type: Object,
      default: function () {
        return {}
      }
    },
    filterQuery: {
      type: Object,
      default: function () {
        return {}
      }
    },
    listStrategy: {
      type: String
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshCollection()
    },
    baseQuery: function () {
      this.refreshCollection()
      this.currentPage = 1
    },
    filterQuery: function () {
      this.refreshCollection()
      this.currentPage = 1
    }
  },
  methods: {
    getCollectionBaseQuery () {
      return this.baseQuery
    },
    getCollectionFilterQuery () {
      return this.filterQuery
    }
  },
  created () {
    // Load the component
    this.$options.components[this.renderer.component] = this.$load(this.renderer.component)
    this.$options.components['k-label'] = this.$load('frame/KLabel')
    // Force the collection to be refreshed
    this.refreshCollection()
    // Whenever the user abilities are updated, update collection as well
    this.$events.$on('user-abilities-changed', this.refreshCollection)
  },
  beforeDestroy () {
    this.$events.$off('user-abilities-changed', this.refreshCollection)
  }
}
</script>
