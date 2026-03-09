# Base Editor

## Overview

The `baseEditor` mixin provides the full lifecycle for form-based create/update editors. It handles schema and object loading, form binding, validation, service calls (create or patch), and perspective-aware data mapping.

The editor operates in one of two modes:
- **`create`** — when no `objectId` prop is present; the form submits a `service.create()` call.
- **`update`** — when an `objectId` prop is present; the form submits a `service.patch()` call.

## Usage

```javascript
import { service, objectProxy, schemaProxy, baseEditor } from '@kalisio/kdk/core/client'

export default {
  mixins: [service, objectProxy, schemaProxy, baseEditor],
  // ...
}
```

::: danger
This mixin requires the [Service](./mixins.service.md), [Object Proxy](./mixins.object-proxy.md), and [Schema Proxy](./mixins.schema-proxy.md) mixins to be applied alongside it.
:::

## Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `applied` | `response` | Emitted after the service call succeeds, with the service response as payload. |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `baseObject` | `Object` | `{}` | Fallback object used when no service object is loaded. Useful for carrying hidden or internal properties into the submission. |
| `baseQuery` | `Object` | `{}` | Additional query parameters merged into every service call. |
| `schemaName` | `String` | `undefined` | Explicit schema resource name. Overrides the auto-derived name. |
| `perspective` | `String` | `''` | When set, only the specified perspective of the object is loaded and patched. |
| `perspectiveAsObject` | `Boolean` | `true` | When `true` (default), the in-memory object holds the perspective data directly. When `false`, it holds the full structure `{ [perspective]: { ... } }`. |
| `clearButton` | `String` | `''` | Label for the clear button, if exposed by the editor template. |
| `resetButton` | `String` | `''` | Label for the reset button, if exposed by the editor template. |

## Computed Properties

### `editorTitle`

Returns the internationalized title of the editor, derived from the loaded schema's `title` field. The object name is passed as an interpolation variable.

- **Returns:** `string` — the translated schema title, or an empty string if no schema is loaded.

### `editorMode`

Returns the current editor mode.

- **Returns:** `'update'` if `objectId` is set, `'create'` otherwise.

### `applyButton`

Returns the label for the submit button, localized.

- **Returns:** `'UPDATE'` in update mode, `'CREATE'` in create mode.

## Data

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isFormReady` | `Boolean` | `false` | Set to `true` once the form component signals it is ready via `onFormReady()`. |
| `applyInProgress` | `Boolean` | `false` | Set to `true` while a service call is in-flight. |

## Methods

### `getBaseObject()`

Returns the object that will be used as the starting point for form submission. It merges the loaded service object (or `baseObject` prop as fallback) with perspective-aware data extraction.

- **Returns:** `Object`

### `getBaseQuery()`

Returns the query object that will be sent alongside the service call. In update mode with a perspective, automatically adds `$select: ['_id', perspective]`.

- **Returns:** `Object`

### `getSchemaName()`

Computes the schema resource name. Resolution order:

1. `schemaName` prop (explicit override)
2. `this.$route.meta.schemaName` (route metadata)
3. Auto-derived: `<service>.<create|update>[-<perspective>]`

- **Returns:** `string`

### `onFormReferenceCreated(reference)`

Stores a reference to the form component instance. Should be bound to the form's `ref` callback in the template.

- **Parameters:**
  - `reference` *(Object)*: The form component instance.

### `onFormReady()`

Called when the form component emits its ready event. Sets `isFormReady` to `true` and calls `fillEditor()`.

### `fillEditor()`

Fills the form with the currently loaded object's values. If a `perspective` is set, only the perspective data is passed to the form.

- **Throws:** `Error` if called before the form is ready.

### `clearEditor()`

Clears all form fields back to their default values.

- **Throws:** `Error` if called before the form is ready.

### `resetEditor()`

Resets the form to the currently loaded object's values (equivalent to calling `fillEditor()` again).

- **Throws:** `Error` if called before the form is ready.

### `async apply()`

Validates the form and, if valid, performs the service operation:

- **`create` mode**: calls `service.create(object, { query })`.
- **`update` mode**: calls `service.patch(objectId, data, { query })`, where `data` is perspective-aware.

After a successful call, calls `form.submitted(response)` and emits `applied`.

- **Returns:** `boolean` — `true` on success, `false` if validation failed or a service error occurred.

### `async refresh()`

Reloads the schema and object in parallel, then fills the editor if the form is already ready.

```javascript
// Typical usage in mounted()
await this.refresh()
```

::: tip
`refresh()` resets `this.form` to `null` before loading so that a form re-render triggered by reactive data changes starts from a clean state.
:::
