<template>
  <div v-if="user" class="column content-center q-pa-sm q-gutter-y-sm bg-grey-4">
    <!--
      User avatar
    -->
    <div class="row justify-center">
      <k-avatar :key="avatarKey" :object="user" size="8rem" />
    </div>
    <!--
      User information
    -->
    <div class="row justify-center items-center">
      <span class="text-subtitle1">{{ user.name }}</span>
      <k-action
        id="manage-account"
        icon="las la-user-cog"
        :tooltip="$t('KIdentityPanel.MANAGE')"
        :route="{ name: 'account-activity', params: { page: 'profile' } }"
        @triggered="$emit('triggered', arguments)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'k-identity-panel',
  data () {
    return {
      user: this.$store.get('user'),
      avatarKey: 1
    }
  },
  methods: {
    async refresh () {
      // Force the avatar to be refreshed
      this.avatarKey++
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
    // Initialize the component
    this.refresh()
    this.$events.$on('user-changed', this.refresh)
  },
  beforeDestroy () {
    this.$events.$off('user-changed', this.refresh)
  }
}
</script>
