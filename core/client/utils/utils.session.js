import logger from 'debug'
import { Store } from '../store.js'
import { api } from '../api.js'
import { i18n } from '../i18n.js'
import { defineAbilities } from '../../common/permissions.js'

export async function login (email, password) {
  const payload = {
    strategy: 'local',
    email: email,
    password: password
  }
  const response = await api.authenticate(payload)
  // Anonymous user or service account ?
  const user = response.user ? response.user : { name: i18n.t('composables.ANONYMOUS'), anonymous: true }
  Store.set('user', user)
}

export async function register (user) {
  delete user.confirmPassword
  await api.getService('users').create(user)
  await login(user.email, user.password)
}

export async function logout () {
  try {
    await api.logout()
  } catch (error) {
    logger.warn(`[KDK] logout session failed: ${error}`)
    await api.authentication.removeAccessToken()
  }
  Store.set('user', null)
}

export async function restoreSession () {
  try {
    const response = await api.reAuthenticate()
    const user = response.user ? response.user : { name: i18n.t('composables.ANONYMOUS'), anonymous: true }
    Store.set('user', user)
  } catch (error) {
    // This ensure an old token is not kept when the user has been deleted
    if (error.code === 404) await logout()
    // Rethrow for caller to handle
    throw error
  }
}

export async function updateAbilities () {
  const user = Store.get('user')
  if (!user) return
  if (user.abilities) return
  const abilities = await defineAbilities(user, api)
  Store.set('user.abilities', abilities)
  if (abilities) {
    logger.debug('[KDK] New user abilities: ', abilities.rules)
  }
}

function updateUser (user) {
  // Check whether we need to update the current user
  if (user._id === Store.get('user._id')) {
    Store.patch('user', user)
  }
}

export function subscribeToUserChanges () {
  // Listen to the 'patched' event on the users
  const users = api.getService('users')
  users.on('patched', updateUser)
}

export function unsubscribeToUserChanges () {
  // Listen to the 'patched' event on the users
  const users = api.getService('users')
  users.off('patched', updateUser)
}
