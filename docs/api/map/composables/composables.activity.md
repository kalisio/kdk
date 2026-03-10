# Activity

## Overview

This module exports two composables that extend the core [activity composable](../../core/composables/composables.activity.md) with map-specific capabilities.

- **`useActivity(name, options)`** — sets up the activity store and automatically creates selection, probe, and highlight sub-stores.
- **`useCurrentActivity(options)`** — retrieves the current map activity context from anywhere in the component tree.

## Usage

```javascript
// In the activity component itself
import { useActivity } from '@kalisio/kdk/map.client'
const { selectItem, hasSelectedFeature, probeAtLocation } = useActivity('myMap', {
  selection: true,
  probe: true,
  highlight: true
})

// In a child component
import { useCurrentActivity } from '@kalisio/kdk/map.client'
const { kActivity, hasSelectedFeature, getActivityProject } = useCurrentActivity()
```

## `useActivity(name, options)`

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Unique activity name within the application. |
| `options.selection` | `boolean` | `true` | When `true`, also creates a [selection store](./composables.selection.md) for this activity. |
| `options.probe` | `boolean` | `true` | When `true`, also creates a [probe store](./composables.probe.md) for this activity. |
| `options.highlight` | `boolean` | `true` | When `true`, also creates a [highlight store](./composables.highlight.md) for this activity. |

### Exposed

All values from the core [`useActivity`](../../core/composables/composables.activity.md) are exposed, plus:

| Name | Type | Description |
|------|------|-------------|
| `setCurrentActivity(activity)` | `Function` | Extended version that also propagates the activity to the selection, probe, and highlight composables. |
| *(selection)* | — | All values from [`useSelection(name)`](./composables.selection.md) when `options.selection` is `true`. |
| *(probe)* | — | All values from [`useProbe(name)`](./composables.probe.md) when `options.probe` is `true`. |
| *(highlight)* | — | All values from [`useHighlight(name)`](./composables.highlight.md) when `options.highlight` is `true`. |

---

## `useCurrentActivity(options)`

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.selection` | `boolean` | `true` | When `true`, also retrieves the selection store from the current activity. |
| `options.probe` | `boolean` | `true` | When `true`, also retrieves the probe store from the current activity. |

### Exposed

All values from the core [`useCurrentActivity`](../../core/composables/composables.activity.md) are exposed, plus:

| Name | Type | Description |
|------|------|-------------|
| `setActivityProject(project)` | `Function` | Sets the project associated with the current activity (stored in a module-level `shallowRef`). |
| `getActivityProject()` | `Function` | Returns the project currently associated with the activity. |
| *(all from useActivity)* | — | When an activity is active, all values exposed by its `useActivity` call (selection, probe, highlight) are merged in. |
