import common from 'feathers-hooks-common'
import { populateAccountUser, enforcePasswordPolicy } from '../../hooks/index.js'

const { when } = common

export default {
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
