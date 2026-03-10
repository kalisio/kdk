# Catalog utilities

## Overview

This module provides low-level functions for interacting with the KDK catalog service: fetching layers, categories, sublegends, and views; organizing them by category; and managing JWT authentication tokens in layer URLs.

## Functions

### `setUrlJwt(item, path, baseUrl, jwtField, jwt)`

Injects a JWT token as a query parameter into a URL stored at `path` in an `item` object. Handles token refresh by stripping any existing JWT before adding the new one.

- **Parameters:**
  - `item` *(Object)*: The object containing the URL property.
  - `path` *(string)*: Lodash path to the URL property within `item`.
  - `baseUrl` *(string)*: Only URLs starting with this base are modified.
  - `jwtField` *(string)*: The query parameter name for the JWT.
  - `jwt` *(string)*: The JWT token value.

---

### `setEngineJwt(layers, planetApi?)`

Injects gateway and/or API JWT tokens into all relevant URL properties of a list of layers. Handles both Leaflet and Cesium URL properties, as well as OGC protocol URLs.

- **Parameters:**
  - `layers` *(Array)*: The layers to update.
  - `planetApi` *(Object, optional)*: The API client instance. Defaults to the application API.
- **Returns:** `Promise<Array>` — The updated layers array.

---

### `getLayersByCategory(layers, categories)`

Organises a list of layers into groups based on category definitions. Built-in categories filter by query; user-defined categories filter by explicit layer name list. Layers are removed from the input array once assigned to a category.

- **Parameters:**
  - `layers` *(Array | Object)*: The layers to organise.
  - `categories` *(Array)*: Category definitions, each with optional `options.filter`, `options.orderBy`, `options.order`, or `layers` array.
- **Returns:** `Object` — A map of category name to sorted layer array.

---

### `getOrphanLayers(layers, layersByCategory)`

Returns layers that were not assigned to any category, sorted by `_id`.

- **Parameters:**
  - `layers` *(Array | Object)*: The full layer list.
  - `layersByCategory` *(Object)*: The output of `getLayersByCategory`.
- **Returns:** `Array`

---

### `processTranslations(item)`

Registers i18n translations from `item.i18n` and sets `item.label` and `item.description` using `i18n.tie` if not already set.

- **Parameters:**
  - `item` *(Object)*: A catalog item (layer, category, view, etc.) that may have an `i18n` property.

---

### `getLayers(options?)`

Fetches layers from the catalog service.

- **Parameters:**
  - `options.query` *(Object, optional)*: Additional query filter.
  - `options.context` *(string, optional)*: Service context ID.
  - `options.project` *(Object, optional)*: Project to scope the query to.
  - `options.planetApi` *(Object, optional)*: API client to use.
- **Returns:** `Promise<Array>` — The fetched layers with translations processed and JWT tokens injected.

---

### `getCategories(options?)`

Fetches categories from the catalog service (query filters for `type: 'Category'`).

- **Returns:** `Promise<Array>`

---

### `getSublegends(options?)`

Fetches sublegends from the catalog service (query filters for `type: 'Sublegend'`).

- **Returns:** `Promise<Array>`

---

### `getLayersBySublegend(layers, sublegends)`

Organises layers by sublegend, similar to `getLayersByCategory` but based on `options.filter` only.

- **Returns:** `Object` — A map of sublegend name to layer array.

---

### `getViews(options?)`

Fetches views (contexts) from the catalog service (query filters for `type: 'Context'`).

- **Returns:** `Promise<Array>`

---

### `orderCatalogItemsBy(items, itemsOrder)`

Reorders an array of catalog items so that items whose `_id` or `name` appear in `itemsOrder` are moved to the front, in the order specified.

- **Parameters:**
  - `items` *(Array)*: The items array to reorder in place.
  - `itemsOrder` *(Array)*: An array of `_id` or `name` strings defining the desired order.
