<template>
  <k-card v-bind="$props" :itemActions="actions" :options="{ nameField: 'value' }">
    <div slot="card-label">
      <span class="text-subtitle1 text-weight-medium ellipsis">{{ item.value }}</span>
      <q-btn class="float-right" :key="item._id" flat small rounded color="primary"
          id="tag-count" :icon="roleIcons[0]" :label="item.count"/>
    </div>
  </k-card>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-tag-card',
  mixins: [mixins.baseItem],
  methods: {
    refreshActions () {
      this.clearActions()
      this.setActions([
        {
          name: 'edit-tag',
          tooltip: this.$t('KTagCard.EDIT_LABEL'),
          icon: 'las la-file-alt',
          visible: this.$can('update', 'tags', this.contextId, this.item),
          route: { name: 'edit-tag', params: { contextId: this.contextId, objectId: this.item._id } }
        },
        {
          name: 'list-members',
          tooltip: this.$t('KTagCard.LIST_MEMBERS_LABEL'),
          icon: 'las la-user-tag',
          handler: this.onListMembers
        }
      ])
    },
    onListMembers () {
      // Setup search bar accordingly
      this.$store.patch('searchBar', {
        items: [Object.assign({
          service: 'tags',
          field: 'value'
        }, this.item)]
      })
      this.$router.push({ name: 'members-activity', params: { contextId: this.contextId } })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-tags-pane'] = this.$load('team/KTagsPane')
    // We will use the member role to illustrate the number of users with the tag
    this.roleIcons = this.$config('roles.icons')
  }
}
</script>
