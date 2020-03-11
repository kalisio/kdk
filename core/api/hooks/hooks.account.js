import _ from 'lodash'
import makeDebug from 'debug'
const debug = makeDebug('kalisio:kNotify:account:hooks')

export async function populateAccountUser (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'populateUser\' hook should only be used as a \'before\' hook.')
  }
  const app = hook.app
  const data = hook.data
  // Check whether the user has been already populated.
  if (!hook.params.user) {
    const userService = app.getService('users')
    const query = _.get(data, 'value.user')
    const token = _.get(data, 'value.token')
    if (query) {
      debug('Populating user from data', query)
      hook.params.user = await userService.find({ query })
      debug('Populated user from data', hook.params.user)
    } else if (token) {
      debug('Populating user from token', token)
      hook.params.user = await userService.find({ resetToken: token })
      debug('Populated user from token', hook.params.user)
    }
  }

  return hook
}
