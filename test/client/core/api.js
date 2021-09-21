import _ from 'lodash'
import makeDebug from 'debug'
import request from 'superagent'
import feathers from '@feathersjs/client'
import auth from '@feathersjs/authentication-client'

const debug = makeDebug('kdk:core:test:api')

export class Api {
  constructor (options = {}) {
    // Compute helper default options
    const defaultPort = process.env.PORT || process.env.HTTPS_PORT || 8081
    // Set the runner options using default and overrrident options
    this.options = _.merge({
      baseUrl: process.env.API_URL || `http://localhost:${defaultPort}`,
      apiPrefix: process.env.API_PREFIX || '/api'
    }, options)
  }

  createClient (options = {}) {
    const client = feathers()
    client.configure(feathers.rest(this.options.baseUrl).superagent(request))
      .configure(auth(_.merge({
        path: `${this.options.apiPrefix}/authentication`
      }, options)))
    // Display the API options
    debug('API access created with the following options: ', this.options)
    
    client.login = async (user) => {
      const response = await client.authenticate({
        strategy: 'local', email: user.email, password: user.password
      })
      return response.accessToken
    }

    client.getService = (name, context) => {
      if (context && (typeof context === 'object')) context = context._id
      return client.service(context ? `${this.options.apiPrefix}/${context}/${name}` : `${this.options.apiPrefix}/${name}`)
    }

    // Helper function used to create an organisation defined by:
    // - a owner
    // - a list of members with permissions
    // - a list of groups and group members with permissions
    // This function does not try to create already existing items but retrieve it
    // so that it can be used as a before hook even if cleanup has not been done when test fails
    client.createOrganisation = async (organisation) => {
      let org, owner
      // First initiate owner account with his organisation if required
      const orgOwner = _.get(organisation, 'owner')
      // If user already exists we should be able to login, otherwise create account
      try {
        await client.login(orgOwner)
        debug(`Connected to API as user ${orgOwner.name} - ${orgOwner._id}`)
        const response = await client.getService('users').find({ query: { email: orgOwner.email } })
        owner = response.data[0]
        debug(`Retrieved organisation owner ${owner.name} - ${owner._id}`)
      } catch (error) {
        owner = await client.getService('users').create(orgOwner)
        debug(`Created organisation owner ${owner.name} - ${owner._id}`)
        await client.login(orgOwner)
        debug(`Connected to API as user ${owner.name} - ${owner._id}`)
      }
      // Retrieve org
      const response = await client.getService('organisations').find({ query: { _id: owner._id } })
      // If not create it
      if (response.total === 0) {
        org = await client.getService('organisations').create(_.pick(organisation, ['name', 'description']))
        debug(`Created organisation ${org.name} - ${org._id}`)
      } else {
        org = response.data[0]
        debug(`Retrieved organisation ${org.name} - ${org._id}`)
      }
      // Keep track of IDs
      orgOwner._id = owner._id
      organisation._id = org._id
      organisation.name = org.name
    }

    client.createMembers = async (organisation) => {
      const orgOwner = _.get(organisation, 'owner')
      const members = _.get(organisation, 'members', [])
      for (let i = 0; i < members.length; i++) {
        const orgMember = members[i]
        let member
        // Check if member already exists
        const response = await client.getService('users').find({ query: { email: orgMember.email } })
        // If not create it, otherwise add it
        if (response.total === 0) {
          member = await client.getService('users').create({
            email: orgMember.email,
            name: orgMember.name,
            sponsor: {
              id: orgOwner._id,
              organisationId: organisation._id,
              roleGranted: orgMember.permissions
            }
          })
          debug(`Created organisation member ${member.name} - ${member._id} - ${orgMember.permissions}`)
        } else {
          member = response.data[0]
          await client.getService('authorisations').create({
            scope: 'organisations',
            permissions: orgMember.permissions,
            subjects: member._id,
            subjectsService: 'users',
            resource: organisation._id,
            resourcesService: 'organisations'
          })
          debug(`Added organisation member ${member.name} - ${member._id} - ${orgMember.permissions}`)
        }
        // Keep track of IDs
        orgMember._id = member._id
      }
    }

    client.createGroups = async (organisation) => {
      const groups = _.get(organisation, 'groups', [])
      for (let i = 0; i < groups.length; i++) {
        const orgGroup = groups[i]
        let group
        // Check if member already exists
        const response = await client.getService('groups', organisation).find({ query: { name: orgGroup.name } })
        // If not existing create it
        if (response.total === 0) {
          group = await client.getService('groups', organisation).create(_.pick(orgGroup, ['name', 'description']))
          debug(`Created organisation group ${group.name} - ${group._id}`)
        } else {
          group = response.data[0]
          debug(`Retrieved organisation group ${group.name} - ${group._id}`)
        }
        // Keep track of IDs
        orgGroup._id = group._id
      }
    }

    // Remove previously created structure, this function swallow errors on non existing items
    // so that it can be used as a after hook to ensure proper cleanup even if test fails
    client.removeOrganisation = async (organisation) => {
      const orgOwner = _.get(organisation, 'owner')
      try {
        await client.getService('organisations').remove(organisation._id)
        debug(`Removed organisation ${organisation._id}`)
      } catch {
        debug(`Impossible to remove organisation ${organisation._id}`)
      }
      try {
        await client.getService('users').remove(orgOwner._id)
        debug(`Removed user ${orgOwner._id}`)
      } catch {
        debug(`Impossible to remove user ${orgOwner.name} - ${orgOwner._id}`)
      }
    }

    client.removeMembers = async (organisation) => {
      const members = _.get(organisation, 'members', [])
      for (let i = 0; i < members.length; i++) {
        const orgMember = members[i]
        try {
          // Try by email if no ID provided
          if (!orgMember._id) {
            const response = await client.getService('members', organisation).find({ query: { email: orgMember.email } })
            if (response.total === 1) {
              orgMember._id = response.data[0]._id
            }
          }
          await client.getService('authorisations').remove(organisation._id, {
            query: {
              scope: 'organisations',
              subjects: orgMember._id,
              subjectsService: organisation._id + '/members',
              resourcesService: 'organisations'
            }
          })
          debug(`Removed member ${orgMember.name} from organisation ${organisation._id}`)
        } catch {
          debug(`Impossible to remove member ${orgMember.name} from organisation ${organisation._id}`)
        }
        try {
          await client.getService('users').remove(orgMember._id)
          debug(`Removed user ${orgMember._id}`)
        } catch {
          debug(`Impossible to remove user ${orgMember.name} - ${orgMember._id}`)
        }
      }
    }

    client.removeGroups = async (organisation) => {
      const groups = _.get(organisation, 'groups', [])
      for (let i = 0; i < groups.length; i++) {
        const orgGroup = groups[i]
        try {
          // Try by name if no ID provided
          if (!orgGroup._id) {
            const response = await client.getService('groups', organisation).find({ query: { name: orgGroup.name } })
            if (response.total === 1) {
              orgGroup._id = response.data[0]._id
            }
          }
          await client.getService('groups', organisation).remove(orgGroup._id)
          debug(`Removed group ${orgGroup.name} from organisation ${organisation._id}`)
        } catch {
          debug(`Impossible to remove group ${orgGroup.name} from organisation ${organisation._id}`)
        }
      }
    }

    return client
  }
}
