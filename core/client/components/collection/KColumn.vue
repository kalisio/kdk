<template>
  <div class="q-pa-sm column q-gutter-y-sm">
    <!--
      Label
     -->
    <div v-if="label" class="full-width row justify-center text-subtitle1">
      {{ $t(label) }}
    </div>
    <!-- 
      Items
     -->
    <div v-if="items.length > 0">
      <q-scroll-area 
        ref="scrollArea"
        :style="`height: ${height}px`" 
        :thumb-style="thumbStyle" 
        :bar-style="barStyle"
        @scroll="onScroll">
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
      <div v-if="scrollAction" class="row justify-center">
        <k-action 
          id="scroll-action"
          icon="las la-angle-double-down"
          size="md"
          :handler="this.scrollDown" />
      </div>
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
  </div>
</template>

<script>
import { colors } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-column',
  mixins: [
    mixins.service,
    mixins.baseCollection
  ],
  props: {
    label: {
      type: String,
      default: undefined
    },
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
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      scrollAction: false,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: colors.getBrand('secondary'),
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: colors.getBrand('primary'),
        width: '9px',
        opacity: 0.25
      }
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
      if (this.items.length < this.nbTotalItems) {
        if (info.verticalPercentage === 1) { 
          this.currentPage++
          this.refreshCollection()
          this.scrollAction = true
        } else {
          this.scrollAction = info.verticalSize > this.height ? true : false
        } 
      } else {
        if (info.verticalPercentage === 1) {    
          this.scrollAction = false
        } else { 
          this.scrollAction = info.verticalSize > this.height ? true : false
        }
      }
    },
    scrollDown () {
      const position = this.$refs.scrollArea.getScrollPosition()
      this.$refs.scrollArea.setScrollPosition(position + 200, 250)
    }
  },
  beforeCreate () {
    // Load the component
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    this.$options.components['k-action'] = this.$load('frame/KAction')
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
