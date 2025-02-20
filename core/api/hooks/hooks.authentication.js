import makeDebug from 'debug'
import common from 'feathers-hooks-common'
import local from '@feathersjs/authentication-local'

const debug = makeDebug('kdk:core:authentication:hooks')
const { discard } = common

// Make it more easy to access
export const hashPassword = local.hooks.hashPassword

export function discardAuthenticationProviders (hook) {
  const providers = hook.app.authenticationProviders || []

  // Iterate through known providers
  for (const provider of providers) {
    discard(provider)(hook)
  }
}
