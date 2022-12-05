import mailer from 'feathers-mailer'
import makeDebug from 'debug'

const debug = makeDebug('kdk:core:mailer:service')

export default function (name, app, options) {
  // Keep track of mailer config in service options
  const config = Object.assign(options, app.get('mailer'))
  debug('Mailer created with config ', config)
  return mailer(config)
}
