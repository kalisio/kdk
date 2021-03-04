<template>
  <div v-if="user" class="full-width column q-gutter-y-md">
    <!--
      Change password
    -->
    <k-block
      id="password-block"
      color="grey"
      :title="$t('KAccountSecurity.PASSWORD_BLOCK_TITLE')"
      :text="$t('KAccountSecurity.PASSWORD_BLOCK_TEXT')"
      :action="$t('KAccountSecurity.PASSWORD_BLOCK_ACTION')"
      @action-triggered="onChangePassword" />
    <!--
      Change email
    -->
    <k-block
      id="email-block"
      color="orange"
      :title="$t('KAccountSecurity.EMAIL_BLOCK_TITLE')"
      :text="$t('KAccountSecurity.EMAIL_BLOCK_TEXT', { email })"
      :action="$t('KAccountSecurity.EMAIL_BLOCK_ACTION')"
      @action-triggered="onChangeEmail" />
    <!--
      Separator
    -->
    <q-separator inset />
    <!--
      Devices
    -->
    <k-account-devices id="devices-block" :renderer="deviceRenderer"/>
  </div>
</template>

<script>
export default {
  name: 'k-account-security',
  props: {
    deviceRenderer: {
      type: Object,
      default: () => ({ component: 'account/KDeviceCard' })
    }
  },
  data () {
    return {
      user: this.$store.get('user')
    }
  },
  computed: {
    email () {
      return this.user ? this.user.email : ''
    }
  },
  methods: {
    onChangePassword () {
      this.$router.push({ name: 'change-password' })
    },
    onChangeEmail () {
      this.$router.push({ name: 'send-change-identity' })
    }
  },
  created () {
    this.$options.components['k-block'] = this.$load('frame/KBlock')
    this.$options.components['k-account-devices'] = this.$load('account/KAccountDevices')
  }
}
</script>
