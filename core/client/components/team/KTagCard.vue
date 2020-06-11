<template>
  <k-card v-bind="$props" :itemActions="actions" :options="{ nameField: 'value' }">
    <div slot="card-label">
      <span class="text-subtitle1 text-weight-medium ellipsis">{{ item.value }}</span>
      <q-btn class="float-right" :key="item._id" flat small rounded color="primary"
          :icon="roleIcons[0]" :label="item.count"/>
    </div>
  </k-card>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'
import { RoleNames } from '../../../common/permissions'

export default {
  name: 'k-tag-card',
  mixins: [mixins.baseItem],
  data () {
    return {
      
    }
  },
  methods: {
    refreshActions () {
      this.clearActions()
      if (this.$can('update', 'tags', this.contextId, this.item)) {
        this.registerPaneAction({
          name: 'edit-tag',
          label: this.$t('KTagCard.EDIT_LABEL'),
          icon: 'las la-file-alt',
          route: { name: 'edit-tag', params: { contextId: this.contextId, objectId: this.item._id } }
        })
      }
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
