# Features utilities

This module provides helper functions to manage recurring tasks on features, like binding and unbinding event listeners to track real-time events on features services and update layers accordingly. It also provides functions for querying, transforming, validating, and persisting GeoJSON features.

## Functions

### `listenToFeaturesServiceEventsForLayer(layer, options, listeners)`

Binds event listeners to a given layer's service events and stores them in the returned object.

> Rely on [listenToServiceEvents](../../core/utilities/utils.services.md)

#### Parameters

- `layer` (Object) - The layer to listen for service events.
- `options` (Object) - Event handlers to be executed when an event occurs. This object may contain:
  - `context` (String | Object | null) - Service context if any.
  - `created` (Function | null) - Handler for feature creation events.
  - `updated` (Function | null) - Handler for feature update events.
  - `patched` (Function | null) - Handler for feature patch events.
  - `removed` (Function | null) - Handler for feature removal events.
  - `all` (Function | null) - Handler for all events if no specific defined.
- `listeners` (Object) - Object to store the registered event listeners.

#### Returns

- `listeners` (Object) - The registered event listeners.

#### Example Usage

```javascript
const layer = { service: 'features', _id: 'layer-1' };
const listeners = {};

const registeredListeners = listenToFeaturesServiceEventsForLayer(layer, {
  created: (feature, layer) => console.log(`Feature created in layer ${layer._id}:`, feature),
  updated: (feature, layer) => console.log(`Feature updated in layer ${layer._id}:`, feature),
  removed: (feature, layer) => console.log(`Feature removed in layer ${layer._id}:`, feature),
}, listeners);
```

---

### `unlistenToFeaturesServiceEventsForLayer(layer, listeners)`

Unbinds previously registered event listeners from a given layer's service events.

> Rely on [unlistenToServiceEvents](../../core/utilities/utils.services.md)

#### Parameters

- `layer` (Object) - The layer to remove service event listeners from.
- `listeners` (Object) - The object containing registered event listeners.

#### Example Usage

```javascript
unlistenToFeaturesServiceEventsForLayer(layer, registeredListeners);
```

---

### `processFeatures(geoJson, processor)`

Applies a processor function or EJS template string to each feature in a GeoJSON dataset. Modifies features in place.

- **Parameters:**
  - `geoJson` *(Object)*: GeoJSON Feature or FeatureCollection.
  - `processor` *(Function | string)*: Either a function `(feature) => void` or an EJS template string with `{ feature, properties }` context.

---

### `transformFeatures(geoJson, transform)`

Applies geometric transformations (scale, rotate, translate) to each feature in a GeoJSON dataset. Uses Turf.js and mutates features in place.

- **Parameters:**
  - `geoJson` *(Object)*: GeoJSON Feature or FeatureCollection.
  - `transform` *(Object)*: Transformation spec with optional:
    - `scale` *(Object)*: `{ factor, ...turfOptions }`
    - `rotate` *(Object)*: `{ angle, ...turfOptions }`
    - `translate` *(Object)*: `{ distance, direction }` or `{ point, pivot }` (rhumb line bearing/distance computed automatically)

---

### `computeBoundingBox(geoJson, padding?)`

Computes the bounding box of a GeoJSON dataset with optional padding.

- **Parameters:**
  - `geoJson` *(Object)*: GeoJSON Feature or FeatureCollection.
  - `padding` *(number, default `0`)*: Fractional padding to add on each side (e.g. `0.1` for 10% padding).
- **Returns:** `[west, south, east, north]` or `null` if the bounding box contains non-finite values.

---

### `computeConvexHull(geoJson)`

Computes the convex hull of all points in a GeoJSON dataset. Falls back to a single point or line string for degenerate cases.

- **Returns:** GeoJSON Feature (Point, LineString, or Polygon) or `null` if the input is empty.

---

### `buildGradientPath(geoJson, options)`

Converts a FeatureCollection of multi-geometry features into line features with a `gradient` property array, suitable for gradient-path rendering. Uses Chroma.js for color scale computation.

- **Parameters:**
  - `geoJson` *(Object)*: A FeatureCollection where each feature has a `GeometryCollection` and a variable property array.
  - `options.build.variable` *(Object)*: Variable definition with `chromajs.colors` and either `chromajs.domain` or `chromajs.classes`.
- **Returns:** `Promise<void>` — Mutates `geoJson.features` in place.

---

### `getBaseQueryForFeatures(options)`

Builds the base query for a feature layer. Calls `options.baseQuery()` if it is a function, otherwise uses it directly.

- **Returns:** `Promise<Object | null>` — `null` signals to skip the update.

---

### `getFilterQueryForFeatures(options)`

Builds the filter query for a feature layer by combining `options.filterQuery` with any active/inactive filter conditions from `options.filters`.

- **Returns:** `Promise<Object>`

---

### `getSortQueryForFeatures(options)`

Builds the sort query `{ $sort: ... }` for a feature layer from `options.sortQuery`.

- **Returns:** `Promise<Object>`

---

