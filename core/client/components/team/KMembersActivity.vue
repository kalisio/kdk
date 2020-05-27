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
  mixins: [mixins.baseActivity],
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
            tags: 'chip',
            avatar: { size: '40px' }
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
    refreshActivity () {
      this.clearActivity()
      // Title
      this.setTitle(this.$store.get('context.name'))
      // Search bar
      this.setSearchBar('profile.name', [
        { service: 'groups', field: 'name', baseQuery: {}, icon: { name: 'group_work' } },
        { service: 'tags', field: 'value', baseQuery: {}, icon: 'label' }
      ])
      // Tabbar actions
      this.registerTabAction({
        name: 'members',
        label: this.$t('KMembersActivity.MEMBERS_LABEL'),
        icon: 'las la-user-friends',
        route: { name: 'members-activity', params: { contextId: this.contextId } },
        default: true
      })
      this.registerTabAction({
        name: 'subscribers',
        label: this.$t('KMembersActivity.SUBSCRIBERS_LABEL'),
        icon: 'las la-address-book',
        route: { name: 'subscribers-activity', params: { contextId: this.contextId } }
      })
      this.registerTabAction({
        name: 'groups',
        label: this.$t('KMembersActivity.GROUPS_LABEL'),
        icon: 'las la-sitemap',
        route: { name: 'groups-activity', params: { contextId: this.contextId } }
      })
      // Fab actions
      if (this.$can('create', 'authorisations', this.contextId, { resource: this.contextId })) {
        this.registerFabAction({
          name: 'add-member',
          label: this.$t('KMembersActivity.ADD_USER_LABEL'),
          icon: 'las la-user-plus',
          route: { name: 'add-member', params: {} }
        })
        this.registerFabAction({
          name: 'invite-member',
          label: this.$t('KMembersActivity.INVITE_GUEST_LABEL'),
          icon: 'las la-envelope',
          route: { name: 'invite-member', params: {} }
        })
      }
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
