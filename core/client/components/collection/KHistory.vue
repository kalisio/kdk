<template>
  <div>
    <q-timeline ref="timeline" color="secondary" :layout="layout()">
      <q-timeline-entry heading class="row justify-center text-center">
        <slot name="heading"></slot>
      </q-timeline-entry>
      <div v-if="items.length === 0" class="row justify-center text-center">
        <div>
          <q-icon size="3rem" name="error_outline" />
          <p>{{$t('KList.EMPTY_LIST')}}</p>
        </div>
      </div>
      <q-infinite-scroll v-if="appendItems" ref="scroll" @load="onScroll" :offset="250">
        <template v-for="(item, index) in items">
          <component class="row justify-center" :key="item._id" :id="item._id" :item="item" :contextId="contextId" :is="renderer.component" v-bind="renderer.props" item-selected="onItemSelected(item)" />
        </template>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="secondary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
      <div v-else>
        <template v-for="(item, index) in items">
          <component class="row justify-center" :key="item._id" :id="item._id" :item="item" :contextId="contextId" :is="renderer.component" v-bind="renderer.props" item-selected="onItemSelected(item)" />
        </template>
      </div>
    </q-timeline>
    <div v-if="!appendItems && (nbPages > 1)" class="row justify-center text-center">
      <div class="col-12">
        <q-pagination class="justify-center q-ma-md" v-model="currentPage" :max="nbPages" @input="onPageChanged" :input="true"/>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { QInfiniteScroll, QSpinner } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-history',
  mixins: [mixins.service, mixins.baseCollection],
  components: {
    QInfiniteScroll,
    QSpinner
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
      this.refreshCollection()
      this.currentPage = 1
    },
    filterQuery: function () {
      this.refreshCollection()
      this.currentPage = 1
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
      if (this.currentScroll) this.currentScroll()
    },
    onScroll (index, done) {
      if (this.currentPage === this.nbPages) done()
      else {
        // Keep track of done() function to call it when the collection has been refreshed
        this.currentScroll = done
        this.currentPage++
        this.refreshCollection()
      }
    }
  },
  created () {
    // Load the component
    this.$options.components[this.renderer.component] = this.$load(this.renderer.component)
    this.$on('collection-refreshed', this.onCollectionRefreshed)
    // Whenever the user abilities are updated, update collection as well
    this.$events.$on('user-abilities-changed', this.refreshCollection)
    // If no infinite scroll launch first refresh
    if (!this.appendItems) this.refreshCollection()
  },
  mounted () {

  },
  beforeDestroy () {
    this.$off('collection-refreshed', this.onCollectionRefreshed)
    this.$events.$off('user-abilities-changed', this.refreshCollection)
  }
}
</script>
