<template>
  <KColumn
    :service="service"
    :renderer="computedRenderer"
    :contextId="contextId"
    :baseQuery="baseQuery"
    :filterQuery="computedFilterQuery"
    :append-items="true"
    :height="height"
    @collection-refreshed="onCollectionRefreshed">
    <template v-slot:empty-column>
      <slot name="empty-history">
        <div class="row justify-center">
          <KStamp
            icon="las la-exclamation-circle"
            icon-size="1.6rem"
            :text="$t('KColumn.EMPTY_COLUMN')"
            direction="horizontal" />
        </div>
      </slot>
    </template>
  </KColumn>
</template>

<script>
import _ from 'lodash'
import { Time, Sorter } from '../..'
import KColumn from './KColumn.vue'
import KStamp from '../KStamp.vue'
import { service } from '../../mixins'

export default {
  components: {
    KColumn,
    KStamp
  },
  mixins: [service],
  props: {
    renderer: {
      type: Object,
      required: true
    },
    dateField: {
      type: String,
      default: 'createdAt'
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
        renderer: this.renderer,
        dateField: this.dateField
      }
    },
    computedFilterQuery () {
      const query = _.clone(this.filterQuery)
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
  },
  created () {
    Time.patchField(this.dateField)
  }
}
</script>
