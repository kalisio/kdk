# Utilities

Here are a set of utility functions:
* **generatePropertiesSchema (geoJson, name)** generate a JSON schema from the given GeoJson features
* **fetchGeoJson (dataSource, processor)** fetch GeoJson features from the given source and apply processor function (if any) on each feature
* **getNearestTime (time, times)** find the nearest time of a given one in a given moment time list
* **getTimeInterval (times, mode = 'minimum')** find the minimum or maximum time interval in a given moment time list

### Store objects

The `locationFormat` property of the [global store](../core/application.md#store) is used to have a shared location display format accross all mapping components with a dedicated UI to change settings using e.g. `store.patch('locationFormat', 'FFf')`.

::: tip
The location format object to be used for display supports [formatcoords](https://github.com/nerik/formatcoords).
:::

The `timeFormat` property of the [global store](../core/application.md#store) is used to have a shared time display format accross all mapping components with a dedicated UI to change settings using e.g.
```js
store.patch('timeFormat', {
  time: {
    short: 'H[h]',
    long: 'HH:mm'
  },
  date: {
    short: 'DD/MM',
    long: 'dddd D'
  },
  year: {
    short: 'YY',
    long: 'YYYY'
  },
  utc: false,
  locale: utils.getLocale()
})
```

::: tip
The time format object properties to be used for display supports [momentjs formats](https://momentjs.com/docs/#/displaying/format/).
:::

In addition, the [global store](../core/application.md#store) contains the following defaults objects:
```js
selection: {
  location: current picked position on map,
  feature: currently selected feature on map,
  layer: source layer of currently selected feature
}
// Default view settings
restore: {
  view: true,
  layers: false
}
// Default timeline parameters
timeline: {
  step: 60 // 1H
}
// Default timeseries parameters
timeseries: {
  span: 1440 // 24H
}
```

### Geolocation

Your component can automatically retrieve the user's location on initialization or when he has logged in (the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) is used under-the-hood). The position, respectively error, is available in the `position`, respectively `error`, property of the `geolocation` object in the [global store](../core/application.md#store).

```js
import { Geolocation } from '@kalisio/kdk/map.client'
// Launch a geolocation
await Geolocation.update()
const position = this.$store.get('geolocation.position')
```

## Capture

### [utils.capture](./utilities/utils.capture.md)

Generates map screenshots or PDF exports via the KDK capture service. Supports single or multi-time captures and assembles results into image files or a multi-page PDF.

## Catalog

### [utils.catalog](./utilities/utils.catalog.md)

Low-level functions for interacting with the KDK catalog service: fetching layers, categories, sublegends, and views; organizing them by category; and managing JWT authentication tokens in layer URLs.

## Features

### [utils.features](./utilities/utils.features.md)

Comprehensive helpers for querying, transforming, validating, and persisting GeoJSON features. Includes service event listeners, time-varying feature queries, geometry validation, and CRUD operations.

## Layers

### [utils.layers](./utilities/utils.layers.md)

Layer classification, caching, editing, saving, and filter management. Provides `isUserLayer`, `isFeatureLayer`, `isLayerSelectable`, cache functions (`setLayerCached`, `setLayerUncached`), style editing, legend generation, and GeoJSON layer import helpers.

## Location

### [utils.location](./utilities/utils.location.md)

Coordinate parsing and formatting utilities: `parseCoordinates`, `formatUserCoordinates` (including aeronautical format), `formatForwardGeocodingResult`, and `filterGeocoders`.

## Map

### [utils](./utilities/utils.md)

Core map utilities: `getNearestTime`, `getTimeInterval`, `getFeatureId`, `getFeatureLabel`, `coordinatesToGeoJSON`, and `getGeoJsonFeatures`.

## Offline

### [utils.offline](./utilities/utils.offline.md)

Functions for caching map views for offline use: `cacheView`, `uncacheView`, `addViewToCache`, `removeViewFromCache`, `cacheLayersForView`, and offline service management helpers.

## Project

### [utils.project](./utilities/utils.project.md)

Builds MongoDB query objects scoped to a project: `getCatalogProjectQuery` and `getViewsProjectQuery`.

## Schema

### [utils.schema](./utilities/utils.schema.md)

Generates JSON Schema draft-07 descriptors from GeoJSON feature properties via `generatePropertiesSchema`.

## Style

### [utils.style](./utilities/utils.style.md)

Style conversion between KDK internal format, Simple Style Spec, and engine-specific styles. Provides style template generation (`generateStyleTemplates`) and parsing (`filterQueryToConditions`) for conditional feature styling.

## Time Series

### [utils.time-series](./utilities/utils.time-series.md)

Builds Chart.js-compatible time-series datasets from weather forecast or measurement data: `getForecastTimeSeries`, `getMeasureTimeSeries`, `updateTimeSeries`, and `getChartOptions`.

## Weacast

### [utils.weacast](./utilities/utils.weacast.md)

Queries weather forecast data from the Weacast API: `getForecastForLocation`, `getForecastProbe`, and `getForecastForFeature`.
