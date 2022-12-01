import mailer from 'feathers-mailer'
import makeDebug from 'debug'

const debug = makeDebug('kdk:core:mailer:service')

export default function (name, app, options) {
  // Keep track of config
  const config = Object.assign({}, app.get('mailer'), options)
  debug('Mailer created with config ', config)
  return mailer(config)
}
