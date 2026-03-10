# Offline

## Overview

The `utils.offline.js` module manages offline-first data synchronisation for KDK applications. It uses an [Automerge](https://automerge.org/) CRDT document (via the `offline` service) and a `LocalCache` to create, update, and tear down offline-capable service instances.

## Functions

### `async createOfflineServices(offlineDocument?)`

Creates offline service instances for all services listed in the `LocalCache` `'services'` entry. If `offlineDocument` is not provided, it is retrieved from cache.

- **Parameters:**
  - `offlineDocument` *(Object, optional)*: A pre-fetched offline document. If omitted, fetched from `LocalCache`.
- **Returns:** `Promise<void>`

### `async setOfflineServicesDocumentHandle(offlineDocument?)`

Updates the Automerge document handle on all existing offline services. Called after authentication to provide a user-scoped document handle.

- **Parameters:**
  - `offlineDocument` *(Object, optional)*: A pre-fetched offline document.
- **Returns:** `Promise<void>`

### `async removeOfflineServices()`

Removes all registered offline services.

- **Returns:** `Promise<void>`

### `async createOfflineDocument(query)`

Creates a new Automerge offline document via the `offline` service for the given query, caches it in `LocalCache`, and returns it. Any previously cached document is removed first.

- **Parameters:**
  - `query` *(Object)*: The query used to scope the offline document.
- **Returns:** `Promise<Object>` — the created offline document.

### `async getOfflineDocument()`

Retrieves the cached offline document and resolves its document handle via the Automerge repository.

- **Returns:** `Promise<Object | undefined>` — the offline document with a `documentHandle`, or `undefined` if none is cached.

### `async getOfflineDocumentContent(offlineDocument?)`

Fetches the full content of the offline document, separating metadata (`__meta`) from actual data.

- **Parameters:**
  - `offlineDocument` *(Object, optional)*: A pre-fetched offline document. If omitted, fetched from cache.
- **Returns:** `Promise<Object | undefined>` — the offline document enriched with `content` and `metadata` properties.

### `async removeOfflineDocument()`

Removes the cached offline document via the `offline` service and clears it from `LocalCache`.

- **Returns:** `Promise<Object | undefined>` — the removed document descriptor, or `undefined` if none existed.

### `async addServiceToCache(service, options?)`

Adds a service to the `'services'` entry in `LocalCache`, merging the given options.

- **Parameters:**
  - `service` *(string)*: The service name.
  - `options` *(Object, optional)*: Options stored alongside the service (e.g. `features`, `context`).
- **Returns:** `Promise<Object>` — the updated services cache entry.

### `async removeServiceFromCache(service)`

Removes a service from the `'services'` entry in `LocalCache`.

- **Parameters:**
  - `service` *(string)*: The service name.
- **Returns:** `Promise<Object | undefined>` — the removed service options, or `undefined` if the service was not cached.
