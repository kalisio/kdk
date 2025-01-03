import logger from 'loglevel'
import _ from 'lodash'
import { LocalForage } from '@kalisio/feathers-localforage'

export const LocalCache = {
  initialize () {
    const config = { name: 'offline_cache', storeName: 'cache_entries' }
    this.storage = LocalForage.createInstance(config)
    logger.debug('[KDK] LocalForage initialized with configuration:', config)
  },
  getStorage () {
    return this.storage
  },
  async getItem (key) {
    return await this.storage.getItem(key)
  },
  async setItem (key, item) {
    await this.storage.setItem(key, item)
  },
  async removeItem (key) {
    return await this.storage.removeItem(key)
  },
  async createCache (cacheName) {
    const cache = await caches.open(cacheName)
    return cache
  },
  async getCache (cacheName) {
    const cache = await caches.open(cacheName)
    return cache
  },
  async removeCache (cacheName) {
    await caches.delete(cacheName)
  },
  async has (key) {
    return !_.isNil(this.getCount(key))
  },
  async getCount (key) {
    return await this.storage.getItem(key)
  },
  async setCount (key, count) {
    await this.storage.setItem(key, count)
  },
  async set (cacheName, key, url, fetchOptions = {}) {
    const count = await this.getCount(key)
    if (!_.isNil(count)) {
      await this.setCount(key, count + 1)
    } else {
      const cache = await this.getCache(cacheName)
      let response = await fetch(url, fetchOptions)
      // Convert response from 206 -> 200 to make it cacheable
      if (response.status === 206) response = new Response(response.body, { status: 200, headers: response.headers })
      await cache.put(key, response)
      await this.storage.setItem(key, 1)
    }
  },
  async unset (cacheName, key) {
    const cache = await this.getCache(cacheName)
    const count = await this.getCount(key)
    if (_.isNil(count)) return
    if (count <= 1) {
      cache.delete(key)
      await this.storage.removeItem(key)
    } else {
      await this.setCount(key, count - 1)
    }
  }
}
