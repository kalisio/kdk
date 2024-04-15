import logger from 'loglevel'
import localforage from 'localforage'

export const LocalCache = {
  initialize () {
    logger.debug('[KDK] initializing local cache')
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
    const url = await localforage.getItem(key)
    return url
  },
  async set (cacheName, key, url, tag) {
    const cache = await this.getCache(cacheName)
    const response = await fetch(url)
    await cache.put(key, response)
    await localforage.setItem(key, [tag])

  },
  async getTags (key) {
    return await localforage.getItem(key)
  },
  async addTag (key, tag) {
    if (this.has(key)) {
      let tags = await this.getTags(key)
      if (tags && !tags.contains(tag)) {
        tags.push(tag)
        await localforage.setItem(key, tags)
      }
    }
  },
  async removeTag (key, tag) {
    if (this.has(key)) {
      let tags = await this.getTags(key)
      if (tags) {
        let index = tags.indexOf(tag)
        tags.splice(index, 1)
        await localforage.setItem(key, tags)
      }
    }
  },
  async clear (cacheName, key) {
    if (this.has(key)) {
      const cache = await this.getCache(cacheName)
      cache.delete(key)
      localforage.removeItem(key)
    }
  }
}
