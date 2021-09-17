<template>
  <k-column
    :service="service"
    :renderer="computedRenderer"
    :contextId="contextId"
    :baseQuery="computedBaseQuery"
    :filterQuery="filterQuery"
    :append-items="true"
    :height="height"
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
</template>

<script>
import _ from 'lodash'
import { Time, Sorter } from '../..'
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
      required: true
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
  computed: {
    computedRenderer () {
      return {
        component: 'collection/KHistoryEntry',
        renderer: this.renderer
      }
    },
    computedBaseQuery () {
      const query = _.clone(this.baseQuery)
      Object.assign(query, _.clone(this.timeRange.query))
      return query
    }
  },
  data () {
    return {
      timeRange: Time.getRange(),
      sorter: Sorter.get()
    }
  },
  methods: {
    async onCollectionRefreshed (items) {
      _.forEach(items, (item, index) => {
        item.previous = index > 0 ? items[index - 1] : undefined
        item.side = (index % 2 ? 'left' : 'right')
      })
    }
  }
}
</script>
