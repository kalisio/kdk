import makeDebug from 'debug'
import _ from 'lodash'
import 'winston-daily-rotate-file'
import { RateLimiter as SocketLimiter } from 'limiter'
import HttpLimiter from 'express-rate-limit'
import { TooManyRequests } from '@feathersjs/errors'
import authentication from '@feathersjs/authentication'
import jwt from '@feathersjs/authentication-jwt'
import local from '@feathersjs/authentication-local'
import oauth2 from '@feathersjs/authentication-oauth2'
import GithubStrategy from 'passport-github'
import GoogleStrategy from 'passport-google-oauth20'
import CognitoStrategy from 'passport-oauth2-cognito'
import OAuth2Verifier from './oauth2-verifier'
import OAuth2Handler from './oauth2-handler'
import PasswordValidator from 'password-validator'

const debug = makeDebug('kdk:core:authentication')
const debugLimiter = makeDebug('kdk:core:authentication:limiter')

function tooManyRequests (socket, message, key) {
  debug(message)
  const error = new TooManyRequests(message, { translation: { key } })
  socket.emit('rate-limit', error)
  // Add a timeout so that error message is correctly handled
  setTimeout(() => socket.disconnect(true), 3000)
}

function addOAuth2Client (app, name, clientConfig) {
  const config = app.get('authentication')
  // Feathers expect each client config to be a key in the globel app config
  // However on our side we manage an array of config by provider
  // so that we update config in place to reflect this setup in Feathers
  if (!config[name]) config[name] = clientConfig
  app.authenticationProviders.push(name)
}

function addGithubOAuth2Client (app, clientConfig) {
  const name = clientConfig.name || 'github'
  addOAuth2Client(app, name, clientConfig)
  app.configure(oauth2({
    name,
    Strategy: GithubStrategy,
    Verifier: OAuth2Verifier,
    handler: OAuth2Handler(clientConfig)
  }))
}

function addGoogleOAuth2Client (app, clientConfig) {
  const name = clientConfig.name || 'google'
  addOAuth2Client(app, name, clientConfig)
  app.configure(oauth2({
    name,
    Strategy: GoogleStrategy,
    Verifier: OAuth2Verifier,
    handler: OAuth2Handler(clientConfig)
  }))
}

function addCognitoOAuth2Client (app, clientConfig) {
  const name = clientConfig.name || 'cognito'
  addOAuth2Client(app, name, clientConfig)
  app.configure(oauth2({
    name,
    Strategy: CognitoStrategy,
    Verifier: OAuth2Verifier,
    handler: OAuth2Handler(clientConfig)
  }))
}

export default function auth () {
  const app = this
  const config = app.get('authentication')
  if (!config) return
  const limiter = config.limiter
  if (limiter && limiter.http) {
    app.use(config.path, new HttpLimiter(limiter.http))
  }
  // Store availalbe OAuth2 providers
  app.authenticationProviders = []
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
      // Add util functions/options to compare with previous passwords stored in history when required
      const verifier = new local.Verifier(app, _.merge({ usernameField: 'email', passwordField: 'password' },
        _.pick(config, ['service']), config.local))
      validator.comparePassword = verifier._comparePassword
      validator.options = config.passwordPolicy

      return validator
    }
  }
  // Set up authentication with the secret
  app.configure(authentication(config))
  app.configure(jwt())
  app.configure(local())
  if (config.github) {
    const githubClients = (!Array.isArray(config.github) ? [config.github] : config.github)
    githubClients.forEach(config => addGithubOAuth2Client(app, config))
  }
  if (config.google) {
    const googleClients = (!Array.isArray(config.google) ? [config.google] : config.google)
    googleClients.forEach(config => addGoogleOAuth2Client(app, config))
  }
  if (config.cognito) {
    const cognitoClients = (!Array.isArray(config.cognito) ? [config.cognito] : config.cognito)
    cognitoClients.forEach(config => addCognitoOAuth2Client(app, config))
  }
  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.getService('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  })
}

export function authSocket (app, socket) {
  const authConfig = app.get('authentication')
  const authLimiter = (authConfig ? authConfig.limiter : null)

  if (authLimiter && authLimiter.websocket) {
    const { tokensPerInterval, interval } = authLimiter.websocket
    socket.authSocketLimiter = new SocketLimiter(tokensPerInterval, interval)
    socket.on('authenticate', (data) => {
      // We only limit password guessing
      if (data.strategy === 'local') {
        debugLimiter(socket.authSocketLimiter.getTokensRemaining() + ' remaining authentication token for socket', socket.id, socket.conn.remoteAddress)
        if (!socket.authSocketLimiter.tryRemoveTokens(1)) { // if exceeded
          tooManyRequests(socket, 'Too many authentication requests in a given amount of time (rate limiting)', 'RATE_LIMITING_AUTHENTICATION')
        }
      }
    })
  }
}
