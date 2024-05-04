<template>
  <KCard
    v-bind="$props"
    :header="header"
    :actions="itemActions"
    :bind-actions="false"
    :dense="dense">
    <!--
      Card content
     -->
    <template v-slot:card-content>
      <!-- Members -->
      <KCardSection :title="$t('KGroupCard.MEMBERS_SECTION')" :dense="dense">
        <KAction
          id="list-members"
          icon="las la-user-friends"
          :label="$t('KGroupCard.MEMBERS_LABEL', { count: membersCount })"
          :tooltip="$t('KGroupCard.VIEW_MEMBERS_LABEL')"
          @triggered="onListMembers"
        />
      </KCardSection>
    </template>
  </KCard>
</template>

<script>
import _ from 'lodash'
import { baseItem } from '../../mixins'
import { findMembersOfGroup, getRoleForGroup, getRoleForOrganisation, Roles, RoleNames } from '../../../common/permissions'
import { KCard, KCardSection } from '../collection'
import KTextArea from '../KTextArea.vue'
import KAction from '../action/KAction.vue'

export default {
  name: 'k-group-card',
  components: {
    KCard,
    KCardSection,
    KTextArea,
    KAction
  },
  mixins: [baseItem],
  data () {
    return {
      membersCount: 0,
      memberStats: {},
      roleLabels: []
    }
  },
  computed: {
    header () {
      const components = _.filter(this.itemActions, { scope: 'header' })
      if (this.memberRoleLabel) {
        components.splice(0, 0, { component: 'QBadge', label: this.$t(this.memberRoleLabel), color: 'grey-7' }, { component: 'QSpace' })
      } else {
        components.splice(0, 0, { component: 'QSpace' })
      }
      return components
    },
    memberRoleLabel () {
      const user = this.$store.get('user')
      // Organisation managers can manage all groups so that we do not display anything about role
      let role = getRoleForOrganisation(user, this.contextId)
      if (Roles[role] >= Roles.manager) return ''
      // Otherwise the user can be member or manager of the group
      role = getRoleForGroup(user, this.contextId, this.item._id)
      return (!_.isUndefined(role) ? this.roleLabels[Roles[role]] : '')
    },
    dense () {
      return this.$q.screen.lt.sm
    }
  },
  methods: {
    async refreshStats () {
      // TOTO: display stats ?
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
      this.$router.push({ name: 'members-activity', params: { contextId: this.contextId, mode: 'filter' } })
    }
  },
  created () {
    // Compute the count of members belonging to group
    this.roleNames = RoleNames
    this.roleIcons = this.$config('roles.icons')
    this.roleLabels = this.$config('roles.labels')
    this.refreshStats()
  }
}
</script>
