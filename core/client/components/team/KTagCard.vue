<template>
  <k-card v-bind="$props" :actions="itemActions" :options="{ nameField: 'value' }">
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
    onListMembers () {
      // Setup filter accordingly
      this.$store.patch('filter', {
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
