<template>
  <div v-if="items.length > 0" class="q-pa-sm column">
    <q-scroll-area :style="`height: ${height}`" @scroll="onScroll">
      <template v-for="item in items">
        <component
          class="q-pl-sm q-pr-md q-pt-sm q-pb-sm"
          :key="item._id"
          :id="item._id"
          :service="service"
          :item="item"
          :contextId="contextId"
          :is="renderer.component"
          v-bind="renderer"
          @item-selected="onItemSelected" />
      </template>
    </q-scroll-area>
  </div>
  <div v-else>
    <slot name="empty-section">
      <div class="row justify-center">
        <k-stamp 
          icon="las la-exclamation-circle" 
          icon-size="1.6rem" 
          :text="$t('KColumn.EMPTY_COLUMN')" 
          direction="horizontal" />
      </div>
    </slot>
  </div>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-grid',
  mixins: [
    mixins.service,
    mixins.baseCollection
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
      type: String,
      default: 'smart'
    },
    height: {
      type: String,
      default: '80vh'
    }
  },
  watch: {
    $route (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshCollection()
    },
    baseQuery ()  {
      this.items = []
      this.currentPage = 1
      this.refreshCollection()
    },
    filterQuery () {
      this.items = []
      this.currentPage = 1
      this.refreshCollection()
    }
  },
  methods: {
    getCollectionBaseQuery () {
      return this.baseQuery
    },
    getCollectionFilterQuery () {
      return this.filterQuery
    },
    onScroll (info) {
      if (info.verticalPercentage > 0.9) {
        if (this.items.length < this.nbTotalItems) {
          this.currentPage++
          this.refreshCollection()
        }
      }
    }
  },
  beforeCreate () {
    // Load the component
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  },
  created () {
    // Load the component
    this.$options.components[this.renderer.component] = this.$load(this.renderer.component)
    // Whenever the user abilities are updated, update collection as well
    this.$events.$on('user-abilities-changed', this.refreshCollection)
  },
  beforeDestroy () {
    this.$events.$off('user-abilities-changed', this.refreshCollection)
  }
}
</script>