### `getFeaturesUpdateInterval(options)`

Returns the update interval as a Moment duration from `options.every`, or `null` if not set.

---

### `getFeaturesQueryInterval(options)`

Returns the query interval as a Moment duration from `options.queryFrom`. Defaults to `-2 × updateInterval` if not explicitly set.

---

### `shouldSkipFeaturesUpdate(lastUpdateTime, options, interval?)`

Returns `true` if the elapsed time since `lastUpdateTime` is less than the update interval, meaning no update is needed.

---

### `getProbeFeatures(options)`

Fetches features from a probe service (uses `options.probeService`) with base, filter, and sort queries applied, plus optional processor and transform.

- **Returns:** `Promise<Object>` — A GeoJSON FeatureCollection response.

---

### `getFeaturesQuery(options, queryInterval?, queryLevel?)`

Builds the full query object for fetching time-varying features. Handles variable aggregation, time range filtering, level filtering, groupBy, and build instructions (e.g. gradient path).

- **Returns:** `Promise<Object>`

---

### `isFeatureInQueryInterval(feature, options)`

Returns `true` if the feature's `time` property falls within the current query interval. Features without a time are always considered in-range.

---

### `getFeaturesFromQuery(options, query)`

Fetches features from the layer's service using the given query. Applies processor, transform, and build instructions (e.g. `gradientPath`) as needed.

- **Returns:** `Promise<Object>` — A GeoJSON FeatureCollection response.

---

### `getMeasureForFeatureBaseQuery(layer, feature)`

Builds a base query for fetching measure time-series for a specific feature. Uses `layer.chronicleId` or `layer.featureId` (supports compound IDs) and adds `$groupBy`.

- **Returns:** `Object`

---

### `getMeasureForFeatureQuery(layer, feature, startTime, endTime, level?)`

Builds the full query for fetching measure time-series for a feature within a time range.

- **Returns:** `Promise<Object>`

---

### `getMeasureForFeatureFromQuery(layer, feature, query)`

Executes a pre-built measure query and returns the first feature result.

- **Returns:** `Promise<Object | undefined>`

---

### `getMeasureForFeature(layer, feature, startTime, endTime, level?)`

Convenience function that combines query building and execution to fetch measure data for a feature.

- **Returns:** `Promise<Object | undefined>` — The first probed location feature, or `undefined` on error.

---

### `cleanFeatures(geoJson, precision?)`

Validates and attempts to repair polygon geometries using JSTS. Reports geometry errors and applies a buffer-based correction.

- **Parameters:**
  - `geoJson` *(Object)*: GeoJSON Feature or FeatureCollection.
  - `precision` *(number, default `1e-9`)*: Buffer precision for geometry repair.
- **Returns:** `{ errors: Array, geometryTypes: Array }` — List of validation errors and the set of geometry types encountered.

---

### `checkFeatures(geoJson, options?)`

Checks features for redundant coordinates and self-intersections (kinks). Removes redundant coordinates and returns kink features.

- **Parameters:**
  - `options.kinks` *(boolean, default `true`)*: Check for self-intersecting polygons.
  - `options.redundantCoordinates` *(boolean, default `true`)*: Remove redundant coordinates.
- **Returns:** `{ kinks: Array }` — Features removed due to self-intersections.

---

### `createFeatures(geoJson, layer, chunkSize?, processCallback?)`

Creates features in the layer's FeathersJS service. For a single feature, calls `create` directly. For multiple features, splits into chunks based on point count (default 5000 points per chunk).

- **Parameters:**
  - `processCallback` *(Function, optional)*: Called after each chunk with `(chunkIndex, chunk)`.
- **Returns:** `Promise<Object | void>`

---

### `editFeaturesGeometry(geoJson, layer)`

Patches the `geometry` property of each feature in the dataset via the layer's service.

- **Returns:** `Promise<Object>` — The updated GeoJSON with patched features.

---

### `editFeaturesProperties(geoJson, layer)`

Patches the `properties` of each feature in the dataset via the layer's service.

- **Returns:** `Promise<Object>`

---

### `editFeaturesStyle(geoJson, layer)`

Patches the `style` of each feature in the dataset via the layer's service.

- **Returns:** `Promise<Object>`

---

### `removeFeatures(geoJson, layer)`

Removes features from the layer's service. When `geoJson` is `null`, removes all features for the layer by querying `{ layer: layer._id }`.

- **Returns:** `Promise<void>`

---

### `fetchGeoJson(dataSource, options?)`

Fetches a GeoJSON dataset from a URL, with optional processor and transform.

- **Parameters:**
  - `dataSource` *(string)*: URL to fetch.
  - `options.processor` *(Function | string, optional)*: Feature processor.
  - `options.transform` *(Object, optional)*: Feature transform.
- **Returns:** `Promise<Object>` — Parsed GeoJSON data.

---

### `getFeatureStyleType(feature)`

Returns the KDK style type (`'point'`, `'line'`, `'polygon'`) for a GeoJSON feature based on its geometry type.

- **Returns:** `string | undefined`
