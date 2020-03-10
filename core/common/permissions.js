import _ from 'lodash'
import { Ability, AbilityBuilder, toMongoQuery } from 'casl/dist/umd'

// Define some alias to simplify ability definitions
Ability.addAlias('update', 'patch')
Ability.addAlias('read', ['get', 'find'])
Ability.addAlias('remove', 'delete')
Ability.addAlias('all', ['read', 'create', 'update', 'remove'])

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
  // Register
  can('service', 'users')
  can('create', 'users')

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
    can(['read', 'remove'], 'storage', { _id: 'avatars/' + subject._id.toString() })
    can(['read', 'remove'], 'storage', { _id: 'avatars/' + subject._id.toString() + '.thumbnail' })
  }
}

// Compute abilities for a given user
export function defineAbilities (subject) {
  const { rules, can, cannot } = AbilityBuilder.extract()

  // Run registered hooks
  hooks.forEach(hook => hook(subject, can, cannot))

  // CASL cannot infer the object type from the object itself so we need
  // to tell it how he can find the object type, i.e. service name.
  return new Ability(rules, {
    subjectName: resource => {
      if (!resource || typeof resource === 'string') {
        return resource
      }
      return resource[RESOURCE_TYPE_KEY]
    }
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
  return abilities.can('service', path)
}

export function hasResourceAbilities (abilities, operation, resourceType, context, resource) {
  if (!abilities) return false
  // Create a shallow copy adding context and type
  const object = Object.assign({}, resource)
  object[RESOURCE_TYPE_KEY] = resourceType
  // Add a virtual context to take it into account for object having no link to it
  if (context) object.context = (typeof context === 'object' ? context._id.toString() : context)

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
      _.remove(value, item => _.isEmpty(item))
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

  const rules = abilities.rulesFor(operation, resourceType)
  const query = toMongoQuery(rules)
  // Remove any context to avoid taking it into account because it is not really stored on objects
  return (query ? removeContext(query) : null)
}

function buildSubjectsQueryForResource (resourceScope, resourceId, role) {
  const query = { [resourceScope]: { $elemMatch: { _id: resourceId } } }
  if (role) {
    _.set(query[resourceScope], '$elemMatch.permissions', RoleNames[role])
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
