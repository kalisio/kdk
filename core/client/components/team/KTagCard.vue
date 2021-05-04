<template>
  <k-card v-bind="$props" :actions="itemActions" :bind-actions="false" :options="{ nameField: 'value' }">
    <div slot="card-label">
      <span class="text-subtitle1 text-weight-medium ellipsis">{{ item.value }}</span>
    </div>
    <!--
      Card content
     -->
    <div slot="card-content">
      <q-list bordered>
        <q-item
          id="list-members"
          clickable
          @click="onListMembers">
          <q-item-section avatar>
            <q-icon name="las la-user-friends" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ $t(`KTagCard.MEMBERS_LABEL`, { count: item.count }) }}
            </q-item-label>
            <q-tooltip>
              {{ $t(`KTagCard.VIEW_MEMBERS_LABEL`) }}
            </q-tooltip>
          </q-item-section>
        </q-item>
      </q-list>
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
      this.$router.push({ name: 'members-activity', params: { contextId: this.contextId, mode: 'filter' } })
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
