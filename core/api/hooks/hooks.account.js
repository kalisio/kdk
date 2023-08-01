import _ from 'lodash'
import makeDebug from 'debug'

const debug = makeDebug('kdk:core:account:hooks')

export async function populateAccountUser (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'populateUser\' hook should only be used as a \'before\' hook.')
  }

  // Data
  const app = hook.app
  const data = hook.data
  const action = _.get(data, 'action')
  const userService = app.getService('users')
  const token = _.get(data, 'value.token')
  const query = _.get(data, 'value.user')

  //Check whether the user has been already populated.
  
  // if (!hook.params.user) {
  //   if (query) {
  //     debug('Populating user from data', query)
  //     hook.params.user = await userService.find({ query })
  //     debug('Populated user from data', hook.params.user)
  //   } else if (token) {
  //     debug('Populating user from token', token)
  //     hook.params.user = await userService.find({ resetShortToken: token })
  //     debug('Populated user from token', hook.params.user)
  //   }
  // }

  return hook
}
