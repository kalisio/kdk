<template>
  <k-card v-bind="$props" :itemActions="actions">
    <!--
      Card header
     -->
    <template v-slot:card-header>
      <div class="q-pa-xs row justify-end">
        <q-badge outine color="grey-7">
          {{ $t(roleLabel(role)) }}
        </q-badge>
      </div>
    </template>
    <!--
      Card content
     -->
    <div slot="card-content">
      <q-separator />
      <template  v-if="tags.length > 0">
        <k-tags-pane class="q-pa-sm" :tags="tags" />
        <q-separator />
      </template>
      <template v-if=" memberGroups.length > 0">
        <div class="q-pa-sm row justify-start items-center">
          <template v-for="(group, index) in memberGroups">
            <q-btn id="group-button" :key="groupKey(group)" flat small round color="primary">
              <q-avatar color="secondary" text-color="white" size="32px">{{groupInitials(group)}}</q-avatar>
              <q-menu ref="popover">
                <q-toolbar inverted color="grey-7">
                  <span style="margin:8px">{{group.name}}</span>
                  <q-btn id="change-role-group" v-if="canChangeRoleInGroup(group)" flat round small @click="onChangeRoleInGroup(group), $refs.popover[index].hide()">
                    <q-icon :name="roleIcon(roleForGroup(group))" />
                  </q-btn>
                  <q-btn id="leave-group" v-if="canLeaveGroup(group)" flat round small @click="onLeaveGroup(group), $refs.popover[index].hide()">
                    <q-icon name="remove_circle" />
                  </q-btn>
                </q-toolbar>
              </q-menu>
              <q-tooltip>{{ group.name }}</q-tooltip>
            </q-btn>
          </template>
          <q-btn id="join-group" v-if="canJoinGroup()" flat small round @click="onJoinGroup()">
            <q-icon name="add_circle" color="grey-7">
              <q-tooltip>{{ $t('KMemberCard.JOIN_GROUP_LABEL') }}</q-tooltip>
            </q-icon>
          </q-btn>
        </div>
        <q-separator />
      </template>  
      <template v-if="expireAt">
        <cite class="q-pa-sm text-red" v-if="expireAt">{{$t('KMemberCard.EXPIRE_AT_LABEL')}} {{expireAt.toLocaleString()}}</cite>
      </template>
    </div>
  </k-card>
</template>

<script>
import _ from 'lodash'
import { Dialog } from 'quasar'
import mixins from '../../mixins'
import { getInitials, processIcon } from '../../utils'
import { Roles, getRoleForOrganisation, getRoleForGroup, findGroupsWithRole } from '../../../common/permissions'

