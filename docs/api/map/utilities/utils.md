# Map Utilities

## Overview

This module provides core map utility functions for time-series manipulation, feature identification, and GeoJSON data handling.

## Functions

### `getNearestTime(time, times, sorted?)`

Finds the nearest time in a list of Moment.js time values to a given reference time.

- **Parameters:**
  - `time` *(Moment)*: The reference time.
  - `times` *(Array\<Moment\>)*: Array of Moment.js time objects to search through.
  - `sorted` *(boolean, default `false`)*: When `true`, assumes `times` is sorted in ascending order and uses a faster binary-style search.
- **Returns:** `{ index: number, difference: number }` — The index of the nearest time and the absolute difference in milliseconds. `index` is `-1` if `times` is empty.

---

### `getTimeInterval(times, mode?)`

Computes the minimum or maximum interval between consecutive times in a list.

- **Parameters:**
  - `times` *(Array\<Moment\>)*: Array of Moment.js time objects.
  - `mode` *('minimum' | 'maximum', default `'minimum'`)*: Whether to return the smallest or largest interval.
- **Returns:** `number` — The interval in milliseconds.

---

### `getFeatureId(feature, layer)`

Extracts the unique identifier of a GeoJSON feature based on the layer's `featureId` configuration. Supports compound (multi-field) identifiers.

- **Parameters:**
  - `feature` *(Object)*: A GeoJSON feature.
  - `layer` *(Object)*: The layer definition containing `featureId` (string or array of strings). Defaults to `'_id'` when not set.
- **Returns:** `string` — The feature identifier, built by joining field values with `-`.

---

### `getFeatureLabel(feature, layer)`

Extracts a human-readable label for a feature based on the layer's `featureLabel` configuration. Supports compound (multi-field) labels.

- **Parameters:**
  - `feature` *(Object)*: A GeoJSON feature.
  - `layer` *(Object)*: The layer definition containing `featureLabel` (string or array of strings). Defaults to `'name'`.
- **Returns:** `string` — The label, built by joining field values with ` - `.

---

### `coordinatesToGeoJSON(lat, lon, format, options)`

Creates a GeoJSON Point feature from coordinates, with a formatted coordinate string as the `name` property.

- **Parameters:**
  - `lat` *(number)*: Latitude.
  - `lon` *(number)*: Longitude.
  - `format` *(string)*: A [formatcoords](https://github.com/nerik/formatcoords) format string.
  - `options` *(Object)*: Additional options passed to `formatcoords`.
- **Returns:** `Object` — A GeoJSON Feature with `Point` geometry and a `name` property.

---

### `getGeoJsonFeatures(geoJson)`

Normalises various GeoJSON input formats into a flat array of features.

- **Parameters:**
  - `geoJson` *(Object | Array)*: A GeoJSON Feature, FeatureCollection, or array of features.
- **Returns:** `Array` — An array of GeoJSON Feature objects.
