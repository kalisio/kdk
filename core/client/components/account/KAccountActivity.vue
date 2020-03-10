<template>
  <q-page v-if="objectId !== ''" padding>
    <div v-if="perspective === 'profile'">
      <k-editor service="users" :objectId="objectId" perspective="profile"/>
    </div>
    <div v-if="perspective === 'security'">
      <k-account-security :objectId="objectId" :email="email" />
    </div>
    <div v-else-if="perspective === 'danger-zone'">
      <k-account-dz :objectId="objectId" :name="name" />
    </div>
  </q-page>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-account-activity',
  mixins: [
    mixins.baseActivity
  ],
  props: {
    perspective: {
      type: String,
      required: true,
      validator: (value) => {
        return ['profile', 'security', 'danger-zone'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      objectId: '',
      name: '',
      email: ''
    }
  },
  methods: {
    refreshActivity () {
      this.clearActivity()
      this.setTitle(this.$store.get('user.name'))
      this.registerTabAction({
        name: 'profile',
        label: this.$t('KAccountActivity.PROFILE'),
        icon: 'description',
        route: { name: 'account-activity', params: { perspective: 'profile' } },
        default: this.perspective === 'profile'
      })
      this.registerTabAction({
        name: 'security',
        label: this.$t('KAccountActivity.SECURITY'),
        icon: 'security',
        route: { name: 'account-activity', params: { perspective: 'security' } },
        default: this.perspective === 'security'
      })
      this.registerTabAction({
        name: 'danger-zone',
        label: this.$t('KAccountActivity.DANGER_ZONE'),
        icon: 'warning',
        route: { name: 'account-activity', params: { perspective: 'danger-zone' } },
        default: this.perspective === 'danger-zone'
      })
    },
    refreshAccount () {
      this.objectId = this.$store.get('user._id', '')
      this.name = this.$store.get('user.name', '')
      this.email = this.$store.get('user.email', '')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-editor'] = this.$load('editor/KEditor')
    this.$options.components['k-account-security'] = this.$load('account/KAccountSecurity')
    this.$options.components['k-account-dz'] = this.$load('account/KAccountDZ')
    // Refresh this component
    this.refreshAccount()
    this.$events.$on('user-changed', this.refreshAccount)
  },
  beforeDestroy () {
    this.$events.$off('user-changed', this.refreshAccount)
  }
}
</script>
