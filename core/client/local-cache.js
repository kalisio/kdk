import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import localforage from 'localforage'

export const LocalCache = {
  initialize () {
    logger.debug(`[KDK] initializing local cache`)
  },
  async createCache (cacheName) {
    const cache = await caches.open(cacheName)
    await localforage.setItem(cacheName, {})
    return cache
  },
  async getCache (cacheName) {
    const cache = await caches.open(cacheName)
    return cache
  },
  async removeCache (cacheName) {
    await caches.delete(cacheName)
    await localforage.removeItem(cacheName)
  },
  async has (cacheName, key) {
    // Check if cached or not
    const urls = await localforage.getItem(cacheName)
    return urls && urls[key]
  },
  async set (cacheName, url) {
    const key = new URL(url)
    key.searchParams.delete('jwt')
    const cache = await this.getCache(cacheName)
    const urls = await localforage.getItem(cacheName)
    // Tag we cache it in local storage
    if (urls) {
      urls[key] = true
      await localforage.setItem(cacheName, urls)
    } else {
      await localforage.setItem(cacheName, { [key]: true })
    }
    const response = await fetch(url)
    await cache.put(key, response)
    // await cache.add(url)
  },
  async get (cacheName) {
    const cache = await this.getCache(cacheName)
    return cache.keys
  },
  async clear (cacheName, key) {
    if (this.has(cacheName, key)) {
      const cache = await this.getCache(cacheName)
      cache.delete(key)
      // Tag we don't cache it anymore in local storage
      const urls = await localforage.getItem(cacheName)
      delete urls[key]
      await localforage.setItem(cacheName, urls)
    }
  }
}
