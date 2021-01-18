<template>
  <k-page v-if="user" padding>
    <template v-slot:page-content>
      <div v-if="mode === 'profile'">
        <k-editor service="users" :objectId="user._id" perspective="profile"/>
      </div>
      <div v-if="mode === 'security'">
        <k-account-security />
      </div>
      <div v-else-if="mode === 'danger-zone'">
        <k-account-dz />
      </div>
    </template>
  </k-page>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-account-activity',
  mixins: [
    mixins.baseActivity
  ],
  props: {
    mode: {
      type: String,
      required: true,
      validator: (value) => {
        return ['profile', 'security', 'danger-zone'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      user: this.$store.get('user')
    }
  },
  watch: {
    mode: function (value) {
      this.setTopPaneMode(value)
    }
  },
  methods: {
    refreshActivity () {
      this.clearActivity()
      this.setTopPane({ 
        'profile': [          
          { id: 'back', icon: 'las la-arrow-left', handler: this.goBack },
          { component: 'QSeparator', vertical: true,  color: 'lightgrey' },
          { id: 'profile', icon: 'las la-user', color: 'primary', label: this.$t('KAccountActivity.PROFILE'), status: () => { return 'disabled' } },
          { id: 'security', icon: 'las la-shield-alt', tooltip: this.$t('KAccountActivity.SECURITY'), route: { name: 'account-activity', params: { mode: 'security' } } },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', tooltip: this.$t('KAccountActivity.DANGER_ZONE'), route: { name: 'account-activity', params: { mode: 'danger-zone' } } }
        ],
        'security': [
          { id: 'back', icon: 'las la-arrow-left', handler: this.goBack },
          { component: 'QSeparator', vertical: true,  color: 'lightgrey' },
          { id: 'profile', icon: 'las la-user', tooltip: this.$t('KAccountActivity.PROFILE'), route: { name: 'account-activity', params: { mode: 'profile' } } },
          { id: 'security', icon: 'las la-shield-alt', color: 'primary', label: this.$t('KAccountActivity.SECURITY'),status: () => { return 'disabled' } },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', tooltip: this.$t('KAccountActivity.DANGER_ZONE'), route: { name: 'account-activity', params: { mode: 'danger-zone' } } }
        ],
        'danger-zone': [
          { id: 'go-back', icon: 'las la-arrow-left', handler: this.goBack },
          { component: 'QSeparator', vertical: true,  color: 'lightgrey' },
          { id: 'profile', icon: 'las la-user', tooltip: this.$t('KAccountActivity.PROFILE'), route: { name: 'account-activity', params: { mode: 'profile' } } },
          { id: 'security', icon: 'las la-shield-alt', tooltip: this.$t('KAccountActivity.SECURITY'), route: { name: 'account-activity', params: { mode: 'security' } } },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', color: 'primary', label: this.$t('KAccountActivity.DANGER_ZONE'), status: () => { return 'disabled' } }
        ],
      }, this.mode)
    },
    goBack () {
      if (this.originRoute) this.$router.push(this.originRoute)
      else this.$router.push({ name: 'home' })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.originRoute = from.name ? from : null
    })
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-editor'] = this.$load('editor/KEditor')
    this.$options.components['k-account-security'] = this.$load('account/KAccountSecurity')
    this.$options.components['k-account-dz'] = this.$load('account/KAccountDZ')
  }
}
</script>
