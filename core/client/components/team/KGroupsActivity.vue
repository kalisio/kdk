<template>
  <q-page padding>
    <!--
      Groups collection
    -->
    <k-grid ref="groups" :contextId="contextId" service="groups" :renderer="renderer" :base-query="baseQuery" :filter-query="searchQuery" :list-strategy="'smart'" />
    <!--
      Router view to enable routing to modals
    -->
    <router-view service="groups" :router="router()"></router-view>
  </q-page>
</template>

<script>
import { mixins } from '../../mixins'

export default {
  name: 'k-groups-activity',
  mixins: [mixins.baseActivity],
  props: {
    contextId: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    perspective: {
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
      renderer: {
        component: 'KGroupCard',
        props: {
          options: {
            avatar: { size: '40px' }
          }
        }
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
      // Title
      this.setTitle(this.$store.get('context.name'))
      // Search bar
      this.setSearchBar('name')
      // Tabbar actions
      this.registerTabAction({
        name: 'members',
        label: this.$t('KGroupsActivity.MEMBERS_LABEL'),
        icon: 'group',
        route: { name: 'members-activity', params: { contextId: this.contextId } }
      })
      this.registerTabAction({
        name: 'groups',
        label: this.$t('KGroupsActivity.GROUPS_LABEL'),
        icon: 'group_work',
        route: { name: 'groups-activity', params: { contextId: this.contextId } },
        default: true
      })
      // Fab actions
      if (this.$can('create', 'groups', this.contextId)) {
        this.registerFabAction({
          name: 'create-group',
          label: this.$t('KGroupsActivity.CREATE_GROUP_LABEL'),
          icon: 'add',
          route: { name: 'create-group', params: { contextId: this.contextId } }
        })
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
  }
}
</script>
