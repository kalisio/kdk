# Base Viewer

## Overview

The `baseViewer` mixin provides the scaffolding for read-only object viewers. It computes the viewer title from the loaded JSON schema and exposes a `refresh()` method that loads the schema and the target object in parallel.

## Usage

```javascript
import { service, objectProxy, schemaProxy, baseViewer } from '@kalisio/kdk/core/client'

export default {
  mixins: [service, objectProxy, schemaProxy, baseViewer],
  // ...
}
```

::: danger
This mixin requires the [Service](./mixins.service.md), [Object Proxy](./mixins.object-proxy.md), and [Schema Proxy](./mixins.schema-proxy.md) mixins to be applied alongside it.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `perspective` | `String` | `''` | Optional perspective suffix appended to the schema name (e.g. `'profile'` → schema `users.get-profile`). |
| `clearButton` | `String` | `''` | Label for the clear button, if the viewer template exposes one. |
| `resetButton` | `String` | `''` | Label for the reset button, if the viewer template exposes one. |

## Computed Properties

### `viewerTitle`

Returns the internationalized title of the viewer, derived from the loaded schema's `title` field. The current object is passed as interpolation context.

- **Returns:** `string` — the translated schema title, or an empty string if no schema is loaded.

## Methods

### `getSchemaName()`

Computes the schema resource name from the `service` prop and the optional `perspective` prop.

- **Returns:** `string` — a name of the form `<service>.get` or `<service>.get-<perspective>`.

### `async refresh()`

Loads the schema (via `loadSchema`) and the object (via `loadObject`) in parallel, then makes them available through `getSchema()` and `getObject()`.

```javascript
await this.refresh()
console.log(this.viewerTitle)   // schema title, translated
console.log(this.getObject())   // the fetched document
```

::: tip
Call `refresh()` from `mounted` or whenever `objectId` / `perspective` change to ensure the viewer always displays up-to-date data.
:::
