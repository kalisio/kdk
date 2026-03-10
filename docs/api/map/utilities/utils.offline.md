# Offline utilities

## Overview

This module provides functions for caching map views and their associated layers for offline use. It builds on the core KDK offline infrastructure and the `LocalCache` store to persist catalog, project, and feature data locally.

## Functions

### `createOfflineServicesForViews(offlineDocument)`

Initialises offline-capable service instances for catalog, projects, and features data.

- **Parameters:**
  - `offlineDocument` *(Object)*: An offline document as produced by the core `createOfflineDocument` utility, containing a `metadata` object with service cache options.
- **Returns:** `Promise<void>`

---

### `removeOfflineServicesForViews()`

Removes all offline service instances created for views and clears their cache entries.

- **Returns:** `Promise<void>`

---

### `getOfflineDocumentQueryForViews()`

Builds the query object required to populate an offline document for all cached views. Reads the cached views from `LocalCache` and constructs bounding-box queries for features.

- **Returns:** `Promise<Object>` — An object with `catalog`, `projects`, and `features` query sub-objects.

---

### `addViewToCache(view, options?)`

Adds or updates a view entry in the `LocalCache` `'views'` store.

- **Parameters:**
  - `view` *(Object)*: The view (context) object to cache. Must have an `_id`.
  - `options` *(Object, optional)*: Additional metadata to merge with the view entry (e.g. zoom bounds).
- **Returns:** `Promise<Object>` — The updated views map.

---

### `removeViewFromCache(view)`

Removes a view from the `LocalCache` `'views'` store.

- **Parameters:**
  - `view` *(Object)*: The view to remove. Must have an `_id`.
- **Returns:** `Promise<Object | undefined>` — The removed view entry with its cached options, or `undefined` if it was not cached.

---

### `cacheLayersForView(view, layers, options?)`

Caches all the given layers for the bounding box of the view.

- **Parameters:**
  - `view` *(Object)*: The view defining the bounding box (`south`, `west`, `north`, `east`).
  - `layers` *(Array)*: The layers to cache.
  - `options` *(Object, optional)*: Additional options forwarded to `setLayerCached` (e.g. `minZoom`, `maxZoom`).
- **Returns:** `Promise<void>`

---

### `uncacheLayersForView(view, layers, options?)`

Removes cached data for the given layers within the view bounding box.

- **Parameters:**
  - `view` *(Object)*: The view defining the bounding box.
  - `layers` *(Array)*: The layers to uncache.
  - `options` *(Object, optional)*: Additional options forwarded to `setLayerUncached`.
- **Returns:** `Promise<void>`

---

### `cacheView(view, layers, options?)`

Performs a full view cache operation:
1. Adds the view to the cache store.
2. Generates and populates an offline document for all cached views.
3. Creates offline service instances.
4. Caches the provided layers for the view's bounding box.

- **Parameters:**
  - `view` *(Object)*: The view to cache.
  - `layers` *(Array)*: The layers to cache for this view.
  - `options` *(Object, optional)*: Additional options (e.g. `minZoom`, `maxZoom`).
- **Returns:** `Promise<void>`

---

### `uncacheView(view, layers, options?)`

Performs a full view uncache operation:
1. Removes the view from the cache store.
2. Uncaches the provided layers.
3. When no more views remain in the cache, also removes offline services, the offline document, and the `'views'` and `'services'` cache entries.

- **Parameters:**
  - `view` *(Object)*: The view to uncache. The stored options are merged back into `options`.
  - `layers` *(Array)*: The layers to uncache.
  - `options` *(Object, optional)*: Additional options forwarded to `uncacheLayersForView`.
- **Returns:** `Promise<void>`
