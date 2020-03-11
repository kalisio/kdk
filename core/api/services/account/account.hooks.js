import { when } from 'feathers-hooks-common'
import { populateAccountUser, enforcePasswordPolicy } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [when(hook => hook.data.action === 'resetPwdLong' || hook.data.action === 'passwordChange',
      populateAccountUser, enforcePasswordPolicy({ userAsItem: false, passwordField: 'value.password' }))],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
