import makeDebug from 'debug'
import _ from 'lodash'
import 'winston-daily-rotate-file'
// import { RateLimiter } from 'limiter'
import HttpLimiter from 'express-rate-limit'
// import { TooManyRequests } from '@feathersjs/errors'
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { OAuthStrategy, expressOauth } from '@feathersjs/authentication-oauth'
import PasswordValidator from 'password-validator'

const debug = makeDebug('kdk:core:authentication')

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

// Custom strategy to ensure we renew the JWT when reauthenticating
// Based on https://deniapps.com/blog/jwt-token-auto-renew-auto-logout
export class RenewJWTStrategy extends JWTStrategy {
  async authenticate (authentication, params) {
    // run all of the original authentication logic, e.g. checking
    // if the token is there, is valid, is not expired, etc.
    const result = await super.authenticate(authentication, params)
    // and now the key trick - by deleting the accessToken here
    // we will get Feathers AuthenticationStrategy.create()
    // to generate us a new token.
    delete result.accessToken
    return result
  }
}

// Custom strategy to ensure we can use JWT tokens not attached to a user for API access
// Based on https://docs.feathersjs.com/cookbook/authentication/stateless.html
export class StatelessJWTStrategy extends JWTStrategy {
  get entityService () {
    return null
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
    console.log(jwt)
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
  if (strategies.includes('jwt')) authentication.register('jwt', new RenewJWTStrategy())
  if (strategies.includes('api')) authentication.register('api', new StatelessJWTStrategy())
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
