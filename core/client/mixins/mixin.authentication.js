// import { Platform } from 'quasar'

export const authentication = {
  methods: {
    async restoreUser (authenticationResponse) {
      // Anonymous user or service account ?
      const user = (!authenticationResponse.user
        ? { name: this.$t('ANONYMOUS'), anonymous: true }
        : authenticationResponse.user)
      this.$store.set('user', user)
      return user
    },
    async register (user) {
      delete user.confirmPassword
      await this.$api.getService('users').create(user)
      await this.login(user.email, user.password)
    },
    async restoreSession () {
      try {
        const response = await this.$api.reAuthenticate()
        const user = await this.restoreUser(response)
        return user
      } catch (error) {
        // This ensure an old token is not kept when the user has been deleted
        if (error.code === 404) {
          await this.$api.authentication.removeAccessToken()
          await this.logout()
        }
        // Rethrow for caller to handle
        throw error
      }
    },
    async login (email, password) {
      const payload = {
        strategy: 'local',
        email: email,
        password: password
      }
      const response = await this.$api.authenticate(payload)
      await this.restoreUser(response)
    },
    async logout () {
      await this.$api.logout()
      this.$store.set('user', null)
    }
  }
}
