# Hooks

## Query

### [hooks.query](./hooks/hooks.query.md)

Spatial and temporal query marshalling for the features service. Includes `marshallGeometryQuery`, `marshallGeoJsonQuery`, `marshallSpatialQuery` (with bbox, proximity, and location shortcuts), `asGeoJson` (result-to-GeoJSON conversion), and `aggregateFeaturesQuery` (time-based feature aggregation pipeline).

## Catalog

### [hooks.catalog](./hooks/hooks.catalog.md)

Catalog service hooks: `filterLayers` (restrict `find` to layer objects), `getDefaultCategories` and `getDefaultSublegends` (inject config-defined defaults), `updateLayerReferences` (propagate renames/removals to contexts and categories), `updateProjects` (remove deleted layers/views from projects), and `convertFilterQueriesToString`/`convertFilterQueriesToObject` (JSON serialization of layer filter queries).

## Features

### [hooks.features](./hooks/hooks.features.md)

Features service hooks: `simplifyResult` (replace bulk results with ID-only arrays), `skipEvents` (suppress real-time events on large bulk operations), `simplifyEvents` (emit lightweight summary events with bbox, time range, and layer info), and `fuzzySearch` (fuzzy text search on feature label properties).
