import _ from 'lodash'
import { AbilityBuilder, Ability, createAliasResolver } from '@casl/ability'
import { toMongoQuery } from '@casl/mongoose'

// Define some alias to simplify ability definitions
const resolveAction = createAliasResolver({
  update: ['patch'],
  read: ['get', 'find'],
  remove: ['delete'],
  all: ['read', 'create', 'update', 'remove']
})

export const Roles = {
  member: 0,
  manager: 1,
  owner: 2
}

export const RoleNames = [
  'member',
  'manager',
  'owner'
]

// Hooks that can be added to customize abilities computation
let hooks = []

// Get the unique global symbol to store resource type / context on a resource object
export const RESOURCE_TYPE = 'type'
export const RESOURCE_TYPE_KEY = Symbol.for(RESOURCE_TYPE)

export function defineResourceRules (subject, resource, resourceService, can) {
  const role = Roles[resource.permissions]

  if (role >= Roles.member) {
    can('read', resourceService, { _id: resource._id })
  }
  if (role >= Roles.manager) {
    can('update', resourceService, { _id: resource._id })
    can(['create', 'remove'], 'authorisations', { resource: resource._id })
  }
  if (role >= Roles.owner) {
    can('remove', resourceService, { _id: resource._id })
  }
}

// Hook computing default abilities for a given user
export function defineUserAbilities (subject, can, cannot) {
  // Allow user registration
  can('service', 'users')
  can('create', 'users')
  // Verification email, reset password, etc.
  can('service', 'account')
  can('create', 'account')
  can('service', 'devices')
  can('update', 'devices')
  can('remove', 'devices')

  if (subject && subject._id) {
    // Read user profiles for authorizing
    can('read', 'users')
    // Update user profile and destroy it
    can(['update', 'remove'], 'users', { _id: subject._id })
    // Access authorisation service, then rights will be granted on a per-resource basis
    can('service', 'authorisations')
    // Access storage service, then rights will be granted on a per-resource basis
    can('service', 'storage')
    // This is for the user avatar
    // take care that the storage service uses 'id' as input but produces _id as output
    can('create', 'storage', { id: 'avatars/' + subject._id.toString() })
    can('create', 'storage', { id: 'avatars/' + subject._id.toString() + '.thumbnail' })
    can('remove', 'storage', { _id: 'avatars/' + subject._id.toString() })
    can('remove', 'storage', { _id: 'avatars/' + subject._id.toString() + '.thumbnail' })
    // Avatar is part of user profiles so that they can be read by any
    can('read', 'storage', { _id: { $regex: '^avatars/*' } })
    // Verification email, reset password, etc.
    can('service', 'account')
    can('create', 'account')
    can('service', 'devices')
    can('update', 'devices')
    can('remove', 'devices')
  }
}

// Compute abilities for a given user
export async function defineAbilities (subject, ...args) {
  const { build, can, cannot } = new AbilityBuilder(Ability)

  // Run registered hooks providing any additional arguments used to handle complex use cases
  await Promise.all(hooks.map(async hook => {
    await hook(subject, can, cannot, ...args)
  }))

  // CASL cannot infer the object type from the object itself so we need
  // to tell it how he can find the object type, i.e. service name.
  return build({
    detectSubjectType: resource => {
      if (!resource || typeof resource === 'string') {
        return resource
      }
      return resource[RESOURCE_TYPE_KEY]
    },
    resolveAction
  })
}

defineAbilities.registerHook = function (hook) {
  if (!hooks.includes(hook)) {
    hooks.push(hook)
  }
}

defineAbilities.unregisterHook = function (hook) {
  hooks = hooks.filter(registeredHook => registeredHook !== hook)
}

