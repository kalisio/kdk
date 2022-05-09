<template>
  <div v-if="items.length > 0" class="row">
    <div class="col-12">
      <q-list highlight separator>
        <template v-for="item in items" :key="item._id">
          <component
            :id="item._id"
            :service="service"
            :item="item"
            :contextId="contextId"
            :is="renderer.component"
            v-bind="renderer"
            @item-toggled="onItemToggled"
            @item-selected="onItemSelected" />
        </template>
      </q-list>
    </div>
    <div v-if="nbPages > 1" class="col-12">
      <div class="row justify-center">
        <q-pagination v-model="currentPage" :max="nbPages" @input="onPageChanged" :input="true" />
      </div>
    </div>
  </div>
  <div v-else>
    <slot name="empty-section">
      <div class="row justify-center">
        <k-stamp icon="las la-exclamation-circle" icon-size="1.6rem" :text="$t('KList.EMPTY_LIST')" direction="horizontal" />
      </div>
    </slot>
  </div>
</template>

<script>
import { service, baseCollection } from '../../mixins'

export default {
  name: 'k-list',
  mixins: [
    service,
    baseCollection
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
    baseQuery: function () {
      this.resetCollection()
    },
    filterQuery: function () {
      this.resetCollection()
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
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    // Force the collection to be refreshed
    this.refreshCollection()
    // Whenever the user abilities are updated, update collection as well
    this.$events.on('user-abilities-changed', this.refreshCollection)
  },
  beforeDestroy () {
    this.$events.off('user-abilities-changed', this.refreshCollection)
  }
}
</script>
