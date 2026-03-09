# Schema Proxy

## Overview

The `schemaProxy` mixin provides a component with methods to load and access a [JSON Schema](https://json-schema.org/) object. The schema can be supplied in three ways: as an inline JSON string (`schemaJson`), as an async factory function (`schemaFunction`), or by name as a resource file that will be fetched at runtime. It also supports filtering which schema properties are exposed.

Pending load requests are cached via a querable promise and only re-initiated when the resolved schema name changes.

## Usage

```javascript
import { service, schemaProxy } from '@kalisio/kdk/core/client'

export default {
  mixins: [service, schemaProxy],
  // ...
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schemaJson` | `String` | `''` | An inline JSON string representing the schema. Takes priority over `schemaFunction` and resource loading. |
| `schemaFunction` | `Function` | `null` | An async function that returns a schema object. Used when `schemaJson` is not set. |
| `schemaProperties` | `String \| Array` | `[]` | A comma-separated string or array of property names to keep in the schema. All other properties are removed. |

## Data

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `schema` | `Object \| null` | `null` | The currently loaded (and optionally filtered) JSON Schema object. |

## Methods

### `getSchema()`

Returns the currently loaded schema.

- **Returns:** `Object | null`

### `getSchemaId()`

Returns the `$id` field of the currently loaded schema.

- **Returns:** `string` — `schema.$id`, or an empty string if no schema is loaded.

### `filterSchema()`

Filters `schema.properties` to keep only the entries listed in `schemaProperties`. Also updates `schema.$id` with a suffix derived from the filter so that a filtered schema is not confused with the full one, and intersects `schema.required` accordingly.

This method is called automatically after every successful schema load.

### `loadSchemaFromResource(schemaName)`

Fetches a schema JSON file by name using the KDK schema loader and applies property filtering.

- **Parameters:**
  - `schemaName` *(string)*: The schema resource name (e.g. `'users.create'`).
- **Returns:** `Promise<Object>` — the loaded and filtered schema.
- **Emits:** global `error` event on failure.

### `loadSchemaFromJson(json)`

Parses the given JSON string as a schema and applies property filtering.

- **Parameters:**
  - `json` *(string)*: A valid JSON string representing the schema.
- **Returns:** `Promise<Object>` — the parsed and filtered schema.
- **Emits:** global `error` event on failure.

### `loadSchemaFromFunction(f)`

Calls the provided async function to obtain a schema and applies property filtering.

- **Parameters:**
  - `f` *(Function)*: An async function that resolves to a schema object.
- **Returns:** `Promise<Object>` — the resolved and filtered schema.
- **Emits:** global `error` event on failure.

### `loadSchema(schemaName)`

Main entry point for schema loading. Dispatches to `loadSchemaFromJson`, `loadSchemaFromFunction`, or `loadSchemaFromResource` based on which props are set. The resulting promise is cached and reused as long as the schema name has not changed.

- **Parameters:**
  - `schemaName` *(string)*: The target schema resource name, used when neither `schemaJson` nor `schemaFunction` are set.
- **Returns:** `Promise<Object>` — the loaded schema.

**Priority order:**
1. `schemaJson` prop (inline JSON string)
2. `schemaFunction` prop (async factory)
3. `schemaName` argument (resource file)

::: tip
Schema names for service resources follow the pattern `<service>.<operation>[-perspective]` (e.g. `users.create`, `users.update-profile`). The `.json` extension is appended automatically.
:::
