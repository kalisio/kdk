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
  async has (cacheName, url) {
    // Check if cached or not
    const urls = await localforage.getItem(cacheName)
    return urls && urls[url]
  },
  async set (cacheName, url) {
    const cache = await this.getCache(cacheName)
    await cache.add(url)
    const urls = await localforage.getItem(cacheName)
    // Tag we cache it in local storage
    if (urls) {
      urls[url] = true
      await localforage.setItem(cacheName, urls)
    } else {
      await localforage.setItem(cacheName, { [url]: true })
    }
  },
  async get (cacheName, url) {
    const cache = await this.getCache(cacheName)
    const response = await cache.match(url)
    return response
  },
  async clear (cacheName, url) {
    if (this.has(cacheName, url)) {
      const cache = await this.getCache(cacheName)
      cache.delete(url)
      // Tag we don't cache it anymore in local storage
      const urls = await localforage.getItem(cacheName)
      delete urls[url]
      await localforage.setItem(cacheName, urls)
    }
  }
}