export default {
  name: 'k-member-card',
  mixins: [mixins.baseItem],
  computed: {
    tags () {
      // Check for custom tags field
      let tags = this.options.tagsField ? _.get(this.item, this.options.tagsField, '') : this.item.tags
      // Filter tags from current context
      tags = _.filter(tags, { context: this.$store.get('context._id') })
      // Then process icons
      tags.forEach(tag => processIcon(tag))
      return tags
    },
    memberGroups () {
      return _.filter(this.item.groups, { context: this.contextId })
    },
    role () {
      const role = getRoleForOrganisation(this.item, this.contextId)
      if (!_.isUndefined(role)) return Roles[role]
      return ''
    },
    expireAt () {
      return this.item.expireAt ? new Date(this.item.expireAt) : null
    }
  },
  methods: {
    refreshActions () {
      this.clearActions()
      if (!this.item.expireAt) {
        if (this.$can('update', 'members', this.contextId)) {
          this.registerPaneAction({
            name: 'tag-member',
            label: this.$t('KMemberCard.TAG_LABEL'),
            icon: 'las la-tags',
            route: { name: 'tag-member', params: { contextId: this.contextId, objectId: this.item._id } }
          })
        }
        if (this.$can('update', 'members', this.contextId)) {
          this.registerPaneAction({
            name: 'change-role',
            label: this.$t('KMemberCard.CHANGE_ROLE_LABEL'),
            icon: 'las la-graduation-cap',
            route: { name: 'change-role', params: { contextId: this.contextId, objectId: this.item._id, resource: { id: this.contextId, scope: 'organisations', service: 'organisations' } } }
          })
        }
        if (this.$can('remove', 'authorisations', this.contextId, { resource: this.contextId })) {
          this.registerMenuAction({
            name: 'remove-member',
            label: this.$t('KMemberCard.REMOVE_LABEL'),
            icon: 'las la-minus-circle',
            handler: this.removeMember
          })
        }
      } else {
        if (this.$can('update', 'members', this.contextId)) {
          this.registerPaneAction({
            name: 'reissue-invitation',
            label: this.$t('KMemberCard.REISSUE_INVITATION_LABEL'),
            icon: 'las la-envelope',
            handler: this.reissueInvitation
          })
        }
      }
    },
    reissueInvitation (member) {
      console.log('reissue invitation')
    },
    removeMember (member) {
      Dialog.create({
        title: this.$t('KMemberCard.REMOVE_DIALOG_TITLE', { member: member.name }),
        message: this.$t('KMemberCard.REMOVE_DIALOG_MESSAGE', { member: member.name }),
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
        const authorisationService = this.$api.getService('authorisations')
        authorisationService.remove(this.contextId, {
          query: {
            scope: 'organisations',
            subjects: member._id,
            subjectsService: this.contextId + '/members',
            resourcesService: 'organisations'
          }
        })
      })
    },
    groupKey (group) {
      return this.item._id + group._id
    },
    groupInitials (group) {
      return getInitials(group.name)
    },
    roleIcon (role) {
      return this.roleIcons[role]
    },
    roleLabel (role) {
      return this.roleLabels[role]
    },
    roleForGroup (group) {
      const role = getRoleForGroup(this.item, this.contextId, group._id)
      if (!_.isUndefined(role)) return Roles[role]
      return ''
    },
    canJoinGroup () {
      const user = this.$store.get('user')
      // Can add members to a group if at least manager/owner of one
      const groups = findGroupsWithRole(user, this.contextId, Roles.manager)
        .concat(findGroupsWithRole(user, this.contextId, Roles.owner))
      // FIXME: we should also filter by the member groups so that if already added to all my groups we don't show the action
      return groups.length > 0
    },
    canChangeRoleInGroup (group) {
      return this.$can('create', 'authorisations', this.item._id, { resource: group._id })
    },
    canLeaveGroup (group) {
      return this.$can('remove', 'authorisations', this.item._id, { resource: group._id })
    },
    onChangeRoleInGroup (group) {
      this.$router.push({ name: 'change-role', params: { contextId: this.contextId, objectId: this.item._id, resource: { id: group._id, scope: 'groups', service: this.contextId + '/groups' } } })
    },
    onJoinGroup () {
      this.$router.push({ name: 'join-group', params: { contextId: this.contextId, objectId: this.item._id } })
    },
    onLeaveGroup (group) {
      Dialog.create({
        title: this.$t('KMemberCard.LEAVE_GROUP_DIALOG_TITLE', { group: group.name }),
        message: this.$t('KMemberCard.LEAVE_GROUP_DIALOG_MESSAGE', { group: group.name, member: this.item.name }),
        html: true,
        ok: {
          label: this.$t('OK')
        },
        cancel: {
          label: this.$t('CANCEL')
        }
      }).onOk(() => {
        const authorisationService = this.$api.getService('authorisations')
        authorisationService.remove(group._id, {
          query: {
            scope: 'groups',
            subjects: this.item._id,
            subjectsService: this.contextId + '/members',
            resourcesService: this.contextId + '/groups'
          }
        })
      })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-tags-pane'] = this.$load('team/KTagsPane')
    // Load the role configuration
    this.roleIcons = this.$config('roles.icons')
    this.roleLabels = this.$config('roles.labels')
  }
}
</script>
