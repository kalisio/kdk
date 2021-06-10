<template>
  <q-timeline ref="timeline" color="accent" :layout="layout()">
    <k-column
      :service="service"
      :renderer="renderer"
      :contextId="contextId" 
      :baseQuery="baseQuery"
      :filterQuery="filterQuery"
      :append-items="true" 
      :height="height"
      style="min-width: 100%;" 
      @collection-refreshed="onCollectionRefreshed">
      <template slot="empty-column">
        <slot name="empty-history">
          <div class="row justify-center">
            <k-stamp 
              icon="las la-exclamation-circle" 
              icon-size="1.6rem" 
              :text="$t('KColumn.EMPTY_COLUMN')" 
              direction="horizontal" />
          </div>
        </slot>
      </template>
    </k-column>
  </q-timeline>
</template>

<script>
import _ from 'lodash'
import KColumn from './KColumn.vue'
import KStamp from '../frame/KStamp.vue'
import mixins from '../../mixins'

export default {
  name: 'k-history',
  components: { 
    KColumn,
    KStamp
  },
  mixins: [mixins.service],
  props: {
    renderer: {
      type: Object,
      default: () => {
        return {
          component: 'collection/KHistoryEntry'
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
      type: String,
      default: 'smart'
    },
     height: {
      type: Number,
      required: true
    }
  },
  methods: {
    layout () {
      return _.get(this.options, 'layout', this.$q.screen.lt.sm ? 'dense' : (this.$q.screen.lt.md ? 'comfortable' : 'loose'))
    },
    async onCollectionRefreshed (items) {
      // FIXME: passing the side as a prop on the entry component does not seem to work
      _.forEach(items, (item, index) => {
        item.side = (index % 2 ? 'left' : 'right')
      })
    }
  },
  created () {
    // Load the component
    this.$options.components[this.renderer.component] = this.$load(this.renderer.component)
  }
}
</script>
