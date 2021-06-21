<template>
  <k-card 
    v-bind="$props"
    :header="header"
    :actions="itemActions" 
    :bind-actions="false">
    <!--
      Card content
     -->
    <div slot="card-content">
      <!-- Description -->
      <k-card-section :title="$t('KGroupCard.DESCRIPTION_SECTION')" :actions="descriptionActions">
        <div v-if="hasDescription">
          <k-text-area :text="item.description" />
        </div>
        <div v-else> 
          {{ $t('KGroupCard.NO_DESCRIPTION_LABEL')}}
        </div>
      </k-card-section>
      <!-- Members -->
      <k-card-section :title="$t('KGroupCard.MEMBERS_SECTION')">
        <q-list>
          <q-item
            id="list-members"
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
        </q-list>
      </k-card-section>
    </div>
  </k-card>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'
import { findMembersOfGroup, getRoleForGroup, Roles, RoleNames } from '../../../common/permissions'
import { KCard, KCardSection } from '../collection'
import { KTextArea } from '../frame'

export default {
  name: 'k-group-card',
  components: {
    KCard,
    KCardSection,
    KTextArea
  },
  mixins: [mixins.baseItem],
  data () {
    return {
      membersCount: 0,
      memberStats: {},
      roleLabels: []
    }
  },
  computed: {
    header () {
      return [
        { component: 'QBadge', label: this.$t(this.memberRoleLabel), color: 'grey-7' },
        { component: 'QSpace' },
        { 
          id: 'edit-group', icon: 'las la-edit', size: 'sm', tooltip: 'KGroupCard.EDIT_ACTION',
          visible: this.$can('update', 'groups', this.contextId, this.item),
          handler: this.editItem
        },
        {
          id: 'remove-group', icon: 'las la-trash', size: 'sm', tooltip: 'KGroupCard.REMOVE_ACTION',
          visible: this.$can('remove', 'groups', this.contextId, this.item),
          handler: () => this.removeItem('confirm')
        }
      ]
    },
    descriptionActions () {
      return [{ 
        id: 'edit-description', icon: 'las la-edit', size: 'sm', tooltip: 'KGroupCard.EDIT_ACTION', 
        visible: this.$can('update', 'groups', this.contextId, this.item),
        route: { name: 'edit-group-description', params: { contextId: this.contextId, objectId: this.item._id } }
      }]
    },
    hasDescription () {
      return !_.isEmpty(this.item.description)
    },
    memberRoleLabel () {
      const user = this.$store.get('user')
      const role = getRoleForGroup(user, this.contextId, this.item._id)
      if (!_.isUndefined(role)) return this.roleLabels[Roles[role]]
      else return ''
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
      this.$router.push({ name: 'members-activity', params: { contextId: this.contextId, mode: 'filter' } 
      })
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
