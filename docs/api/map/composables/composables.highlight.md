# Highlight

## Overview

`useHighlight(name, options)` manages a reactive store of map highlights — styled GeoJSON features rendered on top of the map to indicate selection or focus. It maintains a dedicated system GeoJSON layer (`HighlightsLayerName`) and keeps highlights in sync with real-time service events on feature layers.

Highlights are debounced (configurable via `options.updateDelay`) and rendered sorted by `zOrder` from the properties.

## Usage

```javascript
import { useHighlight } from '@kalisio/kdk/map.client'

const {
  highlights, highlight, unhighlight,
  hasHighlight, getHighlight, clearHighlights
} = useHighlight('myMap', { updateDelay: 100, asBbox: false })
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Unique highlight store name within the application. Used as the key in the `highlights` namespace of the global store. |
| `options.updateDelay` | `number` | `250` | Debounce delay in milliseconds for updating the highlights layer. |
| `options.asBbox` | `boolean` | `false` | When `true`, lines and polygons are highlighted using their bounding box polygon instead of the original geometry. |
| *(map style properties)* | — | — | Any additional style properties are merged into each highlight feature as default style overrides. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `highlights` | `reactive Object` | The raw highlight store for this `name`. Keys are highlight IDs, values are highlight feature objects. |
| `setCurrentActivity(activity)` | `Function` | Binds the composable to a new map activity instance. Removes the highlights layer from the previous activity and registers it on the new one. |
| `setHighlightMode(mode)` | `Function` | Sets the highlight filtering mode. `'highlightable-layers'` (default) only highlights features from layers where `isHighlightable` is `true`. Any other string disables this filter. |
| `hasHighlight(feature, layer)` | `Function` | Returns `true` if a highlight exists for the given feature and layer. |
| `getHighlight(feature, layer)` | `Function` | Returns the highlight object for the given feature and layer, or `undefined`. |
| `getHighlights(layer?, feature?)` | `Function` | Returns all current highlights. Optionally filtered by layer and/or feature. Aggregates across all highlight stores (all `name`s). |
| `highlight(feature, layer, selected?)` | `Function` | Adds or updates a highlight for the given feature. When `selected` is `true` (default), applies the engine selection style; otherwise uses the feature's own style. Returns the highlight object. |
| `unhighlight(feature, layer)` | `Function` | Removes the highlight for the given feature and layer. |
| `setHighlightEnabled(feature, layer, enabled?)` | `Function` | Shows or hides a single highlight by setting its `style.visibility`. |
| `setHighlightsEnabled(layer, enabled?)` | `Function` | Shows or hides all highlights associated with a given layer. |
| `clearHighlights()` | `Function` | Removes all highlights from the store and updates the layer. |

## Constants

| Name | Description |
|------|-------------|
| `HighlightsLayerName` | Unique name of the system GeoJSON layer used to render highlights. Generated with `uid()`. |
| `HighlightsZIndex` | Z-index (`999`) of the highlights layer, ensuring it renders on top of all other layers. |
| `HighlightMargin` | Extra pixels (`8`) added to a highlight marker's radius/size to visually encompass the target feature. |

## Lifecycle

- **`beforeMount`**: Starts listening to feature service events on all existing layers.
- **`beforeUnmount`**: Stops listening to feature service events and clears all highlights.
- Registers `layer-added` / `layer-removed` handlers to track real-time events per layer.
- Registers `layer-disabled` / `layer-enabled` handlers to toggle highlight visibility.
- The highlights layer is created automatically when the first catalog layer is added to the activity, and removed when the activity changes.
