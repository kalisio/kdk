# Collection Time Range

## Overview

`useCollectionTimeRange(options)` reactively tracks the minimum and maximum values of a time property across a FeathersJS service collection. It issues two lightweight queries (sorted ascending and descending with `$limit: 1`) to find the boundary values, and refreshes automatically on any service event.

## Usage

```javascript
import { ref } from 'vue'
import { useCollectionTimeRange } from '@kalisio/kdk/core.client'

const { timeRange } = useCollectionTimeRange({
  service: ref('events'),
  property: ref('updatedAt')
})
// timeRange.value => { start: '2024-01-01T00:00:00Z', end: '2024-12-31T23:59:59Z' }
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `service` | `Ref<string>` | — | Name of the FeathersJS service to query. |
| `contextId` | `Ref<string>` | — | Optional context ID for contextual services. |
| `baseQuery` | `Ref<Object>` | — | Base query merged into every request. |
| `filterQuery` | `Ref<Object>` | — | Filter query merged after `baseQuery`. |
| `property` | `Ref<string>` | `ref('createdAt')` | The document field to use for finding min/max values. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `timeRange` | `Ref<{ start, end } \| null>` | The current time range. `start` is the earliest value of `property` and `end` is the latest. `null` before the first refresh. Both are the raw field values from the service documents. |

## Lifecycle

- **`beforeMount`**: registers an `all`-events listener (created, updated, patched, removed) that triggers a refresh.
- **`beforeUnmount`**: removes the event listener.
