import { populateSubjects, populateResource } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [populateSubjects, populateResource],
    update: [],
    patch: [],
    remove: [populateSubjects, populateResource]
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
