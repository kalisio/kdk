<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Members collection, cannot use smart strategy here because membership is not managed at service level
        but using authorisations on users
      -->
      <k-grid
        ref="membersGrid"
        service="members"
        :renderer="renderer"
        :contextId="contextId"
        :base-query="baseQuery"
        :filter-query="filter.query" />
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="members"></router-view>
    </template>
  </k-page>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'
import { getRoleForOrganisation } from '../../../common/permissions'

const activityMixin = mixins.baseActivity()

export default {
  name: 'members-activity',
  mixins: [activityMixin],
  provide () {
    return {
      kActivity: this
    }
  },
  props: {
    contextId: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      default: undefined
    }
  },
  computed: {
    baseQuery () {
      let query = _.clone(this.sorter.query)
      if (this.filters.includes('guest')) {
        query = Object.assign(query, { expireAt: { $ne: null } })
      }
      const roleFilters = _.intersection(['owner', 'manager', 'member'], this.filters)
      if (roleFilters.length > 0) {
        query = Object.assign(query, { organisations: { $elemMatch: { _id: this.contextId, permissions: { $in: roleFilters } } } })
      }
      return query
    }
  },
  data () {
    return {
      sorter: this.$store.get('sorter'),
      filter: this.$store.get('filter'),
      filters: [],
      // Make this configurable from app
      renderer: _.merge({
        component: 'team/KMemberCard',
        options: {
          descriptionField: 'email'
        }
      }, this.activityOptions.items)
    }
  },
  methods: {
    configureActivity () {
      activityMixin.methods.configureActivity.call(this)
      this.subscribeUsers()
      if (this.mode) this.setTopPaneMode(this.mode)
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
