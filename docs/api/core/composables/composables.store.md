# Store

## Overview

`useStore(name, initialStore)` creates or retrieves a named reactive store backed by Vue's `reactive()`. All stores share a single global `Store` registry, so calling `useStore` with the same name from multiple components returns the same reactive object.

## Usage

```javascript
import { useStore } from '@kalisio/kdk/core.client'

const { store, set, get, clear } = useStore('myFeature', { count: 0 })
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Unique store name within the application. Used as the key in the global registry. |
| `initialStore` | `Object` | `{}` | Initial content of the store. Only used on first call for this name; subsequent calls return the existing store. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `Store` | `Object` | The global store registry (all named stores). |
| `store` | `reactive Object` | The named store instance. |
| `clear()` | `Function` | Removes all properties from the store. |
| `set(path, value)` | `Function` | Sets a value at the given Lodash path. |
| `get(path, defaultValue?)` | `Function` | Gets a value at the given Lodash path. If `path` is falsy, returns the entire store object. |
| `unset(path)` | `Function` | Removes a property at the given Lodash path. |
| `has(path)` | `Function` | Returns `true` if the given Lodash path exists in the store. |
| `forOwn(f)` | `Function` | Iterates over all `(value, key)` pairs in the store and calls `f(value, key)` for each. |

::: tip
Because the store is `reactive`, any component that reads store properties inside a computed or template will automatically update when those properties change.
:::
