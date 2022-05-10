// import { Platform } from 'quasar'

export const authentication = {
  methods: {
    async restoreUser (accessToken) {
      const payload = await this.$api.passport.verifyJWT(accessToken)
      // Anonymous user or service account ?
      const user = (!payload.userId
        ? { name: this.$t('ANONYMOUS'), anonymous: true }
        : await this.$api.getService('users').get(payload.userId))
      this.$store.set('user', user)
      return user
    },
    async register (user) {
      delete user.confirmPassword
      await this.$api.getService('users').create(user)
      await this.login(user.email, user.password)
    },
    async restoreSession () {
      const response = await this.$api.authenticate()
      try {
        const user = await this.restoreUser(response.accessToken)
        return user
      } catch (error) {
        // This ensure an old token is not kept when the user has been deleted
        if (error.code === 404) await this.logout()
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
      await this.restoreUser(response.accessToken)
    },
    async logout () {
      await this.$api.logout()
      this.$store.set('user', null)
    }
  }
}
