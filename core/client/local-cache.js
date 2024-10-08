import logger from 'loglevel'
import _ from 'lodash'
import { LocalForage } from '@kalisio/feathers-localforage'

export const LocalCache = {
  initialize () {
    logger.debug('[KDK] initializing local cache')
    LocalForage.config({
      name: 'offline_views',
      storeName: 'cache_entries'
    })
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
    return await LocalForage.getItem(key)
  },
  async set (cacheName, key, url) {
    const count = await this.getCount(key)
    if (!_.isNil(count)) {
      await LocalForage.setItem(key, count + 1)
    } else {
      const cache = await this.getCache(cacheName)
      const response = await fetch(url)
      await cache.put(key, response)
      await LocalForage.setItem(key, 1)
    }
  },
  async unset (cacheName, key) {
    const cache = await this.getCache(cacheName)
    const count = await this.getCount(key)
    if (_.isNil(count)) return
    if (count <= 1) {
      cache.delete(key)
      await LocalForage.removeItem(key)
    } else {
      await LocalForage.setItem(key, count - 1)
    }
  }
}
