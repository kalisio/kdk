# Activity

## Overview

This module exports two composables:

- **`useActivity(name, options)`** — sets up the state and configuration stores for a named activity and registers it as the current activity.
- **`useCurrentActivity(options)`** — retrieves the current activity context from anywhere in the component tree without needing to know the activity name.

> Causes the current activity to be automatically reset on unmount.

## Usage

```javascript
// In the activity component itself
import { useActivity } from '@kalisio/kdk/core.client'
const { CurrentActivityContext, setCurrentActivity, selectItem } = useActivity('myMap', { selection: true })

// In a child component
import { useCurrentActivity } from '@kalisio/kdk/core.client'
const { kActivity, kActivityName, CurrentActivityContext } = useCurrentActivity()
```

## `useActivity(name, options)`

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Unique activity name. Used as the store namespace and to look up configuration in `config[name]`. |
| `options.selection` | `boolean` | `true` | When `true`, also initialises a selection store for this activity (via `useSelection`). |
| `options.state` | `Object` | — | Initial state content for the activity state store. |

### Exposed

| Name | Type | Description |
|------|------|-------------|
| `CurrentActivityContext` | `shallowReactive Object` | Shared context object: `{ activity, name, state, config }`. Mutated in place when the activity changes. |
| `setCurrentActivity(activity)` | `Function` | Sets the given component instance as the current activity. Pass `null` to clear. |
| *(selection)* | — | All values from [`useSelection(name)`](./composables.selection.md) are merged in when `options.selection` is `true`. |

### Lifecycle

- **`beforeUnmount`**: clears `CurrentActivityContext` properties and calls `setCurrentActivity(null)`.

---

## `useCurrentActivity(options)`

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.selection` | `boolean` | `true` | When `true`, also retrieves the selection store from the current activity. |

### Exposed

| Name | Type | Description |
|------|------|-------------|
| `CurrentActivityContext` | `shallowReactive Object` | The shared context object (same reference as in `useActivity`). |
| `CurrentActivity` | `shallowRef<Object \| null>` | The raw current activity component instance. |
| `kActivity` | `readonly shallowRef` | Read-only alias for `CurrentActivity`. |
| `kActivityName` | `readonly Ref<string \| null>` | Read-only alias for `CurrentActivityContext.name`. |
| *(all from useActivity)* | — | When an activity is active, all values exposed by its `useActivity` call are merged in. |
