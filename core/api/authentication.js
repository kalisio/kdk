import makeDebug from 'debug'
import _ from 'lodash'
import 'winston-daily-rotate-file'
// import { RateLimiter } from 'limiter'
import HttpLimiter from 'express-rate-limit'
import errors from '@feathersjs/errors'
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { OAuthStrategy, expressOauth } from '@feathersjs/authentication-oauth'
import PasswordValidator from 'password-validator'

const debug = makeDebug('kdk:core:authentication')
const { NotAuthenticated } = errors

export class AuthenticationProviderStrategy extends OAuthStrategy {
  async getEntityData (profile, entity) {
    const createEntity = _.isNil(entity)
    // Add provider Id
    entity = { [`${this.name}Id`]: profile.id || profile.sub }
    // When creating a new user extract required information from profile
    if (createEntity) {
      _.set(entity, 'email', _.get(profile, this.emailFieldInProfile || 'email'))
      _.set(entity, 'name', _.get(profile, this.nameFieldInProfile || 'name'))
    }
    // Store provider profile information
    if (profile) entity[`${this.name}`] = profile

    debug('Creating/Updating OAuth user', entity)

    return entity
  }

  async getEntityQuery (profile) {
    const query = {
      $or: [
        { [`${this.name}Id`]: profile.id || profile.sub },
        { email: _.get(profile, this.emailFieldInProfile || 'email') }
      ],
      $limit: 1
    }

    debug('Finding OAuth user with query', query)

    return query
  }
}

// This strategy is inspired by the following:
// 1) Custom strategy to ensure we renew the JWT when reauthenticating
// https://deniapps.com/blog/jwt-token-auto-renew-auto-logout
// 2) Custom strategy to ensure we can use JWT tokens not attached to a user for API access
// https://docs.feathersjs.com/cookbook/authentication/stateless.html
// However, it has been rewritten to work simultaneously with:
// - a stateless or user attached JWT
// - a socket or a rest transport
export class JWTAuthenticationStrategy extends JWTStrategy {
  async authenticate (authentication, params) {
    const { accessToken } = authentication
    const { entity } = this.configuration

    if (!accessToken) {
      throw new NotAuthenticated('No access token')
    }

    const payload = await this.authentication.verifyAccessToken(accessToken, params.jwt)
    const result = {
      // First key trick - by deleting the token here
      // we will get Feathers generate a new one
      // accessToken,
      authentication: {
        strategy: 'jwt',
        accessToken,
        payload
      }
    }

    // Second key trick
    // Return user attached to the token if any
    // Return basic information for a stateless token otherwise
    if (payload.sub) {
      const entityId = await this.getEntityId(result, params)
      const value = await this.getEntity(entityId, params)

      return {
        ...result,
        [entity]: value
      }
    }

    return result
  }
}

export async function createDefaultUsers () {
  const app = this
  const defaultUsers = app.get('authentication').defaultUsers
  if (!defaultUsers) return
  const usersService = app.getService('users')
  // Create default users if not already done
  const users = await usersService.find({ paginate: false })
  for (let i = 0; i < defaultUsers.length; i++) {
    const defaultUser = defaultUsers[i]
    const createdUser = _.find(users, { email: defaultUser.email })
    if (!createdUser) {
      app.logger.info('Initializing default user (email = ' + defaultUser.email + ')')
      await usersService.create(defaultUser)
    }
  }
}

// Middleware to be used to support jwt as a query param
export function extractJwtFromQuery (req, res, next) {
  const { jwt } = req.query
  if (jwt) {
    _.set(req, 'feathers.authentication', {
      strategy: 'jwt',
      accessToken: jwt
    })
  }

  next()
}

export default function auth (app) {
  const config = app.get('authentication')
  if (!config) return
  // Having undefined providers causes an issue in feathers but we'd like to be able
  // to set providers undefined in config file based on some conditions (eg env vars)
  if (config.oauth) config.oauth = _.omitBy(config.oauth, _.isNil)
  app.set('authentication', config)

  const authentication = new AuthenticationService(app)
  const strategies = config.authStrategies || []
  if (strategies.includes('jwt')) authentication.register('jwt', new JWTAuthenticationStrategy())
  if (strategies.includes('local')) authentication.register('local', new LocalStrategy())

  // Store available OAuth providers
  app.authenticationProviders = _.keys(_.omit(config.oauth, ['redirect', 'origins']))
  for (const provider of app.authenticationProviders) {
    authentication.register(provider, new AuthenticationProviderStrategy())
  }
  app.use(config.path, authentication)
  app.configure(expressOauth())

  const limiter = config.limiter
  if (limiter && limiter.http) {
    app.use(config.path, new HttpLimiter(limiter.http))
  }

  // Get access to password validator if a policy is defined
  if (config.passwordPolicy) {
    let validator
    app.getPasswordPolicy = function () {
      // Create on first access, should not be done outside a function because the app has not yet been correctly initialized
      if (validator) return validator
      const { minLength, maxLength, uppercase, lowercase, digits, symbols, noSpaces, prohibited } = config.passwordPolicy

      validator = new PasswordValidator()
      if (minLength) validator.is().min(minLength)
      if (maxLength) validator.is().max(maxLength)
      if (uppercase) validator.has().uppercase()
      if (lowercase) validator.has().lowercase()
      if (digits) validator.has().digits()
      if (symbols) validator.has().symbols()
      if (noSpaces) validator.not().spaces()
      if (prohibited) validator.is().not().oneOf(prohibited)

      validator.comparePassword = function (entity, password) {
        const [localStrategy] = app.service(config.path).getStrategies('local')

        return localStrategy.comparePassword(entity, password)
      }

      validator.options = config.passwordPolicy

      return validator
    }
  }
}
