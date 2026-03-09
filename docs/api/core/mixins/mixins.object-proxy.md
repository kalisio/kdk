# Object Proxy

## Overview

The `objectProxy` mixin provides a component with a reactive `objectId` prop and methods to load and access a single object from a FeathersJS service. It deduplicates in-flight requests by caching the pending promise and only re-fetches when the `objectId` changes.

## Usage

```javascript
import { service, objectProxy } from '@kalisio/kdk/core/client'

export default {
  mixins: [service, objectProxy],
  // ...
}
```

::: danger
The [Service](./mixins.service.md) mixin is required when using this mixin — `loadObject()` calls `this.getService()` internally.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `objectId` | `String` | `''` | The `_id` of the object to load from the service. |

## Data

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `object` | `Object \| null` | `null` | The currently loaded service object. Set to `null` when no `objectId` is provided or before the first load. |

## Methods

### `getObject()`

Returns the currently loaded object.

- **Returns:** `Object | null` — the loaded object, or `null` if none has been loaded yet.

### `getObjectId()`

Returns the `_id` of the currently loaded object.

- **Returns:** `string` — `object._id`, or an empty string if no object is loaded.

### `loadObject()`

Fetches the object identified by `objectId` from the service. The promise is cached and reused as long as `objectId` does not change, avoiding redundant network calls.

- **Returns:** `Promise<Object | null>` — resolves to the loaded object, or `null` if `objectId` is empty.

```javascript
await this.loadObject()
console.log(this.getObject()) // the fetched document
```

::: tip
If `objectId` is empty, `loadObject()` immediately resolves with `null` and sets `object` to `null`.
:::
