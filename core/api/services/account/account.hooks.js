import common from 'feathers-hooks-common'
import { enforcePasswordPolicy } from '../../hooks/index.js'

const { when } = common

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [when(hook => hook.data.action === 'resetPwdShort' || hook.data.action === 'passwordChange',
      enforcePasswordPolicy({ userAsItem: false, passwordField: 'value.password' }))],
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
