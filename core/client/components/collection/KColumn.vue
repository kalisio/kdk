<template>
  <div class="column full-width">
    <!--
      Header
     -->
     <div class="full-width">
      <q-resize-observer @resize="onHeaderResized" />
      <KPanel
        id="header"
        :content="header"
      />
    </div>
    <!--
      Items
     -->
    <div v-if="items.length > 0">
      <KScrollArea
        ref="scrollArea"
        :max-height="scrollHeight"
        @scrolled="onScrolled"
      >
        <div
          class="full-width row"
          v-bind:class="{ 'q-gutter-y-xs': dense, 'q-gutter-y-sm': !dense }"
        >
          <template v-for="item in items" :key="item._id">
            <component
              :id="item._id"
              :service="service"
              :item="item"
              :contextId="contextId"
              :is="rendererComponent"
              v-bind="renderer"
              @item-selected="onItemSelected" 
            />
          </template>
        </div>
      </KScrollArea>
      <div v-if="scrollAction"
        class="row justify-center"
        v-bind:class="{ 'q-pr-sm': dense, 'q-pr-md': !dense }"
      >
        <KAction
          id="scroll-action"
          icon="las la-angle-double-down"
          color="accent"
          size="1rem"
          :handler="this.scrollDown" 
        />
      </div>
    </div>
    <div v-else>
      <slot name="empty-column">
        <div class="row justify-center">
          <KStamp
            icon="las la-exclamation-circle"
            icon-size="1.6rem"
            :text="$t('KColumn.EMPTY_COLUMN')"
            direction="horizontal" 
          />
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import { KScrollArea, KAction, KStamp } from '../frame'
import { baseCollection, service } from '../../mixins'
import { loadComponent } from '../../utils.js'

export default {
  components: {
    KScrollArea,
    KAction,
    KStamp
  },
  mixins: [
    service,
    baseCollection
  ],
  props: {
    header: {
      type: Array,
      default: () => null
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
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    scrollHeight () {
      return this.height - this.headerHeight
    },
    rendererComponent () {
      return loadComponent(this.renderer.component)
    }
  },
  data () {
    return {
      scrollAction: false,
      headerHeight: 0
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
    onHeaderResized (size) {
      this.headerHeight = size.height
    },
    onScrolled (info) {
      if (this.items.length < this.nbTotalItems) {
        if (info.verticalPercentage === 1) {
          if (this.items.length === this.currentPage * this.nbItemsPerPage) this.currentPage++
          this.refreshCollection()
          this.scrollAction = true
        } else {
          this.scrollAction = info.verticalSize > this.scrollHeight
        }
      } else {
        if (info.verticalPercentage === 1) {
          this.scrollAction = false
        } else {
          this.scrollAction = info.verticalSize > this.scrollHeight
        }
      }
    },
    scrollDown () {
      const position = this.$refs.scrollArea.getScrollPosition('vertical')
      this.$refs.scrollArea.setScrollPosition('vertical', position + this.scrollOffset, this.scrollDuration)
    },
    resetCollection () {
      if (this.$refs.scrollArea) this.$refs.scrollArea.setScrollPosition('vertical', 0)
      baseCollection.methods.resetCollection.call(this)
    }
  },
  created () {
    // Configuration
    this.scrollOffset = 350
    this.scrollDuration = 250
    // Whenever the user abilities are updated, update collection as well
    this.$events.on('user-abilities-changed', this.resetCollection)
    this.refreshCollection()
  },
  beforeUnmount () {
    this.$events.off('user-abilities-changed', this.resetCollection)
  }
}
</script>
