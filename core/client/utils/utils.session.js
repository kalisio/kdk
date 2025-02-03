import _ from 'lodash'
import logger from 'debug'
import { LocalCache } from '../local-cache.js'
import { Store } from '../store.js'
import { api } from '../api.js'
import { i18n } from '../i18n.js'
import { defineAbilities } from '../../common/permissions.js'

async function authenticate(authentication) {
  // Do not update data twice in any case
  let user = Store.get('user')
  if (user) return
  // Store latest authentication data for offline mode
  await LocalCache.setItem('authentication', authentication)
  // Anonymous user or user account ?
  user = authentication.user ? authentication.user : { name: i18n.t('composables.ANONYMOUS'), anonymous: true }
  Store.set('user', user)
  await updateAbilities()
}

export async function login (email, password) {
  const payload = {
    strategy: 'local',
    email: email,
    password: password
  }
  const authentication = await api.authenticate(payload)
  await authenticate(authentication)
}

export async function register (user) {
  delete user.confirmPassword
  await api.getService('users').create(user)
  await login(user.email, user.password)
}

export async function logout () {
  try {
    await LocalCache.removeItem('authentication')
    await api.logout()
    Store.set('user', null)
  } catch (error) {
    // This ensure user is unset and an old token is not kept e.g. when the user has been deleted
    Store.set('user', null)
    await api.authentication.removeAccessToken()
    // Rethrow for caller to handle
    throw error
  }
}

export async function restoreSession () {
  try {
    let authentication
    if (api.isDisconnected) {
      authentication = await LocalCache.getItem('authentication')
      if (authentication) {
        // In this specific case as we bypass actual authentication the events will not be emitted
        api.emit('login', authentication)
        api.emit('authenticated', authentication)
      }
    } 
    // In local first mode we allow to use remote service if offline information doesn't exist
    if (!authentication) {
      authentication = await api.reAuthenticate()
    }
    await authenticate(authentication)
  } catch (error) {
    // This ensure an old token is not kept e.g. when the user has been deleted
    // It actually causes a call to the remove method on the authentication service, which fails due to missing access token
    // See https://github.com/kalisio/kdk/issues/757, as a consequence we prefer to clean the token manually instead
    // await logout()
    await api.authentication.removeAccessToken()
    // Rethrow for caller to handle
    throw error
  }
}

export async function updateAbilities () {
  const user = Store.get('user')
  if (!user) return
  const abilities = await defineAbilities(user, api)
  const previousAbilities = Store.get('user.abilities')
  const rules = _.get(abilities, 'rules')
  const previousRules = _.get(previousAbilities, 'rules')
  // Update only whenever required, eg updating user profile should not change abilities
  if (!_.isEqual(rules, previousRules)) {
    Store.set('user.abilities', abilities)
    logger.debug('[KDK] New user abilities: ', abilities.rules)
  }
}

export async function updateUser (user) {
  // Check whether we need to update the current user
  if (user._id === Store.get('user._id')) {
    Store.patch('user', user)
    await updateAbilities()
  }
}

export async function logoutUser (user) {
  // User has logout from another client session, logout here as well.
  // No check required for user ID as only the target user should receive the logout event.
  // We cannot use the logout route directly or api.logout() as this will trigger a new remove request to the authentication service.
  // Here we just want to set the application state "as if" the user as requested a logout without doing it actually.
  await LocalCache.removeItem('authentication')
  await api.authentication.removeAccessToken()
  await api.authentication.reset()
  Store.set('user', null)
  // In this specific case as we bypass actual authentication the events will not be emitted
  api.emit('logout', user)
}

export function subscribeToUserChanges () {
  // Listen to the 'patched'/'logout' event on the users
  const users = api.getService('users')
  users.on('patched', updateUser)
  users.on('logout', logoutUser)
}

export function unsubscribeToUserChanges () {
  // Listen to the 'patched'/'logout' event on the users
  const users = api.getService('users')
  users.off('patched', updateUser)
  users.off('logout', logoutUser)
}
