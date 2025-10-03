import _ from 'lodash'
import makeDebug from 'debug'
import request from 'superagent'
import feathers from '@feathersjs/client'
import auth from '@feathersjs/authentication-client'

const debug = makeDebug('kdk:core:test:api')
const StandardMethods = ['find', 'get', 'create', 'update', 'patch', 'remove']

export class Api {
  constructor (options = {}) {
    // Compute helper default options
    const defaultPort = process.env.PORT || process.env.HTTPS_PORT || 8081
    let domain = `http://localhost:${defaultPort}`
    // Override defaults if env provided, we need the app name in this case
    if (process.env.SUBDOMAIN) {
      domain = `https://${options.appName}.` + process.env.SUBDOMAIN
    }
    // Set the runner options using default and overrrident options
    this.options = _.merge({
      baseUrl: domain,
      apiPrefix: process.env.API_PREFIX || '/api'
    }, options)
  }

  createClient (options = {}) {
    const client = feathers()
    const transporter = feathers.rest(this.options.baseUrl).superagent(request)
    client.configure(transporter)
      .configure(auth(_.merge({
        path: `${this.options.apiPrefix}/authentication`
      }, options)))
    // Display the API options
    debug('API access created with the following options: ', this.options)

    client.login = async (payload) => {
      // Authenticate with a token or a user ?
      const strategy = (payload.accessToken ? 'jwt' : 'local')
      const response = await client.authenticate(Object.assign({
        strategy
      }, payload))
      return response.accessToken
    }

    client.getService = (name, context) => {
      if (context && (typeof context === 'object')) context = context._id
      return client.service(context ? `${this.options.apiPrefix}/${context}/${name}` : `${this.options.apiPrefix}/${name}`)
    }

    client.createService = (name, options) => {
      let context = options.context
      if (context && (typeof context === 'object')) context = context._id
      const servicePath = (context ? `${this.options.apiPrefix}/${context}/${name}` : `${this.options.apiPrefix}/${name}`)
      const service = transporter.service(servicePath)
      client.use(servicePath, service, {
        methods: StandardMethods.concat(options.customMethods)
      })
      return client.getService(name, context)
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

    client.removeUser = async (user) => {
      // Ensure we are logged as user first
      try {
        await client.login(user)
      } catch (error) {
        debug(`Impossible to connect as user ${user.name} - ID ${user._id}:`, error.name || error.code || error.message)
      }
      try {
        // Try by email if no ID provided
        if (!user._id) {
          const response = await client.getService('users').find({ query: { email: user.email } })
          if (response.total === 1) user._id = response.data[0]._id
        }
      } catch (error) {
        debug(`Impossible to find ${user.name} user with email ${user.email}:`, error.name || error.code || error.message)
      }
      try {
        await client.getService('users').remove(user._id)
        debug(`Removed user ${user.name} - ID ${user._id}`)
      } catch (error) {
        debug(`Error deleting user ${user.name} - ID ${user._id}:`, error.name || error.code || error.message)
      }
    }

    // Register services up-front (required for custom methods)
    if (options.customMethods) {
      options.customMethods.forEach(entry => {
        client.createService(entry.servicePath, {
          context: entry.context,
          customMethods: entry.methods
        })
      })
    }

    return client
  }
}
