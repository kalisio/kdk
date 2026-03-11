# Query hooks

## Overview

Hooks for marshalling spatial and temporal query parameters into the MongoDB format expected by the features service, and for transforming service results into GeoJSON.

## Functions

### `marshallGeometryQuery(hook)`

Converts the `geometry` field in `hook.params.query` from its client/server-side representation into the MongoDB-compatible format via `marshallGeometry`. No-op when the query or geometry field is absent.

---

### `marshallGeoJsonQuery(hook)`

Detects the `geoJson: true` shortcut in `hook.params.query`, removes it from the query, and sets `hook.params.asGeoJson = true` to signal downstream hooks (such as `asGeoJson`) to convert results to GeoJSON.

---

### `marshallSpatialQuery(hook)`

Converts spatial shortcut parameters in `hook.params.query` into their MongoDB geospatial operator equivalents, then calls `marshallGeoJsonQuery`.

Supported shortcuts:

| Shortcut parameters | MongoDB translation |
|---------------------|---------------------|
| `geometry` | `marshallGeometry(query.geometry)` |
| `centerLon`/`longitude` + `centerLat`/`latitude` + `distance` | `geometry.$geoWithin.$centerSphere` (proximity query). Uses `$geoNear` instead when `$aggregate` is present. |
| `south` + `north` + `west` + `east` | `geometry.$geoIntersects` on a bounding-box polygon. Splits bounding boxes wider than 180° into two halves to work around MongoDB limitations. Supports arrays of bboxes via `$or`. |
| `longitude` + `latitude` (without `distance`) | `geometry.$geoIntersects` on a Point (location-contains query) |

---

### `asGeoJson(options?)`

> Returns a hook function. To be used as an `after` hook.

Converts the hook result (flat feature records with coordinate fields) into a [GeoJSON](https://tools.ietf.org/html/rfc7946) FeatureCollection or array of Features. Only runs when `hook.params.asGeoJson` is `true` or `options.force` is set. No-op if the result is already a FeatureCollection, or if `$distinct`/`$aggregation` queries are detected.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `force` | boolean | `false` | Run regardless of `hook.params.asGeoJson` |
| `longitudeProperty` | string | `'longitude'` | Field name for longitude |
| `latitudeProperty` | string | `'latitude'` | Field name for latitude |
| `altitudeProperty` | string | `'altitude'` | Field name for altitude |
| `geometryProperty` | string | `'geometry'` | Field name for an existing geometry object |
| `allowNullGeometries` | boolean | `false` | Include items without coordinate fields (geometry will be `null`) |
| `pick` | Array | — | Properties to keep on each item (Lodash pick) |
| `omit` | Array | — | Properties to remove from each item (Lodash omit) |
| `properties` | `true` \| Array | — | `true` moves all non-geometry fields into `feature.properties`. An array of `{ from, to?, delete? }` mappings moves specific fields. |
| `asFeatureCollection` | boolean | `true` | Wrap features in a `FeatureCollection` object |
| `dataPath` | string | `'result'` | Lodash path to read/write the result on the hook |

Pagination metadata (`total`, `skip`, `limit`) is preserved when the original result is paginated.

---

### `aggregateFeaturesQuery(hook)`

> To be used as a `before` hook.

Constructs and executes a MongoDB aggregation pipeline when `hook.params.query.$aggregate` is present, bypassing the normal service database call by setting `hook.result` directly.

This hook supports [time-based feature aggregation](../services.md#time-based-feature-aggregation): for each variable listed in `$aggregate`, it runs a separate pipeline stage that groups features by the ID specified in `$groupBy`, collecting time arrays and variable value arrays. Results from all elements are merged by feature ID.

Key query parameters consumed:

| Parameter | Description |
|-----------|-------------|
| `$aggregate` | Array of property names (or `'geometry'`) to aggregate across time |
| `$groupBy` | Field name or array of field names to group features by |
| `$group` | Additional MongoDB `$group` accumulator expressions (validated against a safe-operator allowlist) |
| `$geoNear` | Optional geospatial stage injected before the `$match` step |
| `$sort` | Sort overrides applied within the aggregation pipeline |
| `$limit: 1` | Shortcut to keep only the first/last time point without full aggregation |

::: warning
To prevent injection attacks, `$group` expressions are validated against an allowlist of safe MongoDB accumulator and expression operators. Operators such as `$accumulator`, `$function`, and `$where` are explicitly forbidden.
:::
