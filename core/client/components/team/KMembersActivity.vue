<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Members collection, cannot use smart strategy here because membership is not managed at service level
        but using authorisations on users
      -->
      <k-grid ref="membersGrid" service="members" :renderer="renderer" :contextId="contextId" :base-query="baseQuery" :filter-query="searchQuery" />
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="members" :router="router()"></router-view>
    </template>
  </k-page>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'
import { getRoleForOrganisation } from '../../../common/permissions'

export default {
  name: 'k-members-activity',
  mixins: [mixins.baseActivity()],
  props: {
    contextId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      baseQuery: {
        $sort: {
          'profile.name': 1
        }
      },
      renderer: {
        component: 'team/KMemberCard',
        props: {
          options: {
            descriptionField: 'email'
          }
        }
      }
    }
  },
  methods: {
    router () {
      return {
        onApply: { name: 'members-activity', params: { contextId: this.contextId } },
        onDismiss: { name: 'members-activity', params: { contextId: this.contextId } }
      }
    },
    async refreshActivity () {
      // We allow search items to be internally provided by others activities like tags, etc.
      // Keep track of it before cleaning
      // TODO : do we use the store anymore ?
      const searchItems = this.$store.get('searchBar.items', [])
      this.clearActivity()
      this.setTopPane({
        'default': [
          { 
            id: 'back', 
            icon: 'las la-arrow-left', 
            tooltip: 'KMembersActivity.MY_EVENTS', 
            route: { name: 'events-activity' } 
          },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { 
            id: 'members', 
            icon: 'las la-user-friends', 
            label: 'KMembersActivity.MEMBERS_LABEL', 
            color: 'primary', 
            disabled: true,
            visible: this.$can('service', 'members', this.contextId)
          },
          { 
            id: 'filter', 
            icon: 'las la-search', 
            tooltip: 'KMembersActivity.FILTER_MEMBERS', 
            handler: () => { this.setTopPaneMode('filter') }
          },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          {
            component: 'frame/KMenu',
            icon: 'las la-grip-horizontal',
            actionRenderer: 'item',
            content: [
              { 
                id: 'tags', 
                icon: 'las la-tags', 
                label: 'KMembersActivity.TAGS_LABEL', 
                route: { name: 'tags-activity', params: { contextId: this.contextId } },
                visible: this.$can('service', 'tags', this.contextId)
              },
              { 
                id: 'groups', icon: 'las la-sitemap', 
                label: 'KMembersActivity.GROUPS_LABEL', 
                route: { name: 'groups-activity', 
                params: { contextId: this.contextId } },
                visible: this.$can('service', 'groups', this.contextId)
              },
              { 
                id: 'event-templates', 
                icon: 'las la-project-diagram', 
                label: 'EventsActivity.EVENT_TEMPLATES_LABEL', 
                route: { name: 'event-templates-activity', params: { contextId: this.contextId } },
                visible: this.$can('create', 'event-templates', this.contextId)
              },
              { 
                id: 'catalog', 
                icon: 'las la-map', 
                label: 'Context.CATALOG', 
                route: { name: 'catalog-activity', params: { contextId: this.contextId } },
                visible: this.$can('update', 'catalog', this.contextId)
              },
              {
                id: 'settings',
                icon: 'las la-cog',
                label: 'Context.SETTINGS',
                route: { name: 'organisation-settings-activity', params: { perspective: 'properties', contextId: this.contextId } },
                visible: this.$can('update', 'organisations', this.contextId, { _id: this.contextId })
              }
            ]
          },
        ],
        'filter': [
          { id: 'back', icon: 'las la-arrow-left', handler: () => { this.setTopPaneMode('default') } },
          { component: 'QSeparator', vertical: true,  color: 'lightgrey' },
          { 
            component: 'collection/KFilter', 
            fields: 'profile.name',
            services: [
              { service: 'groups', field: 'name', baseQuery: {}, icon: 'las la-sitemap' },
              { service: 'tags', field: 'value', baseQuery: {}, icon: 'las la-tag' }
            ],
            items: searchItems,
            on: { event: 'filter-changed', listener: this.onFilterChanged } 
          }
        ]
      })
      // Fab actions
      this.setFab([
        {
          id: 'add-member',
          label: this.$t('KMembersActivity.ADD_USER_LABEL'),
          icon: 'las la-user-plus',
          route: { name: 'add-member', params: {} },
          status: this.$can('create', 'authorisations', this.contextId, { resource: this.contextId })
        },
        {
          id: 'invite-member',
          label: this.$t('KMembersActivity.INVITE_GUEST_LABEL'),
          icon: 'las la-envelope',
          route: { name: 'invite-member', params: {} },
          status: this.$can('create', 'authorisations', this.contextId, { resource: this.contextId })
        }
      ])
      this.subscribeUsers()
    },
    subscribeUsers () {
      // Remove previous listener if any
      this.unsubscribeUsers()
      const usersService = this.$api.getService('users')
      usersService.on('patched', this.refreshOnAddMember)
    },
    unsubscribeUsers () {
      const usersService = this.$api.getService('users')
      usersService.off('patched', this.refreshOnAddMember)
    },
    refreshOnAddMember (user) {
      const grid = this.$refs.membersGrid
      if (grid) {
        const member = _.find(grid.items, { _id: user._id })
        const role = getRoleForOrganisation(user, this.contextId)
        // If the user has a role in this organisation and
        // was not in our list he might have been added so refresh
        if (role && !member) this.$refs.membersGrid.refreshCollection()
      }
    },
    onFilterChanged (query) {
      this.searchQuery = query
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
  },
  beforeDestroy () {
    this.unsubscribeUsers()
  }
}
</script>
