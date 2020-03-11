import _ from 'lodash'
import makeDebug from 'debug'
import generateRandomPassword from 'password-generator'
import { getItems, replaceItems } from 'feathers-hooks-common'
import { Forbidden, BadRequest } from '@feathersjs/errors'
import { Roles, RoleNames } from '../../common/permissions'

const debug = makeDebug('kalisio:kCore:users:hooks')

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

export function generatePassword (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'generatePassword\' hook should only be used as a \'before\' hook.')
  }
  const app = hook.app
  const data = hook.data
  // Generate a password
  const passwordRule = new RegExp('[\\w\\d\\?\\-]')
  // If we have a password policy ensure we match it
  if (app.getPasswordPolicy) {
    const validator = app.getPasswordPolicy()
    do {
      data.password = generateRandomPassword(validator.options.minLength || 12, false, passwordRule)
    } while (!validator.validate(data.password))
  } else {
    data.password = generateRandomPassword(12, false, passwordRule)
  }
  return hook
}

export function preventRemoveUser (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'preventRemoveUser\' hook should only be used as a \'before\' hook.')
  }

  // By pass check ?
  if (hook.params.force) return hook
  const user = hook.params.user
  if (user.organisations) {
    // We must ensure the user is no more a owner of an organisation
    const owningOrganisations = _.filter(user.organisations, { permissions: RoleNames[Roles.owner] })
    if (!_.isEmpty(owningOrganisations)) {
      debug('Cannot remove the user: ', user)
      throw new Forbidden('You are not allowed to delete the user ' + user.name, {
        translation: {
          key: 'CANNOT_REMOVE_USER',
          params: { user: user.name }
        }
      })
    }
  }
  return hook
}

export function joinOrganisation (hook) {
  const app = hook.app
  const subject = getItems(hook)
  const authorisationService = app.getService('authorisations')
  const usersService = app.getService('users')

  // Set membership for the created user
  return authorisationService.create({
    scope: 'organisations',
    permissions: subject.sponsor.roleGranted, // Member by default
    resource: subject.sponsor.organisationId,
    resourcesService: 'organisations'
  }, {
    subjectsService: usersService,
    subjects: [subject]
  })
    .then(authorisation => {
      debug('Organisation membership set for user ' + subject._id)
      return hook
    })
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
      if (options.skipPrivate && organisation._id.toString() === subject._id.toString()) return
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
