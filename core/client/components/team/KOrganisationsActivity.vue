<template>
  <KPage padding>
    <template v-slot:page-content>
      <!--
        Organisations collection
      -->
      <KCollection
        ref="organisationsGrid"
        service="organisations"
        :renderer="renderer"
        :base-query="sorter.query"
        :filter-query="filter.query"
        :list-strategy="'smart'">
        <template v-slot:empty-section>
          <div class="absolute-center">
            <KStamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KCollection.EMPTY_LABEL')" />
          </div>
        </template>
      </KCollection>
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="organisations"></router-view>
    </template>
  </KPage>
</template>

<script>
import _ from 'lodash'
import KPage from '../layout/KPage.vue'
import KCollection from '../collection/KCollection.vue'
import KStamp from '../KStamp.vue'
import { baseActivity } from '../../mixins'

export default {
  components: {
    KPage,
    KCollection,
    KStamp
  },
  mixins: [baseActivity('organisationsActivity')],
  data () {
    return {
      sorter: this.$store.get('sorter'),
      filter: this.$store.get('filter'),
      // Make this configurable from app
      renderer: _.merge({
        component: 'collection/KCard'
      }, this.activityOptions.items)
    }
  }
}
</script>
