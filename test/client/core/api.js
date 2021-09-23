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

    // Helper function used to create/remove an organisation defined by:
    // - a owner
    // - a list of members with permissions
    // - a list of groups
    // The create functions does not try to create already existing items but retrieve it
    // so that it can be used as a before hook even if cleanup has not been done when test fails.
    // When removing previously created structure, the functions swallow errors on non existing items
    // so that it can be used as a after hook to ensure proper cleanup even if test fails

    client.createOrganisation = async (organisation) => {
      let org
      // First initiate owner account with his organisation if required
      const orgOwner = _.get(organisation, 'owner')
      await client.createUser(orgOwner)
      // Ensure we are logged as org owner
      await client.login(orgOwner)
      // Retrieve org
      const response = await client.getService('organisations').find({ query: { _id: orgOwner._id } })
      // If not create it
      if (response.total === 0) {
        org = await client.getService('organisations').create(_.pick(organisation, ['name', 'description']))
        debug(`Created organisation ${org.name} - ID ${org._id}`)
      } else {
        org = response.data[0]
        debug(`Retrieved organisation ${org.name} - ID ${org._id}`)
      }
      // Keep track of IDs
      organisation._id = org._id
      organisation.name = org.name
      await client.logout()
    }

    client.createUser = async (user) => {
      let createdUser
      // If user already exists we should be able to login, otherwise create account
      try {
        await client.login(user)
        const response = await client.getService('users').find({ query: { email: user.email } })
        createdUser = response.data[0]
        debug(`Retrieved user ${createdUser.name} - ID ${createdUser._id}`)
      } catch (error) {
        createdUser = await client.getService('users').create(user)
        debug(`Created user ${createdUser.name} - ID ${createdUser._id}`)
      }
      // Keep track of ID
      user._id = createdUser._id
      await client.logout()
    }

    client.createMembers = async (organisation) => {
      const orgOwner = _.get(organisation, 'owner')
      // Ensure we are logged as org owner first
      await client.login(orgOwner)
      const members = _.get(organisation, 'members', [])
      for (let i = 0; i < members.length; i++) {
        const orgMember = members[i]
        let member
        // Check if member already exists
        const response = await client.getService('users').find({ query: { email: orgMember.email } })
        // If not create it, otherwise add it
        if (response.total === 0) {
          member = await client.getService('users').create(Object.assign({
            sponsor: {
              id: orgOwner._id,
              organisationId: organisation._id,
              roleGranted: orgMember.permissions
            },
            suggestedPassword: orgMember.password
          }, _.pick(orgMember, ['name', 'email'])))
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
          debug(`Added organisation member ${member.name} - ID ${member._id} - ${orgMember.permissions}`)
        }
        // Keep track of IDs
        orgMember._id = member._id
      }
      await client.logout()
      // If we'd like to be able to manage guest members we need to login
      for (let i = 0; i < members.length; i++) {
        await client.login(members[i])
        await client.logout()
      }
    }

    client.createGroups = async (organisation) => {
      const orgOwner = _.get(organisation, 'owner')
      // Ensure we are logged as org owner first
      await client.login(orgOwner)
      const groups = _.get(organisation, 'groups', [])
      for (let i = 0; i < groups.length; i++) {
        const orgGroup = groups[i]
        let group
        // Check if member already exists
        const response = await client.getService('groups', organisation).find({ query: { name: orgGroup.name } })
        // If not existing create it
        if (response.total === 0) {
          group = await client.getService('groups', organisation).create(_.pick(orgGroup, ['name', 'description']))
          debug(`Created organisation group ${group.name} - ID ${group._id}`)
        } else {
          group = response.data[0]
          debug(`Retrieved organisation group ${group.name} - ID ${group._id}`)
        }
        // Keep track of IDs
        orgGroup._id = group._id
      }
      await client.logout()
    }

    client.removeOrganisation = async (organisation) => {
      const orgOwner = _.get(organisation, 'owner')
      await client.removeUser(orgOwner)
      // TODO: remove org if not private user org
    }

    client.removeUser = async (user) => {
      // Ensure we are logged as user first
      try {
        await client.login(user)
      } catch (error) {
        debug(`Impossible to connect as user ${user.name} - ID ${user._id}:`, error.name || error.code || error.message)
      }
      try {
        await client.getService('organisations').remove(user._id)
        debug(`Removed ${user.name} user organisation with ID ${user._id}`)
      } catch (error) {
        debug(`Impossible to remove ${user.name} user organisation with ID ${user._id}:`, error.name || error.code || error.message)
      }
      try {
        await client.getService('users').remove(user._id)
        debug(`Removed user ${user.name} - ID ${user._id}`)
      } catch (error) {
        debug(`Impossible to remove user ${user.name} - ID ${user._id}:`, error.name || error.code || error.message)
      }
      await client.logout()
    }

    client.removeMembers = async (organisation) => {
      const orgOwner = _.get(organisation, 'owner')
      // Ensure we are logged as org owner first
      await client.login(orgOwner)
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
          debug(`Removed member ${orgMember.name} from organisation with ID ${organisation._id}`)
        } catch (error) {
          debug(`Impossible to remove member ${orgMember.name} from organisation with ID ${organisation._id}:`, error.name || error.code || error.message)
        }
      }
      await client.logout()
      // Now remove member accounts
      for (let i = 0; i < members.length; i++) {
        await client.removeUser(members[i])
      }
    }

    client.removeGroups = async (organisation) => {
      const orgOwner = _.get(organisation, 'owner')
      // Ensure we are logged as org owner first
      await client.login(orgOwner)
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
          debug(`Removed group ${orgGroup.name} from organisation with ID ${organisation._id}`)
        } catch (error) {
          debug(`Impossible to remove group ${orgGroup.name} from organisation with ID ${organisation._id}:`, error.name || error.code || error.message)
        }
      }
      await client.logout()
    }

    return client
  }
}
