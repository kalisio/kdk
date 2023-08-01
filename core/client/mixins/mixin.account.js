export const account = {
  methods: {
    resendVerifySignup (email) {
      return this.accountService.create({
        action: 'resendVerifySignup',
        value: { email }
      })
    },
    verifySignup (token, email) {
      return this.accountService.create({
        action: 'verifySignupShort',
        value: {
          user: { email },
          token
        }
      })
    },
    sendResetPassword (email) {
      return this.accountService.create({
        action: 'sendResetPwd',
        value: { email }
      })
    },
    resetPassword (email, token, password) {
      return this.accountService.create({
        action: 'resetPwdShort',
        value: {
          user: { email },
          token,
          password
        }
      })
    },
    changePassword (email, oldPassword, password) {
      return this.accountService.create({
        action: 'passwordChange',
        value: {
          user: { email },
          oldPassword,
          password
        }
      })
    },
    sendChangeIdentity (oldEmail, email, password) {
      return this.accountService.create({
        action: 'identityChange',
        value: {
          user: { email: oldEmail },
          changes: { email },
          password
        }
      })
    },
    changeIdentity (token) {
      return this.verifySignup(token)
    }
  },
  created () {
    this.accountService = this.$api.getService('account')
  }
}
