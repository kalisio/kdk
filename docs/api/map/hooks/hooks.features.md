# Features hooks

## Overview

Hooks for the features service: controlling result size on bulk operations, suppressing or simplifying real-time events for multi-feature mutations, and enabling fuzzy text search on feature label properties.

## Functions

### `simplifyResult(hook)`

> To be used as an `after` hook.

Replaces the full result array with an array of `{ _id }` objects on bulk `create`, `update`, `patch`, and `remove` operations when the result exceeds a size threshold. This avoids sending large payloads to clients that only need the IDs.

Controlled by service options:

| Service option | Default | Description |
|----------------|---------|-------------|
| `simplifyResult` | `['create', 'update', 'patch', 'remove']` | Methods for which simplification applies |
| `simplifyResultLimit` | `1` | Minimum result array length before simplification kicks in |

Override per-request by setting `hook.params.fullResult = true` to force the full result to be returned regardless of service options.

---

### `skipEvents(hook)`

> To be used as an `after` hook.

Suppresses standard Feathers real-time events (`created`, `updated`, `patched`, `removed`) for bulk operations that exceed a size threshold, preventing the server from broadcasting large payloads to all clients.

Controlled by service options:

| Service option | Default | Description |
|----------------|---------|-------------|
| `skipEvents` | `['created', 'updated', 'patched', 'removed']` | Events to suppress on bulk operations |
| `simplifyEvents` | `[]` | Events for which a simplified summary event is emitted instead (suppresses the raw event too) |
| `skipEventsLimit` | `1` | Minimum result array length before suppression kicks in |

Override per-request by setting `hook.params.emitEvents = true` to force normal event emission.

---

### `simplifyEvents(hook)`

> To be used as an `after` hook.

Emits a lightweight summary event in place of the full per-item events for bulk operations listed in `service.options.simplifyEvents`. The summary payload includes:

| Field | Description |
|-------|-------------|
| `query` | The query selector used for the bulk operation |
| `total` | Number of affected features |
| `bbox` | Bounding box `[west, south, east, north]` of all affected features |
| `layers` | Unique list of layer identifiers referenced by the affected features |
| `startTime` / `endTime` | UTC time range spanned by the affected features |
| `data` | Original patch/update data (not included for `created` events) |

Controlled by service options:

| Service option | Default | Description |
|----------------|---------|-------------|
| `simplifyEvents` | `[]` | Events to replace with a summary payload |
| `simplifyEventsLimit` | `1` | Minimum result array length before simplification kicks in |

Override per-request by setting `hook.params.emitEvents = true` to force normal event emission.

---

### `fuzzySearch(hook)`

> To be used as a `before find` hook.

Enables fuzzy text search on feature label properties. Reads the `featureLabel` option from the service configuration, prefixes each label field with `'properties.'`, and delegates to `feathers-mongodb-fuzzy-search`. No-op when no `featureLabel` is configured on the service.
