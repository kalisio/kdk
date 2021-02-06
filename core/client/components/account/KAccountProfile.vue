<template>
  <k-editor v-if="user" service="users" :objectId="user._id" perspective="profile"/>
</template>

<script>
export default {
  name: 'k-account-profile',
  data () {
    return {
      user: this.$store.get('user')
    }
  },
  created () {
    // Load the components
    this.$options.components['k-editor'] = this.$load('editor/KEditor')
  }
}
</script>