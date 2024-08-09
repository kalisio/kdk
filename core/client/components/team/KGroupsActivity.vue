<template>
  <KPage padding>
    <template v-slot:page-content>
      <!--
        Groups collection
      -->
      <KCollection
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
              :text="$t('KCollection.EMPTY_LABEL')"
            />
          </div>
        </template>
      </KCollection>
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="groups"></router-view>
    </template>
  </KPage>
</template>

<script>
import KPage from '../layout/KPage.vue'
import KCollection from '../collection/KCollection.vue'
import KStamp from '../KStamp.vue'

import _ from 'lodash'
import { baseActivity } from '../../mixins'
import { Exporter } from '../../exporter.js'

export default {
  name: 'groups-activity',
  components: {
    KPage,
    KCollection,
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
