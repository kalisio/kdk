import _ from 'lodash'
import {
  populateTagResource, addTagIfNew, removeTagIfUnused,
  tagResource, untagResource, updateOrganisationResource
} from '../../hooks/index.js'
import common from 'feathers-hooks-common'

const { iff } = common

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [populateTagResource, iff(hook => _.has(hook, 'data.value') && _.has(hook, 'data.scope'), addTagIfNew)],
    update: [],
    patch: [],
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
    // Tags are patched internally for reference counting, update only if value is changed
    update: [iff(hook => _.has(hook, 'data.value'), updateOrganisationResource('tags'))],
    patch: [iff(hook => _.has(hook, 'data.value'), updateOrganisationResource('tags'))],
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
