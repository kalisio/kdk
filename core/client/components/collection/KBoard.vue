<template>
  <div class="fit q-pa-md row q-gutter-x-sm no-wrap">
    <template v-for="category in categories">
      <div
        :id="category.name"
        class="fit q-pa-sm row content-start q-gutter-y-sm"
        :key="category.name" 
        style="height: 100%; min-width: 250px; max-width: 300px; border-radius: 5px; background: linear-gradient(#dfdfdf, #ffffff);" 
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @dragover="onDragOver"
        @drop="onDrop">
          <div class="text-subtitle1 text-weight-medium">{{ $t(category.name) }}</div>
          <template v-for="item in getItemsByCategorie(category.name)">
            <div
              :id="item._id"
              :class="getItemClass()" 
              :key="item._id" 
              class="k-card" 
              draggable="true"
              droppable="false"
              @dragstart="onDragStart">
              <component 
                :item="item" 
                :contextId="contextId" 
                :is="renderer.component" 
                v-bind="renderer.props" 
                item-selected="onItemSelected(item)" />
            </div>
          </template>
      </div>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'

export default {
  name: 'k-board',
  mixins: [
    mixins.service,
    mixins.baseCollection
  ],
  props: {
    categories: {
      type: Array,
      default: () => { return null }
    },
    categoryField: {
      type: String,
      default: undefined
    },
    renderer: {
      type: Object,
      default: () => {
        return {
          component: 'collection/KCard',
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
  /*computed: {
    columns () {
      const columns = []
      _.forEach(this.categories, (category) => {
        columns.push(Object.assign(category, { uid: uid() }))
      })
      return columns
    }
  },
  data () {
    return {
      columns: []
    }
  },*/
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshCollection()
    },
    baseQuery: function () {
      this.refreshCollection()
    },
    filterQuery: function () {
      this.refreshCollection()
    }
  },
  methods: {
    getItemClass () {
      return this.renderer.class || 'full-width'
    },
    getItemsByCategorie (category) {
      return _.filter(this.items, item => {
        return item[this.categoryField] === category
      })
    },
    getCollectionBaseQuery () {
      return this.baseQuery
    },
    getCollectionFilterQuery () {
      return this.filterQuery
    },
    getItemsByCategory (category) {
      return this.items
    },
     // store the id of the draggable element
    onDragStart (event) {
      event.dataTransfer.setData('itemId', event.target.id)
      event.dataTransfer.dropEffect = 'move'
    },
    onDragEnter (event) {
      // don't drop on other draggables
      if (event.target.draggable !== true) {
        event.target.classList.add('drag-enter')
      }
    },
    onDragLeave (event) {
      event.target.classList.remove('drag-enter')
    },
    onDragOver (event) {
      event.preventDefault()
    },
    async onDrop (event) {
      event.preventDefault()
      // don't drop on other draggables
      if (event.target.draggable === true) return
      // don't drop on unidentified target
      if (!event.target.id) return
      const columnId = event.target.id
      const itemId = event.dataTransfer.getData('itemId')
      const patch = {}
      _.set(patch, this.categoryField, columnId)
      await this.servicePatch(itemId, patch)      
    }
  },
  created () {
    // Load the component
    this.$options.components[this.renderer.component] = this.$load(this.renderer.component)
    // Refresh collection
    this.refreshCollection()
    // Whenever the user abilities are updated, update collection as well
    this.$events.$on('user-abilities-changed', this.refreshCollection)
  },
  beforeDestroy () {
    this.$events.$off('user-abilities-changed', this.refreshCollection)
  }
}
</script>

<style lang="stylus">
.k-card {
  border-radius: 5px;
}

.k-card:hover {
  border: solid 1px $secondary;
}
</style>