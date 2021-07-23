<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Groups collection
      -->
      <k-grid
        ref="groupsGrid"
        :contextId="contextId"
        service="groups"
        :renderer="renderer"
        :base-query="sorter.query"
        :filter-query="filter.query"
        :list-strategy="'smart'">
        <template slot="empty-section">
          <div class="absolute-center">
            <k-stamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KGrid.EMPTY_GRID')" />
          </div>
        </template>
      </k-grid>
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="groups"></router-view>
    </template>
  </k-page>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'

export default {
  name: 'groups-activity',
  mixins: [mixins.baseActivity()],
  props: {
    contextId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      sorter: this.$store.get('sorter'),
      filter: this.$store.get('filter'),
      // Make this configurable from app
      renderer: _.merge({
        component: 'team/KGroupCard'
      }, this.activityOptions.items)
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  }
}
</script>
