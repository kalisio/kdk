# Composables

## Activity

### [useActivity / useCurrentActivity](./composables/composables.activity.md)

- **`useActivity(name, options)`** — extends the core activity composable with map-specific sub-stores (selection, probe, highlight).
- **`useCurrentActivity(options)`** — retrieves the current map activity context, including project and all map-specific state.

## Selection

### [useSelection](./composables/composables.selection.md)

Extends the core [selection composable](../core/composables/composables.selection.md) with map-specific behaviour: click, box, and cluster selection handlers; real-time feature tracking via service events; and helper functions for accessing selected features, layers, and locations.

## Probe

### [useProbe](./composables/composables.probe.md)

Sets up a reactive store for probing at a specific map location or feature. Registers a click handler to capture probe targets and exposes helpers to inspect, navigate to, and clear the probed location.

## Highlight

### [useHighlight](./composables/composables.highlight.md)

Manages a reactive store of map highlights — styled GeoJSON features rendered in a dedicated system layer on top of the map. Keeps highlights in sync with real-time service events and layer visibility changes.

## Project

### [useProject](./composables/composables.project.md)

Manages a map project loaded from the `projects` service. Can track the project ID from the route query parameter or load it manually, and keeps the local project in sync with real-time updates.

## Catalog

### [useCatalog](./composables/composables.catalog.md)

Provides reactive access to catalog data (layers, categories, sublegends, views). Exposes async fetch functions and computed properties organizing layers by category and identifying orphan layers.

## Location

### [useLocation](./composables/composables.location.md)

Provides reactive geocoder configuration and location search capabilities. Integrates with the KDK `Geocoder` and `Geolocation` services with optional filtering based on the current activity project.

## Measure

### [useMeasure](./composables/composables.measure.md)

Provides helper functions to extract measurement values at the current application time from time-series data attached to probed features, using nearest-time interpolation.

## Weather

### [useWeather](./composables/composables.weather.md)

Provides helpers for working with Weacast weather forecast data: resolving forecast field paths, formatting forecast HTML, and creating Leaflet wind barb markers and tooltips.
