import _ from 'lodash'
import logger from 'debug'
import { LocalForage } from '@kalisio/feathers-localforage'
import { Store } from '../store.js'
import { api } from '../api.js'
import { i18n } from '../i18n.js'
import { defineAbilities } from '../../common/permissions.js'

async function authenticate(authentication) {
  // Store latest authentication data for offline mode
  await LocalForage.setItem('authentication', authentication)
  // Anonymous user or user account ?
  const user = authentication.user ? authentication.user : { name: i18n.t('composables.ANONYMOUS'), anonymous: true }
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
    await LocalForage.removeItem('authentication')
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
      authentication = await LocalForage.getItem('authentication')
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
    // await logout()
    // It actually causes a call to the remove method on the authentication service, which fails due to missing access token
    // See https://github.com/kalisio/kdk/issues/757, as a consequence we prefer to clean the token manually instead
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