export function hasServiceAbilities (abilities, service) {
  if (!abilities) return false
  // The unique identifier of a service is its path not its name.
  // Indeed we have for instance a 'groups' service in each organisation
  // Take care that in client we have the service path while on server we have the actual object
  const path = typeof service === 'string' ? service : service.getPath()
  // */groups will allow to access any groups service in any context
  return abilities.can('service', path) ||
         abilities.can('service', `*/${path}`) ||
         abilities.can('service', _.replace(path, /^.*\//, '*/'))
}

export function hasResourceAbilities (abilities, operation, resourceType, context, resource) {
  if (!abilities) return false
  // Create a shallow copy adding context and type
  const object = Object.assign({}, resource)
  object[RESOURCE_TYPE_KEY] = resourceType
  // Add a virtual context to take it into account for object having no link to it
  if (context) object.context = (typeof context === 'object' ? context._id.toString() : context.toString())

  const result = abilities.can(operation, object)

  return result
}

// Utility function used to remove the virtual context from query
export function removeContext (query) {
  _.forOwn(query, (value, key) => {
    // Process current attributes or recurse
    // Take care to nested fields like 'field._id'
    if (key === 'context') {
      delete query.context
    } else if (Array.isArray(value)) {
      value.forEach(item => removeContext(item))
      // Remove empty objects from array
      // _.remove(value, item => _.isEmpty(item))
      // Remove empty arrays from query
      if (_.isEmpty(value)) delete query[key]
    } else if (typeof value === 'object') {
      removeContext(value)
      // Remove empty objects from query
      if (_.isEmpty(value)) delete query[key]
    }
  })
  return query
}

// Get the query used to filter the objects according to given abilities
// A null query indicates that access should not be granted
export function getQueryForAbilities (abilities, operation, resourceType) {
  if (!abilities) return null

  const query = toMongoQuery(abilities, resourceType, operation)
  // Remove any context to avoid taking it into account because it is not really stored on objects
  // We clone the object here because of references to the abilities rules (see https://github.com/kalisio/kdk/issues/384)
  return (query ? removeContext(_.cloneDeep(query)) : null)
}

function buildSubjectsQueryForResource (resourceScope, resourceId, role) {
  const query = { [resourceScope]: { $elemMatch: { _id: resourceId } } }
  if (role) {
    _.set(query[resourceScope], '$elemMatch.permissions', (typeof role === 'string' ? role : RoleNames[role]))
  }
  return query
}

export function findSubjectsForResource (subjectService, resourceScope, resourceId, role) {
  // Build the query
  const query = buildSubjectsQueryForResource(resourceScope, resourceId, role)
  // Execute the query
  return subjectService.find({ query })
}

export function countSubjectsForResource (subjectService, resourceScope, resourceId, role) {
  // Build the query
  const query = buildSubjectsQueryForResource(resourceScope, resourceId, role)
  // Indicate we'd only like to count
  query.$limit = 0
  // Execute the query
  return subjectService.find({ query })
}

// Hook computing organisation abilities for a given user
export function defineOrganisationAbilities (subject, can, cannot) {
  if (subject) {
    // Create new organisations
    can('service', 'organisations')
    can('create', 'organisations')

    if (subject.organisations) {
      subject.organisations.forEach(organisation => {
        if (organisation._id) {
          // Generic rules for resources
          defineResourceRules(subject, organisation, 'organisations', can)
          // Specific rules for organisations
          const role = Roles[organisation.permissions]
          if (role >= Roles.member) {
            // The unique identifier of a service is its path not its name.
            // Indeed we have for instance a 'groups' service in each organisation.
            can('service', organisation._id.toString() + '/members')
            can('read', 'members', { context: organisation._id })
            can('service', organisation._id.toString() + '/tags')
            // Tags are public
            can('read', 'tags', { context: organisation._id })
            // Groups are private
            can('service', organisation._id.toString() + '/groups')
            can('service', organisation._id.toString() + '/storage')
            can(['read', 'create', 'remove'], 'storage', { context: organisation._id })
          }
          if (role >= Roles.manager) {
            can('update', 'members', { context: organisation._id })
            // Managers can manage all groups/tags
            can('all', 'groups', { context: organisation._id })
            can(['create', 'remove'], 'authorisations', { resourcesService: organisation._id.toString() + '/groups', scope: 'groups' })
            can('all', 'tags', { context: organisation._id })
            // Remove invited members
            can(['remove'], 'users', { 'sponsor.organisationId': organisation._id })
          }
        }
      })
    }
  }
}

// Hook computing group abilities for a given user
export function defineGroupAbilities (subject, can, cannot) {
  if (subject) {
    if (subject.groups) {
      subject.groups.forEach(group => {
        if (group._id) {
          // Specific rules for groups
          const role = Roles[group.permissions]

          if (role >= Roles.member) {
            can('read', 'groups', { _id: group._id })
          }
          if (role >= Roles.manager) {
            can(['create', 'remove'], 'authorisations', { resource: group._id, permissions: 'member' })
          }
        }
      })
    }
  }
}

// Helper functions to find the members of a given organisation
export function findMembersOfOrganisation (usersService, organisationId, role) {
  return findSubjectsForResource(usersService, 'organisations', organisationId, role)
}

export function countMembersOfOrganisation (usersService, organisationId, role) {
  return countSubjectsForResource(usersService, 'organisations', organisationId, role)
}

// Helper functions to find the members of a given group
export function findMembersOfGroup (membersService, groupId, role) {
  return findSubjectsForResource(membersService, 'groups', groupId, role)
}

export function countMembersOfGroup (membersService, groupId, role) {
  return countSubjectsForResource(membersService, 'groups', groupId, role)
}

export function getRoleForOrganisation (user, organisationId) {
  const result = _.find(user.organisations, { _id: organisationId })
  if (!_.isUndefined(result)) return result.permissions
  return undefined
}

export function getRoleForGroup (user, organisationId, groupId) {
  const result = _.find(user.groups, { context: organisationId, _id: groupId })
  if (!_.isUndefined(result)) return result.permissions
  return undefined
}

export function findGroupsWithRole (user, organisationId, role) {
  return _.filter(user.groups || [], { context: organisationId, permissions: (typeof role === 'string' ? role : RoleNames[role]) })
}

export function isSeniorRole (roleName, juniorName) {
  return Roles[roleName] >= Roles[juniorName]
}

export function isJuniorRole (roleName, seniorName) {
  return Roles[roleName] < Roles[seniorName]
}

export function getSeniorRoles (roleName) {
  const seniorRoles = []
  _.forEach(Roles, role => { if (Roles[roleName] < role) seniorRoles.push(RoleNames[role]) })
  return seniorRoles
}

export function getJuniorRoles (roleName) {
  const juniorRoles = []
  _.forEach(Roles, role => { if (Roles[roleName] >= role) juniorRoles.push(RoleNames[role]) })
  return juniorRoles
}
