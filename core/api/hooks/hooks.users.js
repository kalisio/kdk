import _ from 'lodash'
import makeDebug from 'debug'
import generateRandomPassword from 'password-generator'
import common from 'feathers-hooks-common'
import errors from '@feathersjs/errors'
import { Roles, RoleNames } from '../../common/permissions.js'
import authManagement from 'feathers-authentication-management'

const { Forbidden, BadRequest } = errors
const { getItems, replaceItems } = common
const verifyHooks = authManagement.hooks

const debug = makeDebug('kdk:core:users:hooks')

// Helper functions to be used in iff hooks
export function disallowRegistration (hook) {
  return _.get(hook.app.get('authentication'), 'disallowRegistration')
}
export function allowLocalAuthentication (hook) {
  return _.get(hook.app.get('authentication'), 'authStrategies', []).includes('local')
}
export function isNotMe (hook) {
  const userId = _.get(hook.params, 'user._id', '')
  const item = getItems(hook)
  const targetId = _.get(item, '_id', '')
  return userId.toString() !== targetId.toString()
}

export function enforcePasswordPolicy (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'enforePasswordPolicy\' hook should only be used as a \'before\' hook.')
    }
    // By pass check ?
    if (hook.params.force) return hook
    const app = hook.app
    const item = getItems(hook)
    const user = options.userAsItem ? item : hook.params.user
    // Get both password(s) since some rules target one and some the other one(s)
    const clearPassword = _.get(item, options.passwordField || 'clearPassword')
    const hashedPasswords = _.get(user, options.previousPasswordsField || 'previousPasswords', [])
    if (clearPassword && hashedPasswords && app.getPasswordPolicy) {
      debug('Enforcing password policy on user', user)
      const validator = app.getPasswordPolicy()
      // First check the clear password
      const result = validator.validate(clearPassword, { list: true })
      // Then check for the last used passwords using password policy verifier
      for (let i = 0; i < hashedPasswords.length; i++) {
        try {
          await validator.comparePassword({ password: hashedPasswords[i] }, clearPassword)
          // If we have found a similar password stop
          result.push('previous')
          break
        } catch (error) {
          // Check next one
        }
      }

      if (!_.isEmpty(result)) {
        throw new BadRequest('The provided password does not comply to the password policy', {
          translation: {
            key: 'WEAK_PASSWORD',
            keys: result.map(rule => 'WEAK_PASSWORD_' + rule.toUpperCase()),
            params: Object.assign({ failedRules: result }, _.omit(validator.options, ['prohibited']))
          }
        })
      }
    }
    return hook
  }
}

export function storePreviousPassword (options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'storePreviousPassword\' hook should only be used as a \'before\' hook.')
    }
    const app = hook.app
    const data = getItems(hook)
    if (app.getPasswordPolicy && hook.params.previousItem) {
      const validator = app.getPasswordPolicy()
      // Based on previous password value
      const user = hook.params.previousItem
      const passwordField = options.passwordField || 'password'
      const password = _.get(user, passwordField)
      if (password) {
        const previousPasswordsField = options.previousPasswordsField || 'previousPasswords'
        const previousPasswords = _.get(user, previousPasswordsField, [])
        debug(`Moving previous password from field ${passwordField} in field ${previousPasswords} on user`, user)
        previousPasswords.push(password)
        // Pop oldest password when required
        const max = _.get(validator, 'options.history', 5)
        if (previousPasswords.length > max) previousPasswords.shift()
        Object.assign(data, { [previousPasswordsField]: previousPasswords })
        replaceItems(hook, data)
      }
    }
    return hook
  }
}

export function generatePassword (options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'generatePassword\' hook should only be used as a \'before\' hook.')
    }
    const app = hook.app
    const data = hook.data
    const passwordField = options.passwordField || 'password'
    const suggestedPasswordField = options.suggestedPasswordField || 'password'
    // If a password is already provided and compliant with rules we will use it
    if (_.get(data, suggestedPasswordField)) {
      _.set(data, passwordField, _.get(data, suggestedPasswordField))
      // Avoid leaking clear password
      _.unset(data, suggestedPasswordField)
    }
    // Generated password rule
    const passwordRule = /[\w\d?-]/
    // If we have a password policy ensure we match it
    if (app.getPasswordPolicy) {
      const validator = app.getPasswordPolicy()
      // Check if a compliant password has been provided, otherwise generate it
      if (!_.get(data, passwordField) || !validator.validate(_.get(data, passwordField))) {
        do {
          _.set(data, passwordField, generateRandomPassword(validator.options.minLength || 12, false, passwordRule))
        } while (!validator.validate(_.get(data, passwordField)))
      }
    } else {
      // Check if a password has been provided, otherwise generate it
      if (!_.get(data, passwordField)) {
        _.set(data, passwordField, generateRandomPassword(12, false, passwordRule))
      }
    }
    return hook
  }
}

