<template>
  <k-card v-bind="$props" :actions="itemActions" :bind-actions="false" >
    <!--
      Card header
     -->
    <template v-slot:card-header>
      <div class="q-pa-sm row justify-end">
        <q-badge outine color="grey-7">
          {{ $t(memberRoleLabel) }}
        </q-badge>
      </div>
    </template>
    <!--
      Card content
     -->
    <div slot="card-content">
      <q-list bordered>
        <q-item 
          :id="'members-' + item._id" 
          clickable 
          @click="onListMembers">
          <q-item-section avatar>
            <q-icon name="las la-user-friends" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ $t(`KGroupCard.MEMBERS_LABEL`, { count: membersCount }) }}
            </q-item-label>
            <q-tooltip>
              {{ $t(`KGroupCard.VIEW_MEMBERS_LABEL`) }}
            </q-tooltip>
          </q-item-section>
        </q-item>
        <!--TODO display the stats q-separator />
        <template v-for="(role, index) in roleNames">
          <q-item 
            :id="role" 
            :key="roleKey(role)">
            <q-item-section avatar>
              <q-icon :name="roleIcons[index]" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ memberStats[role] }} 
                {{ roleLabels[index]}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template-->
      </q-list>
    </div>
  </k-card>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'
import { findMembersOfGroup, getRoleForGroup, Roles, RoleNames } from '../../../common/permissions'

export default {
  name: 'k-group-card',
  mixins: [mixins.baseItem],
  data () {
    return {
      membersCount: 0,
      memberStats: {},
      roleLabels: []
    }
  },
   computed: {
    memberRoleLabel () {
      const user = this.$store.get('user')
      const role = getRoleForGroup(user, this.contextId, this.item._id)
      if (!_.isUndefined(role)) return this.roleLabels[Roles[role]]
      else return ''
    }
  },
  methods: {
    roleKey (role) {
      return this.item._id + '-' + role
    },
    async refreshStats () {
      // Clear the counters. We use a temporary object to ensure reactivity
      // see: https://v1.vuejs.org/guide/reactivity.html
      const stats = {}
      this.roleNames.forEach(role => {
        stats[role] = 0
      })
      const membersService = this.$api.getService('members', this.contextId)
      const members = await findMembersOfGroup(membersService, this.item._id)
      this.membersCount = members.data.length
      // filter the subjects according the role in order to count them
      _.forEach(members.data, (user) => {
        const group = _.find(user.groups, { _id: this.item._id })
        stats[group.permissions]++
      })
      this.memberStats = Object.assign({}, stats)
    },
    onListMembers () {
      // Setup filter accordingly
      this.$store.patch('filter', {
        items: [Object.assign({
          service: 'groups',
          field: 'name',
          icon: 'group_work'
        }, this.item)]
      })
      this.$router.push({ name: 'members-activity', params: { contextId: this.contextId } })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    // Compute the count of members belonging to group
    this.roleNames = RoleNames
    this.roleIcons = this.$config('roles.icons')
    this.roleLabels = this.$config('roles.labels')
    this.refreshStats()
  }
}
</script>
