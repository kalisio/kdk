<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Organisations collection
      -->
      <k-grid
        ref="organisations"
        service="organisations"
        :renderer="renderer"
        :base-query="baseQuery"
        :filter-query="filter.query"
        :list-strategy="'smart'" />
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="organisations"></router-view>
    </template>
  </k-page>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'

export default {
  name: 'organisations-activity',
  mixins: [mixins.baseActivity()],
  data () {
    return {
      baseQuery: {
        $sort: {
          name: 1
        }
      },
      filter: this.$store.get('filter'),
      // Make this configurable from app
      renderer: _.merge({
        component: 'collection/KCard'
      }, this.activityOptions.items)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
  }
}
</script>
