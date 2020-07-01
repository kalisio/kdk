<template>
  <div>
    <div v-if="items.length > 0">
      <q-timeline ref="timeline" color="secondary" :layout="layout()">
        <q-infinite-scroll ref="scroll" @load="onScroll" :offset="50">
          <template v-for="item in items">
            <component
              class="row justify-center"
              :key="item._id" :id="'item-' + item._id"
              :item="item"
              :contextId="contextId"
              :is="renderer.component"
              v-bind="renderer.props"
              item-selected="onItemSelected(item)" />
          </template>
        </q-infinite-scroll>
      </q-timeline>
     </div>
    <div v-else class="absolute-center">
      <k-label :text="$t('KHistory.EMPTY_HISTORY')" icon-size="48px" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { QInfiniteScroll } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-history',
  mixins: [
    mixins.service,
    mixins.baseCollection
  ],
  components: {
    QInfiniteScroll
  },
  props: {
    renderer: {
      type: Object,
      default: () => {
        return {
          component: 'collection/KHistoryEntry',
          options: {},
          props: {}
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
      this.items = []
      this.currentPage = 1
      this.refreshCollection()
    },
    filterQuery: function () {
      this.items = []
      this.currentPage = 1
      this.refreshCollection()
    }
  },
  methods: {
    layout () {
      return _.get(this.options, 'layout', this.$q.screen.lt.sm ? 'dense' : (this.$q.screen.lt.md ? 'comfortable' : 'loose'))
    },
    getCollectionBaseQuery () {
      return this.baseQuery
    },
    getCollectionFilterQuery () {
      return this.filterQuery
    },
    async onCollectionRefreshed () {
      // FIXME: passing the side as a prop on the entry component does not seem to work
      this.items.forEach((item, index) => {
        item.side = (index % 2 ? 'left' : 'right')
      })
      if (this.done) {
        if (this.items.length === this.nbTotalItems) this.done(true)
        else this.done(false)
      }
    },
    onScroll (index, done) {
      /* if (this.items.length === this.nbTotalItems) done(true)
      else { */
      this.done = done
      this.currentPage++
      this.refreshCollection()
      // }
    }
  },
  created () {
    // Load the component
    this.$options.components[this.renderer.component] = this.$load(this.renderer.component)
    this.$options.components['k-label'] = this.$load('frame/KLabel')
    this.$on('collection-refreshed', this.onCollectionRefreshed)
    // Whenever the user abilities are updated, update collection as well
    this.$events.$on('user-abilities-changed', this.refreshCollection)
  },
  beforeDestroy () {
    this.$off('collection-refreshed', this.onCollectionRefreshed)
    this.$events.$off('user-abilities-changed', this.refreshCollection)
  }
}
</script>
