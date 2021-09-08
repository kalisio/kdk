<template>
  <div class="column full-width">
    <!--
      Label
     -->
    <div v-if="label" class="full-width row justify-center text-subtitle1 q-pb-md">
      <q-chip :label="$t(label)" square color="grey-9" text-color="white" />
    </div>
    <!--
      Items
     -->
    <div v-if="items.length > 0">
      <q-scroll-area
        ref="scrollArea"
        :style="{ height: `${height}px` }"
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
        @scroll="onScroll">
        <div class="full-width row justify-center q-gutter-y-md">
          <template v-for="item in items">
            <div :key="item._id" class="col-12 q-pr-md">
              <component
                :id="item._id"
                :service="service"
                :item="item"
                :contextId="contextId"
                :is="renderer.component"
                v-bind="renderer"
                @item-selected="onItemSelected" />
            </div>
          </template>
        </div>
      </q-scroll-area>
      <div v-if="scrollAction" class="row justify-center q-pa-md">
        <k-action
          id="scroll-action"
          icon="las la-angle-double-down"
          color="accent"
          size="1rem"
          :handler="this.scrollDown" />
      </div>
    </div>
    <div v-else>
      <slot name="empty-column">
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
import KAction from '../frame/KAction.vue'
import KStamp from '../frame/KStamp.vue'
import mixins from '../../mixins'

const baseCollectionMixin = mixins.baseCollection

export default {
  name: 'k-column',
  components: {
    KAction,
    KStamp
  },
  mixins: [
    mixins.service,
    baseCollectionMixin
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
      default: undefined
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
        backgroundColor: colors.getBrand('primary'),
        width: '6px'
      },
      barStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: colors.getBrand('accent'),
        width: '10px'
      }
    }
  },
  watch: {
    baseQuery () {
      this.resetCollection()
    },
    filterQuery () {
      this.resetCollection()
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
          this.scrollAction = info.verticalSize > this.height
        }
      } else {
        if (info.verticalPercentage === 1) {
          this.scrollAction = false
        } else {
          this.scrollAction = info.verticalSize > this.height
        }
      }
    },
    scrollDown () {
      const position = this.$refs.scrollArea.getScrollPosition()
      this.$refs.scrollArea.setScrollPosition(position + this.scrollOffset, this.scrollDuration)
    },
    resetCollection () {
      if (this.$refs.scrollArea) this.$refs.scrollArea.setScrollPosition(0)
      baseCollectionMixin.methods.resetCollection.call(this)
    }
  },
  created () {
    // Load the component
    this.$options.components[this.renderer.component] = this.$load(this.renderer.component)
    // Configuration
    this.scrollOffset = 350
    this.scrollDuration = 250
    // Whenever the user abilities are updated, update collection as well
    this.$events.$on('user-abilities-changed', this.resetCollection)
    this.refreshCollection()
  },
  beforeDestroy () {
    this.$events.$off('user-abilities-changed', this.resetCollection)
  }
}
</script>
