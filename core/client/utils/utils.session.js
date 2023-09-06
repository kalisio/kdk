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
  await updateAbilities()
}

export async function register (user) {
  delete user.confirmPassword
  await api.getService('users').create(user)
  await login(user.email, user.password)
}

export async function logout () {
  await api.logout()
  Store.set('user', null)
}

export async function restoreSession () {
  try {
    const response = await api.reAuthenticate()
    const user = response.user ? response.user : { name: i18n.t('composables.ANONYMOUS'), anonymous: true }
    Store.set('user', user)
    await updateAbilities()
  } catch (error) {
    // This ensure an old token is not kept e.g. when the user has been deleted
    // await logout()
    // It actually causes a call to the remove method on the authentication service, which fails due to missing access token
    // See https://github.com/kalisio/kdk/issues/757, as a consequence we prefer to clean the token manually instead
    await api.removeAccessToken()
    // Rethrow for caller to handle
    throw error
  }
}

export async function updateAbilities () {
  const user = Store.get('user')
  if (!user) return
  const abilities = await defineAbilities(user, api)
  const previousAbilities = Store.get('user.abilities')
  const rules = _.get(abilities, 'rules', [])
  const previousRules = _.get(previousAbilities, 'rules', [])
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
