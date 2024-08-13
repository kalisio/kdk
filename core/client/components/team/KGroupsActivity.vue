<template>
  <KPage padding>
    <template v-slot:page-content>
      <!--
        Groups collection
      -->
      <KGrid
        ref="groupsGrid"
        :contextId="contextId"
        service="groups"
        :renderer="renderer"
        :base-query="sorter.query"
        :filter-query="filter.query"
        :list-strategy="'smart'">
        <template v-slot:empty-section>
          <div class="absolute-center">
            <KStamp
              icon="las la-exclamation-circle"
              icon-size="3rem"
              :text="$t('KGrid.EMPTY_LABEL')"
            />
          </div>
        </template>
      </KGrid>
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="groups"></router-view>
    </template>
  </KPage>
</template>

<script>
import KPage from '../layout/KPage.vue'
import KGrid from '../collection/KGrid.vue'
import KStamp from '../KStamp.vue'

import _ from 'lodash'
import { baseActivity } from '../../mixins'
import { Exporter } from '../../exporter.js'

export default {
  name: 'groups-activity',
  components: {
    KPage,
    KGrid,
    KStamp
  },
  mixins: [baseActivity()],
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
  methods: {
    exportGroups () {
      Exporter.export({
        service: 'groups',
        context: this.contextId,
        formats: [
          { label: 'CSV', value: 'csv' },
          { label: 'JSON', value: 'json' }
        ],
        gzip: false
      })
    }
  }
}
</script>
