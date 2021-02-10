<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Groups collection
      -->
      <k-grid ref="groups" :contextId="contextId" service="groups" :renderer="renderer" :base-query="baseQuery" :filter-query="filter.query" :list-strategy="'smart'" />
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="groups" :router="router()"></router-view>
    </template>
  </k-page>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-groups-activity',
  mixins: [mixins.baseActivity()],
  props: {
    contextId: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      baseQuery: {
        $sort: {
          name: 1
        }
      },
      filter: this.$store.get('filter'),
      renderer: {
        component: 'team/KGroupCard'
      }
    }
  },
  methods: {
    router () {
      return {
        onApply: { name: 'groups-activity', params: { contextId: this.contextId } },
        onDismiss: { name: 'groups-activity', params: { contextId: this.contextId } }
      }
    },
    refreshActivity () {
      this.clearActivity()
      this.configureActivity()
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
  }
}
</script>
