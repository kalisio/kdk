<template>
  <k-card v-bind="$props" :itemActions="actions">
    <!--
      Card icon
     -->
    <q-icon slot="card-icon" :name="memberRoleIcon" size="1.4rem">
      <q-tooltip>{{ $t(memberRoleLabel) }}</q-tooltip>
    </q-icon>
    <!--
      Card content
     -->
    <div slot="card-content">
      <div class="row justify-around items-center">
        <template v-for="(role, index) in roleNames">
          <q-btn :key="roleKey(role)" flat small rounded color="primary"
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
    refreshActions () {
      this.clearActions()
      if (this.$can('update', 'groups', this.contextId, this.item)) {
        this.registerPaneAction({
          name: 'edit-group',
          label: this.$t('KGroupCard.EDIT_LABEL'),
          icon: 'las la-file-alt',
          route: { name: 'edit-group', params: { contextId: this.contextId, objectId: this.item._id } }
        })
      }
      if (this.$can('remove', 'groups', this.contextId, this.item)) {
        this.registerMenuAction({
          name: 'remove-group',
          label: this.$t('KGroupCard.REMOVE_LABEL'),
          icon: 'las la-minus-circle',
          handler: this.removeGroup
        })
      }
    },
    removeGroup (group) {
      Dialog.create({
        title: this.$t('KGroupCard.REMOVE_DIALOG_TITLE', { group: group.name }),
        message: this.$t('KGroupCard.REMOVE_DIALOG_MESSAGE', { group: group.name }),
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
        groupsService.remove(group._id)
      })
    },
    roleKey (role) {
      return this.item._id + '-' + role
    },
    async refreshStats () {
      // Clear the counters. We use a temporaty object to ensure reactivity
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
    onMembersClicked (role) {
    /* FIXME
      this.$router.push({ name: 'edit-group', params: { contextId: this.contextId, objectId: this.item._id, perspective: role } })
      */
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    // Compute the list of groups this member belongs
    this.roleNames = RoleNames
    this.roleIcons = this.$config('roles.icons')
    this.roleLabels = this.$config('roles.labels')
    this.refreshStats()
  }
}
</script>
