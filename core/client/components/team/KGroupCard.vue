<template>
  <k-card v-bind="$props" :actions="itemActions" :bind-actions="false" >
    <!--
      Card header
     -->
    <template v-slot:card-header>
      <div class="q-pa-xs row justify-end">
        <q-badge outine color="grey-7">
          {{ $t(memberRoleLabel) }}
        </q-badge>
      </div>
    </template>
    <!--
      Card content
     -->
    <div slot="card-content">
      <q-separator />
      <div class="q-pa-md row justify-around items-center">
        <template v-for="(role, index) in roleNames">
          <q-btn :key="roleKey(role)" flat small rounded color="primary"
            :id="role"
            :icon="roleIcons[index]"
            :label="memberStats[role]"
            @click="onMembersClicked(role)"/>
        </template>
      </div>
    </div>
  </k-card>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'
import { findMembersOfGroup, getRoleForGroup, Roles, RoleNames } from '../../../common/permissions'
import { Dialog } from 'quasar'

export default {
  name: 'k-group-card',
  mixins: [mixins.baseItem],
  computed: {
    memberRoleIcon () {
      const user = this.$store.get('user')
      const role = getRoleForGroup(user, this.contextId, this.item._id)
      if (!_.isUndefined(role)) return this.roleIcons[Roles[role]]
      else return ''
    },
    memberRoleLabel () {
      const user = this.$store.get('user')
      const role = getRoleForGroup(user, this.contextId, this.item._id)
      if (!_.isUndefined(role)) return this.roleLabels[Roles[role]]
      else return ''
    }
  },
  data () {
    return {
      memberStats: {},
      roleLabels: []
    }
  },
  methods: {
    removeGroup () {
      Dialog.create({
        title: this.$t('KGroupCard.REMOVE_DIALOG_TITLE', { group: this.item.name }),
        message: this.$t('KGroupCard.REMOVE_DIALOG_MESSAGE', { group: this.item.name }),
        html: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(() => {
        const groupsService = this.$api.getService('groups')
        groupsService.remove(this.item._id)
      })
    },
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
    },
    onMembersClicked (role) {
    /* FIXME
      this.$router.push({ name: 'edit-group', params: { contextId: this.contextId, objectId: this.item._id, perspective: role } })
      */
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
