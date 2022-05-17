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

export class OAuth2Verifier extends OAuthStrategy {
  async getEntityData (profile, entity) {
    return Object.assign({}, entity, profile)
  }

  async createEntity (profile) {
    if (!profile.id) {
      profile.id = profile.sub
      delete profile.sub
    }

    return { profile }
  }

  async updateEntity (entity, profile) {
    if (!profile.id) {
      profile.id = profile.sub
      delete profile.sub
    }

    return { profile }
  }

  async getEntityQuery (profile) {
    const options = this.authentication.configuration
    const query = {
      $or: [
        { [options.idField]: profile.id || profile.sub }
      ],
      $limit: 1
    }
    options.emailFieldInProfile.forEach(emailFieldInProfile => {
      query.$or.push({ [options.emailField]: _.get(profile, emailFieldInProfile) })
    })

    debug('Finding user', query)

    return query
  }
}

export default function auth (app) {
  const config = app.get('authentication')
  if (!config) return

  const emailFieldInProfile = config.emailFieldInProfile
    ? (Array.isArray(config.emailFieldInProfile) ? config.emailFieldInProfile : [config.emailFieldInProfile])
    : ['email', 'emails[0].value']
  const emailField = config.emailField || 'email'
  const limiter = config.limiter

  app.set('authentication', Object.assign({}, config, {
    emailField,
    emailFieldInProfile
  }))

  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('github', new OAuth2Verifier())
  authentication.register('google', new OAuth2Verifier())
  authentication.register('cognito', new OAuth2Verifier())

  if (limiter && limiter.http) {
    app.use(config.path, new HttpLimiter(limiter.http))
  }

  // Store availalbe OAuth2 providers
  app.authenticationProviders = Object.keys(config.oauth)
  app.use(config.path, authentication)
  app.configure(expressOauth())

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
