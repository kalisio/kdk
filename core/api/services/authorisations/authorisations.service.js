import _ from 'lodash'
import { LRUCache } from 'lru-cache'
import makeDebug from 'debug'
import { defineAbilities } from '../../../common/permissions.js'

const debug = makeDebug('kdk:core:authorisations:service')

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
        resources = _.remove(scope, resource => resource.name && (resource.name === id.toString()))
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
      this.cacheConfig = config.cache
      // Store abilities of the N most active users in LRU cache (defaults to 1000)
      const max = this.cacheConfig.maxUsers || 1000
      // LRU cache lib switched from positional parameters to options object at some point
      // so that now we directly pass the options to it while before we used the max argument
      if (!this.cacheConfig.max && !this.cacheConfig.ttl && !this.cacheConfig.maxSize) this.cacheConfig.max = max
      this.cache = new LRUCache(this.cacheConfig)
      debug('Using LRU cache for user abilities')
    } else {
      debug('Do not use LRU cache for user abilities')
    }
  },

  getCacheKey (subject) {
    if (!this.cache) return null
    let cacheKey
    // Compute cache key based on provided function or user ID
    if (typeof this.cacheConfig.key === 'function') cacheKey = this.cacheConfig.key(subject)
    if (!cacheKey && subject && subject._id) cacheKey = subject._id.toString()
    return cacheKey || ANONYMOUS_USER
  },

  // Compute abilities for a given user and set it in cache the first time
  // or get it from cache if found
  async getAbilities (subject) {
    const cacheKey = this.getCacheKey(subject)
    if (cacheKey && this.cache.has(cacheKey)) return this.cache.get(cacheKey)
    
    // Provide app for any complex use case requiring to make requests
    const abilities = await defineAbilities(subject, this.app)

    if (cacheKey) {
      debug('Updating abilities of subject ' + (subject ? subject._id : ANONYMOUS_USER) + ' with cache key ' + cacheKey)
      this.cache.set(cacheKey, abilities)
    }

    return abilities
  },

  // Compute abilities for a given user and update it in cache
  async updateAbilities (subject) {
    const cacheKey = this.getCacheKey(subject)
    
    // Remove abilities from cache so that next call will populate it again
    if (cacheKey && this.cache.has(cacheKey)) this.cache.delete(cacheKey)
    
    const abilities = await this.getAbilities(subject)
    return abilities
  },

  // Clear abilities
  clearAbilities() {
    if (this.cache) {
      debug('Clearing user abilities cache')
      this.cache.clear()
    }
  }
}
