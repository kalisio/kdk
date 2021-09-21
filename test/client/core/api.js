import _ from 'lodash'
import request from 'superagent'
import feathers from '@feathersjs/client'
import auth from '@feathersjs/authentication-client'

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
    console.log('API access created with the following options:')
    console.log(this.options)
    client.login = async (user) => {
      const response = await client.authenticate({
        strategy: 'local', email: user.email, password: user.password
      })
      return response.accessToken
    }
    client.getService = (name, context) => {
      return client.service(context ? `${this.options.apiPrefix}/${context}/${name}` : `${this.options.apiPrefix}/${name}`)
    }
    return client
  }
}
