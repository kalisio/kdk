# Probe

## Overview

`useProbe(name, options)` sets up a reactive store for probing at a specific map location or feature. It registers a click handler on the current map activity to capture probe targets, and exposes helpers to inspect and navigate to the probed location.

## Usage

```javascript
import { useProbe } from '@kalisio/kdk/map.client'

const {
  probe, clearProbe, hasProbedLocation, getProbedLocation,
  probeAtLocation, centerOnProbe, getWidgetForProbe
} = useProbe('myMap')
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Unique probe store name within the application. Used as the key in the `probes` namespace of the global store. |
| `options.handler` | `Function` | — | Custom probe handler `({ location, feature, layer })`. When provided, replaces the built-in handler. |
| `options.timeout` | `number` | `500` | Milliseconds to wait after a probe click before removing the `probe-cursor` from the activity. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `probe` | `reactive Object` | The raw probe store. Contains `item` with `{ location, feature, layer }` after a probe, or `null` when cleared. |
| `setCurrentActivity(activity)` | `Function` | Binds the composable to a new map activity instance. Migrates the click listener. |
| `clearProbe()` | `Function` | Resets the probe store item to `null`. |
| `setProbe(probe)` | `Function` | Manually sets the probe item. |
| `isProbing()` | `Function` | Returns `true` when the `probe-cursor` is active on the current activity. |
| `hasProbedLayer()` | `Function` | Returns `true` if the current probe item has a `layer` property. |
| `getProbedLayer()` | `Function` | Returns the layer of the current probe item. |
| `hasProbedLocation()` | `Function` | Returns `true` if the current probe item has a `location` property. |
| `getProbedLocation()` | `Function` | Returns the location `{ lng, lat }` of the current probe item. |
| `probeAtLocation()` | `Function` | Activates the `probe-cursor` on the activity. The next map click will capture a probe target and then deactivate the cursor. |
| `getWidgetForProbe()` | `Function` | Returns the widget type for the probed location (currently always `'time-series'` when a location is set). |
| `centerOnProbe()` | `Function` | Centers the map view on the probed location. |

## Lifecycle

- Registers a `click` engine event handler on the active map activity.
- While probing, clicking a probable layer captures both the feature and the location. Clicking elsewhere captures only the location.
- Clicking anywhere when not probing and the probe store has a value will clear the probe (unless a feature is under the cursor).
