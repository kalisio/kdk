<template>
  <div class="column">
    <!--
      User avatar
    -->
    <div class="self-center" style="padding: 16px">
      <q-avatar v-if="!avatarImage" size="72px" color="primary" text-color="white">{{initials}}</q-avatar>
      <q-avatar v-if="avatarImage" size="72px"><img :src="avatarImage"></q-avatar>
    </div>
    <!--
      User information
    -->
    <div>
      <q-list>
        <q-item id="account" @click="onClickAccount" clickable v-ripple>
          <q-item-section>{{name}}</q-item-section>
          <q-item-section avatar><q-icon name="perm_identity"/></q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { getInitials } from '../../utils'

export default {
  name: 'k-identity-panel',
  data () {
    return {
      name: '',
      avatarImage: ''
    }
  },
  computed: {
    initials () { return getInitials(this.name) }
  },
  methods: {
    async refreshIdentity () {
      this.name = this.$store.get('user.name', '')
      this.objectId = this.$store.get('user._id', '')
      // This field indicates that the avatar has been set
      const avatarId = this.$store.get('user.avatar._id', '')
      if (avatarId) {
        // Then we need to fetch it from global storage service
        // Force global context as a storage service might also be available as contextual
        const data = await this.$api.getService('storage', '').get(avatarId + '.thumbnail')
        // Get as data URI
        this.avatarImage = data.uri
      } else {
        this.avatarImage = ''
      }
    },
    onClickAccount () {
      this.$router.push({ name: 'account-activity', params: { perspective: 'profile' } })
    }
  },
  created () {
    this.refreshIdentity()
    this.$events.$on('user-changed', this.refreshIdentity)
  },
  beforeDestroy () {
    this.$events.$off('user-changed', this.refreshIdentity)
  }
}
</script>
