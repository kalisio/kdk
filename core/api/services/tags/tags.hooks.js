import _ from 'lodash'
import { populateTagResource, addTagIfNew, removeTagIfUnused, tagResource, untagResource } from '../../hooks'
import { disallow, iff } from 'feathers-hooks-common'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [disallow('external')],
    create: [populateTagResource, iff(hook => _.has(hook, 'data.value') && _.has(hook, 'data.scope'), addTagIfNew)],
    update: [disallow()],
    patch: [disallow('external')],
    // Let the removal of the actual tag object by ID pass without running these hooks
    // Indeed the initial call is used to remove the tag from the resource with the ID of the resource given, not the tag one
    remove: [populateTagResource, iff(hook => _.has(hook.params, 'query.value') && _.has(hook.params, 'query.scope'), removeTagIfUnused)]
  },

  after: {
    all: [],
    find: [],
    get: [],
    // Let the tagging of the resource object occur only when resource has been found
    create: [iff(hook => hook.params.resource, tagResource)],
    update: [],
    patch: [],
    // Let the untagging of the resource object occur only when resource has been found
    remove: [iff(hook => hook.params.resource, untagResource)]
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
