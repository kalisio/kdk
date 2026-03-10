# Collection

## Overview

`useCollection(options)` manages a reactive, paginated collection backed by a FeathersJS service. It uses `feathers-reactive` to subscribe to real-time updates and supports both replace-on-page and append-on-scroll pagination strategies.

All option values that may change reactively should be passed as `ref`s so that the collection automatically resets when they change.

## Usage

```javascript
import { ref } from 'vue'
import { useCollection } from '@kalisio/kdk/core.client'

const { items, nbTotalItems, nbPages, currentPage, resetCollection } = useCollection({
  service: ref('users'),
  nbItemsPerPage: ref(20),
  baseQuery: ref({ role: 'admin' })
})
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `service` | `Ref<string>` | — | Name of the FeathersJS service. |
| `contextId` | `Ref<string>` | — | Optional context ID for contextual services. |
| `baseQuery` | `Ref<Object>` | `ref({})` | Base query merged into every find request. |
| `filterQuery` | `Ref<Object>` | `ref({})` | Filter query merged after `baseQuery`. |
| `nbItemsPerPage` | `Ref<number>` | `ref(12)` | Number of items per page. Set to `0` to disable pagination. |
| `appendItems` | `Ref<boolean>` | `ref(false)` | When `true`, new page items are appended rather than replacing existing ones. |
| `refreshThrottle` | `Ref<number>` | `ref(500)` | Minimum milliseconds between consecutive refresh calls. |
| `listStrategy` | `Ref<string>` | `ref('smart')` | feathers-reactive list strategy. |
| `processor` | `Ref<Function>` | `ref()` | Optional function `(items) => items` applied to every batch of items before storing. |
| `getService` | `Ref<Function>` | — | Optional factory function override for retrieving the service instance. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `items` | `Ref<Array \| null>` | The current page (or accumulated) items. `null` before first load. |
| `nbTotalItems` | `Ref<number>` | Total number of items in the collection (from service response). |
| `currentPage` | `Ref<number>` | Current page number (1-based). |
| `nbPages` | `ComputedRef<number>` | Total number of pages based on `nbTotalItems` and `nbItemsPerPage`. |
| `setCollectionItems(items)` | `Function` | Sets the items array, applying the `processor` if defined. |
| `subscribe(query)` | `Function` | Subscribes to the service with the given query via feathers-reactive. |
| `unsubscribe()` | `Function` | Cancels the current feathers-reactive subscription. |
| `getCollectionBaseQuery()` | `Function` | Returns the current base query. Override to customise. |
| `getCollectionFilterQuery()` | `Function` | Returns the current filter query. Override to customise. |
| `getCollectionPaginationQuery()` | `Function` | Returns `{ $limit, $skip }` for the current page. Returns `{}` when pagination is disabled. |
| `resetCollection()` | `Function` | Resets pagination to page 1 and re-subscribes. No-op if items are `null` (initialising). |
| `refreshCollection()` | `Function` | Throttled version of the subscribe call with the full query. |

## Lifecycle

- **`beforeMount`**: in `appendItems` mode, registers `patched`, `updated`, and `removed` event handlers to keep in-memory items up to date.
- **`beforeUnmount`**: unsubscribes from feathers-reactive and removes event handlers.
