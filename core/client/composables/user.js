import logger from 'debug'
import { ref, readonly } from 'vue'
import { api } from '../api.js'
import { i18n } from '../i18n.js'
import { Store } from '../store.js'
import { defineAbilities } from '../../common/permissions.js'

const User = ref(null)

export function useUser () {
  // Functions
  async function updateAbilities () {
    if (!User.value) return
    if (User.value.abilities) return
    User.value.abilities = await defineAbilities(User.value, api)
    // TODO: ensure backward compatibility
    Store.set('user.abilities', User.value.abilities)
    if (User.value.abilities) {
      logger.debug('New user abilities: ', User.value.abilities.rules)
    }
  }
  async function restoreSession () {
    try {
      const response = await api.reAuthenticate()
      User.value = response.user ? response.user : { name: i18n.t('composables.ANONYMOUS'), anonymous: true }
      // TODO: ensure backward compatibility
      Store.set('user', User.value)
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
    User.value = response.user ? response.user : { name: i18n.t('composables.ANONYMOUS'), anonymous: true }
    // TODO: ensure backward compatibility
    Store.set('user', User.value)
  }
  async function logout () {
    await api.logout()
    User.value = null
    // TODO: ensure backward compatibility
    Store.set('user', null)
  }

  // Expose
  return {
    User: readonly(User),
    updateAbilities,
    restoreSession,
    register,
    login,
    logout
  }
}
