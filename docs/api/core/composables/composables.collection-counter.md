# Collection Counter

## Overview

`useCollectionCounter(options)` reactively tracks the total number of items in a FeathersJS service collection. It uses `$limit: 0` to fetch only the total count without loading actual data, and refreshes automatically when `created` or `removed` events are received.

All option values that may change reactively should be passed as `ref`s — `watchEffect` will re-run the count whenever they change.

## Usage

```javascript
import { ref } from 'vue'
import { useCollectionCounter } from '@kalisio/kdk/core.client'

const { counter } = useCollectionCounter({
  service: ref('missions'),
  contextId: ref(props.eventId)
})
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `service` | `Ref<string>` | — | Name of the FeathersJS service to count. |
| `contextId` | `Ref<string>` | — | Optional context ID for contextual services. |
| `baseQuery` | `Ref<Object>` | — | Base query merged into the count request. |
| `filterQuery` | `Ref<Object>` | — | Filter query merged after `baseQuery`. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `counter` | `Ref<number>` | The current total item count. Initialised to `0`. |

## Lifecycle

- **`beforeMount`**: registers `created` and `removed` service event handlers to trigger a recount.
- **`beforeUnmount`**: removes the event handlers.
