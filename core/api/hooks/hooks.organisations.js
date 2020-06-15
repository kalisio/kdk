import _ from 'lodash'
import makeDebug from 'debug'
import { Forbidden } from '@feathersjs/errors'
const debug = makeDebug('kdk:core:organisations:hooks')

export function addOrganisationPlan (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'addOrganisationPlan\' hook should only be used as a \'before\' hook.')
  }

  const plans = _.keys(hook.app.get('plans') || {})
  const plan = _.get(hook.data, 'billing.plan')
  if (!plan && (plans.length > 0)) {
    // Add defaul plan
    _.set(hook.data, 'billing.plan', plans[0])
    debug('Added default plan to organisation: ', hook.data)
  }
  return hook
}

export function createOrganisationServices (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'createOrganisationServices\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const organisationService = hook.service
  const databaseService = app.getService('databases')

  // First we create the organisation DB
  return databaseService.create({
    name: hook.result._id.toString()
  }, {
    user: hook.params.user
  })
    .then(db => {
      debug('DB created for organisation ' + hook.result.name)
      // Jump from infos/stats to real DB object
      db = app.db.instance.db(hook.result._id.toString())
      organisationService.createOrganisationServices(hook.result, db)
      return hook
    })
}

export function removeOrganisationServices (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removeOrganisationServices\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const organisationService = hook.service
  const databaseService = app.getService('databases')

  // Then we remove the organisation DB
  return databaseService.remove(hook.result._id.toString(), {
    user: hook.params.user
  })
    .then(db => {
      debug('DB removed for organisation ' + hook.result.name)
      organisationService.removeOrganisationServices(hook.result)
      return hook
    })
}

export function createOrganisationAuthorisations (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'createOrganisationAuthorisations\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const authorisationService = app.getService('authorisations')
  const userService = app.getService('users')
  // Set membership for the owner
  return authorisationService.create({
    scope: 'organisations',
    permissions: 'owner' // Owner by default
  }, {
    user: hook.params.user,
    // Because we already have subject/resource set it as objects to avoid populating
    subjects: [hook.params.user],
    subjectsService: userService,
    resource: hook.result,
    resourcesService: hook.service
  })
    .then(authorisation => {
      debug('Organisation ownership set for user ' + hook.result._id)
      return hook
    })
}

export function removeOrganisationAuthorisations (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removeOrganisationAuthorisations\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const authorisationService = app.getService('authorisations')

  // Unset membership for the all org users
  return authorisationService.remove(hook.result._id.toString(), {
    query: {
      subjectsService: hook.result._id.toString() + '/members',
      scope: 'organisations'
    },
    user: hook.params.user,
    // Because we already have resource set it as objects to avoid populating
    // Moreover used as an after hook the resource might not already exist anymore
    resource: hook.result,
    resourcesService: hook.service
  })
    .then(authorisation => {
      debug('Authorisations unset for organisation ' + hook.result._id)
      return hook
    })
}

export function updateOrganisationResource (resourceScope) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'updateOrganisationResource\' hook should only be used as a \'after\' hook.')
    }

    const app = hook.app
    // Retrieve the list of members
    const orgMembersService = app.getService('members', hook.service.getContextId())
    const members = await orgMembersService.find({
      query: { [resourceScope]: { $elemMatch: { _id: hook.result._id } } },
      paginate: false
    })
    // Update each members
    await Promise.all(members.map(member => {
      const resources = _.get(member, resourceScope, [])
      const resource = _.find(resources, { _id: hook.result._id })
      if (resource) {
        Object.assign(resource, hook.result)
        return orgMembersService.patch(member._id, { [resourceScope]: resources })
      } else {
        return Promise.resolve()
      }
    }))

    debug(`Updated resource ${hook.result._id} on scope ${resourceScope} for members of organisation ` + hook.result._id)
    return hook
  }
}

export function removeOrganisationGroups (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removeOrganisationGroups\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const orgGroupService = app.getService('groups', hook.result)
  return orgGroupService.find({ paginate: false })
    .then(groups => {
      return Promise.all(groups.map(group => {
        return orgGroupService.remove(group._id.toString(), {
          user: hook.params.user
        })
      }))
    })
    .then(groups => {
      debug('Removed groups for organisation ' + hook.result._id)
      return hook
    })
}

export async function removeOrganisationTags (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removeOrganisationTags\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  // Retrieve the list of tags
  const orgTagsService = app.getService('tags', hook.result)
  const tags = await orgTagsService.find({ paginate: false })
  // Retrieve the list of members
  const orgMembersService = app.getService('members', hook.result)
  const members = await orgMembersService.find({ paginate: false })
  // Update each members
  for (const i in members) {
    const member = members[i]
    if (member.tags) {
      const filteredTagsMember = _.filter(member.tags, (tag) => {
        return _.findIndex(tags, { _id: tag._id }) === -1
      })
      await orgMembersService.patch(member._id, { tags: filteredTagsMember })
    }
  }

  debug('Removed tags from organisation ' + hook.result._id)
  return hook
}

export function createPrivateOrganisation (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'createPrivateOrganisation\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const organisationService = app.getService('organisations')
  // Create a private organisation for the user
  return organisationService.create({
    _id: hook.result._id, // Same ID as user, fine because in another service
    name: hook.result.profile.name // Same name as user
  }, {
    user: hook.result
  })
    .then(org => {
      debug('Private organisation created for user ' + hook.result._id)
    })
}

export function removePrivateOrganisation (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removePrivateOrganisation\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const organisationService = app.getService('organisations')
  // Remove the private user's organisation
  return organisationService.remove(hook.result._id.toString(), {
    user: hook.result
  })
    .then(org => {
      debug('Private organisation removed for user ' + hook.result._id)
    })
}

export async function preventRemoveOrganisation (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'preventRemoveOrganisations\' hook should only be used as a \'before\' hook.')
  }

  // By pass check ?
  if (hook.params.force) return hook
  const app = hook.app
  const orgGroupService = app.getService('groups', hook.id)
  const result = await orgGroupService.find({ $limit: 0 })
  if (result.total > 0) {
    throw new Forbidden('You are not allowed to delete the organisation', {
      translation: { key: 'CANNOT_REMOVE_ORGANISATION' }
    })
  }
  return hook
}

export async function createSubscribersGroup (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'createSubscribersGroup\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const orgId = hook.result._id
  const orgGroupService = app.getService('groups', orgId)
  await orgGroupService.create({
    name: 'KGroup.SUBSCRIBERS_GROUP_NAME',
    description: 'KGroup.SUBSCRIBERS_GROUP_DESCRIPTION',
    system: true
  }, hook.params)
  return hook
}
