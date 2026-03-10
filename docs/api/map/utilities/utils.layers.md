# Layer utilities

## Overview

This module provides a comprehensive set of helper functions for layer classification, caching, editing, saving, and managing layer styles and filters. It also exposes functions for generating layer legends and definitions from imported GeoJSON data.

## Classification Functions

### `isInMemoryLayer(layer)`

Returns `true` if the layer has no `_id` property (i.e. it exists only in memory and has not been persisted to the catalog).

---

### `isUserLayer(layer)`

Returns `true` if `layer.scope === 'user'`.

---

### `isFeatureLayer(layer)`

Returns `true` if `layer.service === 'features'`.

---

### `hasFeatureSchema(layer)`

Returns `true` if the layer has a `schema` property.

---

### `isLayerSelectable(layer)`

Returns `layer.isSelectable` (defaults to `true`).

---

### `isLayerHighlightable(layer)`

Returns `layer.isHighlightable` (defaults to `true`).

---

### `isLayerProbable(layer)`

Returns `layer.isProbable` (defaults to `false`).

---

### `isLayerStorable(layer)`

Returns `true` if the layer can be saved to the catalog. Only in-memory layers (no `_id`) are storable. Defaults to `isUserLayer(layer)` unless overridden by `layer.isStorable`.

---

### `isLayerEditable(layer)`

Returns `layer.isEditable` (defaults to `isUserLayer(layer)`).

---

### `isLayerCachable(layer)`

Returns `true` if the layer can be cached for offline use. Defaults to `true` for base layers, service-backed layers, pmtiles layers, and geoJson layers.

---

### `isLayerRemovable(layer)`

Returns `layer.isRemovable` (defaults to `isUserLayer(layer)`).

---

### `isLayerStyleEditable(layer)`

Returns `layer.isStyleEditable` (defaults to `isUserLayer(layer)`).

---

### `isLayerDataEditable(layer)`

Returns `layer.isDataEditable` (defaults to `isUserLayer(layer) && isFeatureLayer(layer)`).

---

### `isLayerFilterEditable(layer)`

Returns `layer.isFilterEditable` (defaults to `isUserLayer(layer) && isFeatureLayer(layer)`).

---

### `isTerrainLayer(layer)`

Returns `true` if the layer is a terrain layer (`type === 'TerrainLayer'` or Cesium type `Cesium`/`Ellipsoid`).

---

### `isMeasureLayer(layer)`

Returns `true` if the layer has both `variables` and `service` properties.

## Cache Functions

### `isLayerCached(layer)`

Checks whether the layer source URL is present in `LocalCache`.

- **Returns:** `Promise<boolean>`

---

### `setLayerCached(layer, options)`

Caches the layer data for offline use. Dispatches to the appropriate cache strategy based on layer type:
- **Base layers**: Tiles for each zoom level in the given bounds.
- **Service layers**: Creates an offline features service.
- **GeoJSON layers**: Caches the source URL response.
- **PMTiles layers**: Caches tile data including header and directory ranges.

- **Parameters:**
  - `layer` *(Object)*: The layer to cache.
  - `options.bounds` *(Array)*: `[[south, west], [north, east]]` bounding box.
  - `options.minZoom` *(number, optional)*: Minimum zoom level. Defaults to `3`.
  - `options.maxZoom` *(number, optional)*: Maximum zoom level.
  - `options.nbConcurrentRequests` *(number, optional)*: Maximum concurrent cache requests. Defaults to `10`.
- **Returns:** `Promise<void>`

---

### `setLayerUncached(layer, options)`

Removes cached data for the layer. Mirrors `setLayerCached` for the corresponding layer type.

- **Returns:** `Promise<void>`

---

### `setBaseLayerCached(layer, options)` / `setGeojsonLayerCached(layer)` / `setPMTilesLayerCached(layer, options)`

Type-specific cache functions. Prefer the generic `setLayerCached`.

## Edit Functions

### `editLayerStyle(layer, style, ignoreFeatureStyle?)`

Updates the style of a layer. For persisted layers (`layer._id`), patches the catalog service. For in-memory layers, updates the layer object directly. Regenerates legend and filter style templates as needed.

- **Parameters:**
  - `layer` *(Object)*: The layer to update.
  - `style` *(Object)*: A `{ point, line, polygon }` style object.
  - `ignoreFeatureStyle` *(boolean, optional)*: When `true`, sets `ignoreFeatureStyle` on the patch.
- **Returns:** `Promise<Object>` — The updated layer.

---

### `updateLayerWithFiltersStyle(layer)`

Regenerates the style templates for a persisted layer from its filter definitions and patches the catalog service.

- **Returns:** `Promise<void>`

---

### `editFilterStyle(layer, filter, engineStyle, style, ignoreFeatureStyle?)`

Updates the style of a specific filter on a layer and regenerates all style templates. Patches the catalog service with the new templates and filter list.

- **Returns:** `Promise<void>`

---

### `getLegendForLayer(layer)`

Generates the legend descriptor for a layer without mutating it:
- If the layer has filters with styles, generates a symbol-based legend from filter styles.
- Otherwise generates a single legend from the default layer style.

- **Returns:** `Promise<Object>` — A legend patch object `{ legend, filters? }` or `{ $unset: { legend: '' } }` when no filter has a style.

---

### `getFilterFunctionFromLayerFilters(layer)`

Builds a `sift`-based filter function from the layer's filter definitions. Active filters are combined with `filterOperators.active` (default `$or`) and inactive filters with `filterOperators.inactive` (default `$and`).

- **Returns:** `Function` — A predicate function `(item) => boolean`.

## Layer CRUD Functions

### `generateLayerDefinition(layerSpec, geoJson)`

Populates a layer specification object from a GeoJSON dataset. Sets default engine options (`geoJson`, `realtime`), generates a property schema if absent, assigns feature IDs, and extracts custom pane definitions from feature styles.

- **Parameters:**
  - `layerSpec` *(Object)*: The layer specification to populate in place.
  - `geoJson` *(Object)*: A GeoJSON Feature or FeatureCollection.
- **Returns:** `true` if the GeoJSON is valid, or `undefined` on error.

---

### `saveGeoJsonLayer(layer, geoJson, chunkSize?)`

Saves an in-memory GeoJSON layer to the catalog and features service. Validates geometry, uploads features in chunks (default 5000 points per chunk), and enables tiling for large datasets (>5000 points).

- **Returns:** `Promise<Object | undefined>` — The created catalog layer, or `undefined` if the user cancelled after geometry errors.

---

### `saveLayer(layer)`

Saves a layer definition to the catalog service without uploading features.

- **Returns:** `Promise<Object>` — The created catalog layer.

---

### `removeLayer(layer)`

Prompts the user for confirmation, then removes the layer from the catalog and (for feature layers) removes all associated features.

- **Returns:** `Promise<boolean>` — `true` if removed, `false` if the user cancelled.
