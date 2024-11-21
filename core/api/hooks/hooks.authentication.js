import makeDebug from 'debug'
import common from 'feathers-hooks-common'
import local from '@feathersjs/authentication-local'

const debug = makeDebug('kdk:core:authentication:hooks')
const { discard } = common

// Make it more easy to access
export const hashPassword = local.hooks.hashPassword

export async function verifyGuest (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'verifyGuest\' hook should only be used as a \'after\' hook.')
  }
  const app = hook.app
  const user = hook.result.user
  if (!user) return hook
  debug('verifyGuest hook called on ', user._id)

  // Check whether the user has been invited. If not, nothing to do
  if (!user.sponsor) {
    debug('Logged user is not a guest')
    return hook
  }

  // Check whether has been already verified. If yes, nothing to do
  if (user.isVerified) {
    debug('Logged guest is already verified')
    return hook
  }

  // The user is a guest and need to be verified
  debug('Verifying logged guest')
  const userService = app.getService('users')
  await userService.patch(user._id, { isVerified: true })

  return hook
}

export async function consentGuest (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'consentGuest\' hook should only be used as a \'after\' hook.')
  }
  const app = hook.app
  const user = hook.result.user
  if (!user) return hook
  debug('consentGuest hook called on ', user._id)

  // Check whether the user has been invited. If not, nothing to do
  if (!user.sponsor) {
    debug('Logged user is not a guest')
    return hook
  }

  // Check whether consent has been already checked. If yes, nothing to do
  if (user.consentTerms) {
    debug('Logged guest is already verified')
    return hook
  }

  // The user is a guest and need to be consent
  debug('Consenting logged guest')
  const userService = app.getService('users')
  await userService.patch(user._id, { consentTerms: true, expireAt: null })

  return hook
}

export function discardAuthenticationProviders (hook) {
  const providers = hook.app.authenticationProviders || []

  // Iterate through known providers
  for (const provider of providers) {
    discard(provider)(hook)
  }
}
