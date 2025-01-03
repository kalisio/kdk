import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { createClient } from '../../core/client/api.js'
import { setupApi } from './init.js'

export const Planets = {

  initialize () {
    this.planets = {}
  },

  async connect (name, options = {}) {
    _.defaults(options, {
      origin: window.location.origin,
      apiPath: config.apiPath,
      apiJwt: `${name}-jwt`,
      gatewayJwt: `${name}-gateway-jwt`,
      apiTimeout: config.apiTimeout,
      transport: config.transport,
      appName: `${name}`,
      renewJwt: false
    })

    const client = await createClient(options)
    setupApi.bind(client)(options)
    client.on('authenticated', (data) => {
      // Store API gateway token if any
      if (data.gatewayToken) client.get('storage').setItem(options.gatewayJwt, data.gatewayToken)
    })
    client.on('logout', (data) => {
      // Remove API gateway token if any
      client.get('storage').removeItem(options.gatewayJwt)
    })
    const accessToken = await client.get('storage').getItem(options.apiJwt)
    if (!accessToken) {
      logger.error(new Error(`You must set planet ${name} token first`))
      return
    }
    await client.authenticate({
      strategy: 'jwt',
      accessToken
    })
    this.planets[name] = client
    return client
  },

  async disconnect (name) {
    await this.planets[name].logout()
    delete this.planets[name]
  },

  isConnected (name) {
    return !_.isNil(this.planets[name])
  },

  get (name) {
    if (!this.planets[name]) logger.error(new Error(`You must connect to planet ${name} first`))
    else return this.planets[name]
  },

  // Register an existing planet
  set (name, client) {
    this.planets[name] = client
  }
}
