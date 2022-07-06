import _ from 'lodash'
import {
  serialize, updateAbilities, populatePreviousObject, hashPassword,
  enforcePasswordPolicy, storePreviousPassword
} from '../../hooks/index.js'
import commonHooks from 'feathers-hooks-common'

// Helper functions
disallowRegistration = (hook) => _.get(hook.app.get('authentication'), 'disallowRegistration')
allowLocalAuthentication = (hook) => _.get(hook.app.get('authentication'), 'authStrategies', []).includes('local')

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      commonHooks.when(disallowRegistration, commonHooks.disallow('external')),
      serialize([
        { source: 'name', target: 'profile.name', delete: true },
        { source: 'email', target: 'profile.description' }
      ], { throwOnNotFound: true }),
      commonHooks.when(allowLocalAuthentication,
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
        commonHooks.discard('clearPassword')
      )
    ],
    // when changing password store previous one for password policy
    update: [
      commonHooks.when(hook => hook.data.password && hook.app.getPasswordPolicy,
        populatePreviousObject, storePreviousPassword({ userAsItem: true }))
    ],
    patch: [
      commonHooks.when(hook => hook.data.password && hook.app.getPasswordPolicy,
        populatePreviousObject, storePreviousPassword({ userAsItem: true }))
    ],
    remove: []
  },

  after: {
    all: [
      commonHooks.when(hook => hook.params.provider, commonHooks.discard('password'), commonHooks.discard('previousPasswords')),
      serialize([
        { source: 'profile.name', target: 'name' },
        { source: 'profile.avatar', target: 'avatar' },
        { source: 'profile.description', target: 'description' }
      ])
    ],
    find: [],
    get: [],
    create: [updateAbilities()],
    update: [],
    patch: [],
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
