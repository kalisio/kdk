# Query hooks

## Overview

Hooks for transforming and marshalling query parameters before they reach the database adapter, and for populating related objects from other services into `hook.params`.

## Functions

### `marshallComparisonQuery(hook)`

Converts comparison field values in `hook.params.query` from client/server-side types (e.g. numbers as strings) to the correct JS types expected by the database adapter. Applies recursively to handle nested objects. Handles `$lt`, `$lte`, `$gt`, and `$gte` operators.

---

### `marshallTimeQuery(hook)`

Converts the `time` field in `hook.params.query` from string or moment date representations to the format expected by the database adapter.

---

### `marshallSortQuery(hook)`

Converts `$sort` field values in `hook.params.query` from strings to numbers as required by the database adapter.

---

### `marshallCollationQuery(hook)`

Extracts MongoDB collation options from `hook.params.query`. Supports two shortcuts:
- `$locale` — sets `hook.params.collation = { locale }` and removes the field from the query.
- `$collation` — sets `hook.params.collation` directly and removes the field from the query.

---

### `marshallHttpQuery(hook)`

Converts query field values for REST (`provider === 'rest'`) requests from strings to their correct JS types (numbers, booleans, dates). Only applied when the request comes from a REST client.

---

### `aggregationQuery(hook)`

> To be used as a `before` hook.

Executes a raw MongoDB aggregation pipeline when `hook.params.query.$aggregation` is present and sets `hook.result` to bypass the normal service call. For security, aggregation is only allowed from internal (non-external-provider) calls.

---

### `populateObject(options)`

> Returns a hook function. To be used as a `before` hook.

Retrieves a single object from a target service and stores it in `hook.params`. Skips population if the value is already present.

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `serviceField` | string | Path on `hook.data` or `hook.params.query` where the target service name is read |
| `nameServiceAs` | string | Path on `hook.params` where the resolved service is written (defaults to `serviceField`) |
| `idField` | string | Path on `hook.data` or `hook.params.query` where the target object ID is read |
| `nameIdAs` | string | Path on `hook.params` where the resolved object is written (defaults to `idField`) |
| `throwOnNotFound` | boolean | Throw an error if the service or object is not found |

---

### `unpopulateObject(options)`

Removes a previously populated object and service from `hook.params`. Uses the same `nameIdAs`/`idField` and `nameServiceAs`/`serviceField` options as `populateObject`.

---

### `populateObjects(options)`

> Returns a hook function. To be used as a `before` hook.

Similar to `populateObject` but retrieves multiple objects. If no ID is provided, it fetches all objects from the target service via `service.find({ query: {} })`.

---

### `unpopulateObjects(options)`

Removes previously populated objects from `hook.params`. Behaves identically to `unpopulateObject`.

---

### `diacriticSearch(options?)`

> Returns a hook function.

Transforms any `$regex` values in `hook.params.query` into diacritic-insensitive equivalents using `makeDiacriticPattern`. Operates recursively and is idempotent (won't transform the same regex twice).

---

### `toDiacriticRegex(object)`

Utility function used internally by `diacriticSearch`. Recursively walks an object and replaces `$regex` values with their diacritic-insensitive counterparts.
