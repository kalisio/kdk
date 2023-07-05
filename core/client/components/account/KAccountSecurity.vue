<template>
  <div v-if="user" class="full-width column q-gutter-y-md">
    <!--
      Change password
    -->
    <KBlock
      id="password-block"
      color="#DDDDDD"
      :title="$t('KAccountSecurity.PASSWORD_BLOCK_TITLE')"
      :text="$t('KAccountSecurity.PASSWORD_BLOCK_TEXT')"
      :action="getChangePasswordAction()"
    />
    <!--
      Change email
    -->
    <KBlock
      id="email-block"
      color="#FFE68B"
      :title="$t('KAccountSecurity.EMAIL_BLOCK_TITLE')"
      :text="$t('KAccountSecurity.EMAIL_BLOCK_TEXT', { email })"
      :action="getChangeEmailAction()"
    />
    <!--
      Separator
    -->
    <q-separator inset />
    <!--
      Devices
    -->
    <KAccountSubscriptions
      id="subscriptions-block"
      :renderer="subscriptionRenderer"
    />
  </div>
</template>

<script>
import KBlock from '../KBlock.vue'
import KAccountSubscriptions from './KAccountSubscriptions.vue'

export default {
  components: {
    KBlock,
    KAccountSubscriptions
  },
  props: {
    subscriptionRenderer: {
      type: Object,
      default: () => ({ component: 'account/KSubscriptionCard' })
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
    getChangePasswordAction () {
      return {
        id: 'change-password',
        label: 'KAccountSecurity.PASSWORD_BLOCK_ACTION',
        renderer: 'form-button',
        handler: this.onChangePassword
      }
    },
    getChangeEmailAction () {
      return {
        id: 'change-email',
        label: 'KAccountSecurity.EMAIL_BLOCK_ACTION',
        renderer: 'form-button',
        handler: this.onChangeEmail
      }
    },
    onChangePassword () {
      this.$router.push({ name: 'change-password' })
    },
    onChangeEmail () {
      this.$router.push({ name: 'send-change-identity' })
    }
  }
}
</script>
