<template>
  <k-card v-bind="$props" :itemActions="actions">

  </k-card>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-organisation-card',
  mixins: [mixins.baseItem],
  methods: {
    refreshActions () {
      this.clearActions()
      this.setActions([
        { id: 'goto-organisation', icon: 'las la-sign-in-alt', route: { name: 'context', params: { contextId: this.item._id } } }
      ])
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    // We will use the member role to illustrate the number of users with the tag
    this.roleIcons = this.$config('roles.icons')
  }
}
</script>
