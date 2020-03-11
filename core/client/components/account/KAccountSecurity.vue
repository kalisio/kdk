<template>
  <div class="row q-gutter-md">
    <!--
      Change password
    -->
    <k-block
      class="col-12"
      color="grey"
      :title="$t('KAccountSecurity.PASSWORD_BLOCK_TITLE')"
      :text="$t('KAccountSecurity.PASSWORD_BLOCK_TEXT')"
      :action="$t('KAccountSecurity.PASSWORD_BLOCK_ACTION')"
      @action-triggered="onChangePassword" />
    <!--
      Change email
    -->
    <k-block
      class="col-12"
      color="orange"
      :title="$t('KAccountSecurity.EMAIL_BLOCK_TITLE')"
      :text="$t('KAccountSecurity.EMAIL_BLOCK_TEXT', { email })"
      :action="$t('KAccountSecurity.EMAIL_BLOCK_ACTION')"
      @action-triggered="onChangeEmail" />
    <!--
      Separator
    -->
    <q-separator />
    <!--
      Devices
    -->
    <k-account-devices class="col-12" />
  </div>
</template>

<script>
export default {
  name: 'k-account-security',
  components: {
    KBlock
  },
  props: {
    email: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      hasDevices: false
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
