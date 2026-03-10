# Selection

## Overview

`useSelection(name, options)` extends the core [useSelection](../../core/composables/composables.selection.md) composable with map-specific selection behaviour. Items in the selection store represent `{ location, feature, layer }` triplets. The composable registers click, box-selection, and cluster-selection handlers on the current map activity and keeps the selection in sync with real-time service events on visible layers.

## Usage

```javascript
import { useSelection } from '@kalisio/kdk/map.client'

const {
  selection, selectItem, clearSelection,
  hasSelectedFeature, getSelectedFeature, getSelectedLayer,
  hasSelectedLocation, getSelectedLocation,
  centerOnSelection, getWidgetForSelection
} = useSelection('myMap', { boxSelection: true })
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Unique selection store name within the application. |
| `options.multiple` | `string` | `'ctrlKey'` | Name of the keyboard modifier property that activates multi-selection (e.g. `'ctrlKey'`, `'shiftKey'`). |
| `options.buffer` | `number` | `10` | Selection buffer radius in pixels used in buffer selection mode. |
| `options.showBuffer` | `boolean` | `false` | When `true`, briefly renders the buffer circle on the map after a buffer-mode click. |
| `options.showBufferDelay` | `number` | `250` | Duration in milliseconds to show the buffer circle. |
| `options.boxSelection` | `boolean` | `true` | When `true`, enables rectangular box-selection on the map. |
| `options.clusterSelection` | `boolean` | `false` | When `true`, selects all features of a cluster when a cluster marker is clicked (spiderfied). |
| `options.handler` | `Function` | — | Custom selection handler `(items, clearSelection)`. When provided, replaces the built-in handler. |

## Exposed

All values from the core [`useSelection`](../../core/composables/composables.selection.md) are exposed, plus:

| Name | Type | Description |
|------|------|-------------|
| `getSelectionOptions()` | `Function` | Returns the resolved options object stored in the selection store. |
| `setCurrentActivity(activity)` | `Function` | Binds the composable to a new map activity instance. Removes listeners from the previous activity. |
| `hasSelectedFeature()` | `Function` | Returns `true` if the last selected item has a `feature` property. |
| `getSelectedFeature()` | `Function` | Returns the feature of the last selected item. |
| `getSelectedFeatures()` | `Function` | Returns all selected features (items that have a `feature`). |
| `getSelectedFeatureCollection()` | `Function` | Returns selected features as a GeoJSON `FeatureCollection`. |
| `getSelectedFeaturesByLayer()` | `Function` | Returns selected features grouped by layer as `[{ layer, features }]`. |
| `hasSelectedLayer()` | `Function` | Returns `true` if the last selected item has a `layer` property. |
| `getSelectedLayer()` | `Function` | Returns the layer of the last selected item. |
| `getSelectedLayers()` | `Function` | Returns all layers associated with selected items. |
| `hasSelectedLocation()` | `Function` | Returns `true` if the last selected item has a `location` property. |
| `getSelectedLocation()` | `Function` | Returns the location of the last selected item. |
| `getWidgetForSelection()` | `Function` | Returns the widget type string to display for the current selection (e.g. `'time-series'`, `'information-box'`, `'mapillary-viewer'`). |
| `centerOnSelection()` | `Function` | Centers the map view on the currently selected feature or location. |
| `setBoxSelectionEnabled(enabled)` | `Function` | Dynamically enables or disables box selection. |
| `setClusterSelectionEnabled(enabled)` | `Function` | Dynamically enables or disables cluster selection. |
| `setBufferWidth(width)` | `Function` | Sets the buffer selection radius in pixels. |

## Lifecycle

- Registers `click`, `boxselectionend`, and `spiderfied` engine event handlers on the active map activity.
- Listens to `layer-added` / `layer-removed` events to track real-time service events on feature layers.
- Automatically unselects features that belong to a hidden layer (`layer-hidden` event).
- When the activity changes via `setCurrentActivity`, all listeners are migrated to the new activity.
