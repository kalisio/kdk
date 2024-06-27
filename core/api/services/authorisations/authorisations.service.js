import _ from 'lodash'
import lruCache from 'lru-cache'
import makeDebug from 'debug'
import { defineAbilities } from '../../../common/permissions.js'

const debug = makeDebug('kdk:core:authorisations:service')
const { LRUCache } = lruCache

// Global key to store abilities in cache for anonymous users
const ANONYMOUS_USER = 'anonymous'

export default {
  // Used to change permissions for a subject on a resource
  // We pass parameters in the query/data object
  // The params object should be already filled by populate hooks
  create (data, params) {
    const query = params.query
    const context = params.resourcesService.context
    // Make hook usable with query params as well
    const scopeName = data.scope || query.scope // Get scope name first
    return Promise.all(params.subjects.map(async subject => {
      // Then retrieve the right scope on the subject
      const scope = _.get(subject, scopeName, [])
      // Then the target resource
      let resource = _.find(scope, resource => resource._id && (resource._id.toString() === params.resource._id.toString()))
      if (!resource) {
        // Fallback as name
        resource = _.find(scope, resource => resource.name && (resource.name === params.resource.name))
      }
      // On first authorisation create the resource in scope
      if (!resource) {
        resource = Object.assign({}, params.resource)
        if (context) {
          resource.context = (typeof context === 'object' ? context._id.toString() : context.toString())
        }
        scope.push(resource)
      }
      // Hooks should have populate subject/resource,
      // now we have to set permissions on the given subject's scope
      resource.permissions = data.permissions || query.permissions
      // This cover the case when we create the scope on the first auth,
      // so that if the caller want to get back the update subject he can have it
      _.set(subject, scopeName, scope)
      debug('Updating scope ' + scopeName + ' for subject ' + subject._id + ' on resource ' + params.resource._id + ':', scope)
      subject = await params.subjectsService.patch(subject._id, {
        [scopeName]: scope
      }, {
        user: params.user
      })
      await this.updateAbilities(subject)
      debug('Authorisation ' + data.permissions + ' set for subject ' + subject._id + ' on resource ' + params.resource._id + ' with scope ' + scopeName)
      return subject
    }))
  },

  // Used to remove permissions for a subject on a resource
  // We use ID as target resource and pass parameters in the query object
  // The params object should be already filled by populate hooks
  remove (id, params) {
    const query = params.query
    const scopeName = query.scope // Get scope name first
    return Promise.all(params.subjects.map(async subject => {
      // Then retrieve the right scope on the subject
      const scope = _.get(subject, scopeName, [])
      // Remove the target resource if any
      let resources = _.remove(scope, resource => resource._id && (resource._id.toString() === id.toString()))
      if (resources.length === 0) {
        // Fallback as name
        resources = _.remove(scope, resource => resource.name && (resource.name === id))
      }
      if (resources.length > 0) {
        // This cover the case when we create the scope on the first auth,
        // so that if the caller want to get back the update subject he can have it
        _.set(subject, scopeName, scope)
        // Skip patching if the subject is currently deleted
        if (!subject.deleted) {
          debug('Updating scope ' + scopeName + ' for subject ' + subject._id + ' on resource ' + id + ':', scope)
          subject = await params.subjectsService.patch(subject._id, {
            [scopeName]: scope
          }, {
            user: params.user
          })
          await this.updateAbilities(subject)
          debug('Authorisation unset for subject ' + subject._id + ' on resource ' + id + ' with scope ' + scopeName)
          return subject
        }
      }
      return subject
    }))
  },

  setup (app) {
    const config = app.get('authorisation')
    if (config && config.cache) {
      // Store abilities of the N most active users in LRU cache (defaults to 1000)
      const max = config.cache.maxUsers || 1000
      // LRU cache lib switched from positional parameters to options object at some point
      // so that now we directly pass the options to it while before we used the max argument
      if (!config.cache.max && !config.cache.ttl && !config.cache.maxSize) config.cache.max = max
      this.cache = new LRUCache(config.cache)
      debug('Using LRU cache for user abilities')
    } else {
      debug('Do not use LRU cache for user abilities')
    }
  },

  // Compute abilities for a given user and set it in cache the first time
  // or get it from cache if found
  async getAbilities (subject) {
    if (this.cache) {
      if (subject && subject._id) {
        if (this.cache.has(subject._id.toString())) return this.cache.get(subject._id.toString())
      } else {
        if (this.cache.has(ANONYMOUS_USER)) return this.cache.get(ANONYMOUS_USER)
      }
    }
    // Provide app for any complex use case requiring to make requests
    const abilities = await defineAbilities(subject, this.app)

    if (this.cache) {
      if (subject && subject._id) {
        this.cache.set(subject._id.toString(), abilities)
      } else {
        this.cache.set(ANONYMOUS_USER, abilities)
      }
    }

    return abilities
  },

  // Compute abilities for a given user and update it in cache
  async updateAbilities (subject) {
    if (this.cache) {
      if (subject && subject._id) {
        this.cache.delete(subject._id.toString())
      } else {
        this.cache.delete(ANONYMOUS_USER)
      }
    }

    const abilities = await this.getAbilities(subject)
    return abilities
  },

  // Clear abilities
  clearAbilities() {
    if (this.cache) this.cache.clear()
  }
}
