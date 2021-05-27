<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Organisations collection
      -->
      <k-grid
        ref="organisationsGrid"
        service="organisations"
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
      sorter: this.$store.get('sorter'),
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
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  }
}
</script>
