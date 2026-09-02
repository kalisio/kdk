import {
  serialize, updateAbilities, populatePreviousObject, hashPassword, disallowRegistration, allowLocalAuthentication,
  discardAuthenticationProviders, enforcePasswordPolicy, storePreviousPassword, sendNewSubscriptionEmail
} from '../../hooks/index.js'
import { when, discard, disallow } from 'feathers-hooks-common'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      when(disallowRegistration, disallow('external')),
      // Initialize a profile from base user information
      serialize([
        { source: 'name', target: 'profile.name', delete: true },
        { source: 'email', target: 'profile.description' }
      ], { throwOnNotFound: true }),
      when(allowLocalAuthentication,
        serialize([
          // Enforcing password policy requires both the clear and hashed password,
          // Keep track of clear password here since hashPassword() remove it
          // FIXME: for testing purpose we create users without a password for now
          // should it be fixed for safety ?
          { source: 'password', target: 'clearPassword' }
        ], { throwOnNotFound: false }),
        hashPassword('password'),
        enforcePasswordPolicy({ userAsItem: true }),
        // Now we have enforced password policy remove the clear password
        // (we only store hashed password for safety)
        discard('clearPassword')
      )
    ],
    // when changing password store previous one for password policy
    update: [
      when(hook => hook.data.password && hook.app.getPasswordPolicy,
        populatePreviousObject, storePreviousPassword({ userAsItem: true }))
    ],
    patch: [
      when(hook => hook.data.password && hook.app.getPasswordPolicy,
        populatePreviousObject, storePreviousPassword({ userAsItem: true }))
    ],
    remove: []
  },

  after: {
    all: [
      when(hook => hook.params.provider,
        discard('password'),
        discard('previousPasswords'),
        discardAuthenticationProviders)
      // Hide profile for external user as it may contain personal information
      // However, this causes an issue: https://github.com/feathersjs-ecosystem/feathers-reactive/issues/214
      // So let the application decide what to do
      // commonHooks.when(isNotMe, commonHooks.discard('profile'))
    ],
    find: [],
    get: [],
    create: [updateAbilities({ subjectAsItem: true })],
    update: [updateAbilities({ subjectAsItem: true })],
    // Fetch user in this case as we might only have partial data and miss permission properties
    patch: [updateAbilities({ subjectAsItem: true, fetchSubject: true }), sendNewSubscriptionEmail],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