export function preventRemoveUser (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'preventRemoveUser\' hook should only be used as a \'before\' hook.')
  }

  // By pass check ?
  if (hook.params.force) return hook
  const user = hook.params.user
  // Check if the target is the current user
  if ((user._id.toString() === hook.id.toString()) && user.organisations) {
    // We must ensure the user is no more a owner of an organisation
    const owningOrganisations = _.filter(user.organisations, { permissions: RoleNames[Roles.owner] })
    if (!_.isEmpty(owningOrganisations)) {
      debug('Cannot remove the user: ', user)
      throw new Forbidden('You are not allowed to delete the user ' + user.name, {
        translation: {
          key: 'CANNOT_REMOVE_USER',
          params: { user: _.get(user, 'profile.name') }
        }
      })
    }
  }
  return hook
}

export async function joinOrganisation (hook) {
  const app = hook.app
  const subject = getItems(hook)
  const authorisationService = app.getService('authorisations')
  const usersService = app.getService('users')

  // Set membership for the created user
  await authorisationService.create({
    scope: 'organisations',
    permissions: subject.sponsor.roleGranted, // Member by default
    resource: subject.sponsor.organisationId,
    resourcesService: 'organisations'
  }, {
    subjectsService: usersService,
    subjects: [subject]
  })
  debug('Organisation membership set for user ' + subject._id)
  return hook
}

export function leaveOrganisations (options = { skipPrivate: true }) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'leaveOrganisations\' hook should only be used as a \'after\' hook.')
    }

    const app = hook.app
    const organisationsService = app.getService('organisations')
    const authorisationService = app.getService('authorisations')
    const usersService = app.getService('users')
    const subject = getItems(hook)
    const organisations = _.get(subject, 'organisations', [])

    await Promise.all(organisations.map(organisation => {
      // Unset membership on org except private org if required
      if (options.skipPrivate && organisation._id.toString() === subject._id.toString()) return Promise.resolve()
      return authorisationService.remove(organisation._id.toString(), {
        query: {
          scope: 'organisations'
        },
        user: hook.params.user,
        // Because we already have resource set it as objects to avoid populating
        // Moreover used as an after hook the subject might not already exist anymore
        subjects: [subject],
        subjectsService: usersService,
        resource: organisation,
        resourcesService: organisationsService
      })
    }))

    debug('Membership unset for all organisations on user ' + subject._id)
    return hook
  }
}

export async function sendVerificationEmail (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'sendVerificationEmail\' hook should only be used as a \'after\' hook.')
  }

  // Check for by-passing OAuth2 providers
  for (const provider of hook.app.authenticationProviders) {
    if (hook.result[provider + 'Id']) return Promise.resolve(hook)
  }

  const accountService = hook.app.getService('account')
  await accountService.options.notifier('resendVerifySignup', hook.result)
  return hook
}

export async function sendInvitationEmail (hook) {
  // Before because we need to send the clear password by email
  if (hook.type !== 'before') {
    throw new Error('The \'sendInvitationEmail\' hook should only be used as a \'before\' hook.')
  }

  const accountService = hook.app.getService('account')
  await accountService.options.notifier('sendInvitation', hook.data)
  return hook
}

export function addVerification (hook) {
  const accountService = hook.app.getService('account')

  return verifyHooks.addVerification(accountService.getPath(true))(hook)
    .then(hook => {
      // Check for OAuth2 providers
      let isVerified = false
      for (const provider of hook.app.authenticationProviders) {
        if (hook.data[provider + 'Id']) isVerified = true
      }
      hook.data.isVerified = isVerified
      return hook
    })
}

export function removeVerification (hook) {
  return verifyHooks.removeVerification()(hook)
}
