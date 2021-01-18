<template>
  <div v-if="user" class="column content-center q-pa-sm q-gutter-y-sm" style="background-color: lightgrey;">
    <!--
      User avatar
    -->
    <div class="row justify-center">
      <q-avatar v-if="avatar.uri"><img :src="avatar.uri"></q-avatar>
      <q-avatar v-else size="96px" color="primary" text-color="white">{{ avatar.initials }}</q-avatar>
    </div>
    <!--
      User information
    -->
    <div class="row justify-center items-center">
      <span class="text-subtitle1">{{ user.name }}</span>
      <k-action id="manage-account" icon="las la-cog" :tooltip="$t('KIdentityPanel.MANAGE')" :route="{ name: 'account-activity', params: { mode: 'profile' } }" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { getInitials } from '../../utils'

export default {
  name: 'k-identity-panel',
  data () {
    return {
      user: this.$store.get('user'),
      avatar: {
        Uri: null,
        initials: null
      }
    }
  },
  methods: {
    async refresh () {
      if (this.user) {
        const avatarId = _.get(this.user, 'avatar._id', null)
        if (avatarId) {
          // Then we need to fetch it from global storage service
          // Force global context as a storage service might also be available as contextual
          const data = await this.$api.getService('storage', '').get(avatarId + '.thumbnail')
          // Get as data URI
          this.avatar = { uri: data.uri, initials: null }
        } else {
          this.avatar = { uri: null, initials: getInitials(this.user.name) }
        }
      } else {
        this.avatar = { uri: null, initials: null }
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
    // Initialize the component
    this.refresh()
    this.$events.$on('user-changed', this.refresh)
  },
  beforeDestroy () {
    this.$events.$off('user-changed', this.refresh)
  }
}
</script>
