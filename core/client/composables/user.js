import { ref, readonly } from 'vue'
import { api } from '../api.js'
import { i18n } from '../i18n.js'
import { Store } from '../store.js'

const User = ref(null)

export function useUser () {

  // functions
  async function restoreSession () {
    try {
      const response = await api.reAuthenticate()
      const user = response.user ? response.user : { name: i18b.t('composables.ANONYMOUS'), anonymous: true }
      Store.set('user', user)
      User.value = user
    } catch (error) {
      // This ensure an old token is not kept when the user has been deleted
      if (error.code === 404) {
        await api.authentication.removeAccessToken()
        await logout()
      }
      // Rethrow for caller to handle
      throw error
    }
  }
  async function register (user) {
    delete user.confirmPassword
    await api.getService('users').create(user)
    await login(user.email, user.password)
  }
  async function login (email, password) {
    const payload = {
      strategy: 'local',
      email: email,
      password: password
    }
    const response = await api.authenticate(payload)
    // Anonymous user or service account ?
    const user = response.user ? response.user : { name: i18n.t('composables.ANONYMOUS'), anonymous: true }
    Store.set('user', user)
    User.value = user
  }
  async function logout () {
    await api.logout()
    Store.set('user', null)
    User.value = null
  }

  // expose
  return {
    User: readonly(User),
    restoreSession,
    register,
    login,
    logout
  }
}