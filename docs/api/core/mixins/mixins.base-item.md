# Base Item

## Overview

The `baseItem` mixin provides the foundation for list/collection item components. It manages the item's display properties (name, description, avatar), handles action binding and filtering based on the current user's abilities, and exposes helpers for common CRUD operations (view, edit, remove, export).

Actions are re-evaluated whenever the `item` or `actions` props change, and whenever user abilities are updated.

## Usage

```javascript
import { baseItem } from '@kalisio/kdk/core/client'

export default {
  mixins: [baseItem],
  // ...
}
```

## Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `item-selected` | `(item, section)` | Emitted when the item is selected. |
| `item-toggled` | `(item, toggled)` | Emitted when the item's toggle state changes. |
| `item-expanded` | `(item, expanded)` | Emitted when the item is expanded or collapsed. |

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `service` | `String` | yes | — | The name of the FeathersJS service this item belongs to. Used for permission checks and CRUD operations. |
| `item` | `Object` | yes | — | The data object represented by this item. |
| `actions` | `Object \| Array` | no | `null` | Action definitions to display on the item. |
| `filter` | `Object` | no | `{}` | A [sift](https://github.com/crcn/sift.js) filter applied to the action list. |
| `handlerContext` | `Object` | no | `null` | The context object to which action handler methods are bound. Defaults to the component instance. |
| `options` | `Object` | no | `{}` | Display options. Supports `nameField`, `descriptionField`, and `avatar` keys. |
| `bindActions` | `Boolean` | no | `true` | When `true`, action handlers are bound to `handlerContext` (or the component instance). Set to `false` to skip binding. |

## Data

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `itemActions` | `Array \| null` | `null` | The currently active, filtered, and bound actions for this item. |

## Computed Properties

### `name`

Returns the item's display name, read from `item[options.nameField]` (defaults to `item.name`).

- **Returns:** `string`

### `description`

Returns the item's description, read from `item[options.descriptionField]` (defaults to `item.description`).

- **Returns:** `string`

### `avatar`

Returns whether an avatar should be displayed for this item, read from `options.avatar` (defaults to `true`).

- **Returns:** `boolean`

## Methods

### `setActions(actions)`

Binds the given action definitions to the handler context (or the component instance) and stores them in `itemActions`. Each item gets a deep clone of the action config to avoid shared state across items.

- **Parameters:**
  - `actions` *(Array | Object)*: The action definitions to bind.

### `clearActions()`

Sets `itemActions` to `null`, removing all actions from the item.

### `filteredActions()`

Returns the subset of `actions` that pass the current `filter`.

- **Returns:** `Array` — filtered action definitions, or an empty array if no actions are defined.

### `configureActions()`

Applies the filter and sets or clears `itemActions`. Override this method in concrete item components to implement custom action registration logic.

### `onItemToggled(toggled)`

Emits the `item-toggled` event.

- **Parameters:**
  - `toggled` *(boolean)*: The new toggle state.

### `onItemSelected(section)`

Emits the `item-selected` event.

- **Parameters:**
  - `section` *(any)*: The section or context in which the item was selected.

### `onItemExpanded(expanded)`

Emits the `item-expanded` event.

- **Parameters:**
  - `expanded` *(boolean)*: Whether the item is now expanded.

### `canViewItem()`

Checks whether the current user has `read` permission for this item.

- **Returns:** `boolean`

### `viewItem()`

Navigates to the item's view route by appending `/view/<item._id>` to the current route path.

### `canEditItem()`

Checks whether the current user has `update` permission for this item.

- **Returns:** `boolean`

### `editItem(scope, properties)`

Navigates to the item's edit route. The path is built as `<current path>/edit/<item._id>[/<properties>|/<scope>]`.

- **Parameters:**
  - `scope` *(string, optional)*: An optional scope segment appended to the path.
  - `properties` *(string, optional)*: When provided alongside `scope`, used as the trailing path segment instead of `scope`.

### `canRemoveItem()`

Checks whether the current user has `remove` permission for this item.

- **Returns:** `boolean`

### `removeItem(prompt, nameField)`

Removes the item from the service. Optionally shows a confirmation dialog first.

- **Parameters:**
  - `prompt` *(string, optional)*: Confirmation mode. `'confirm'` shows a yes/no dialog; `'input'` additionally requires the user to type the item name to confirm. Any other value (or omitting the parameter) removes without confirmation.
  - `nameField` *(string, default `'name'`)*: The item field used as the display name in the confirmation dialog.

### `exportItem()`

Exports the item as a JSON file. Uses Quasar's `exportFile` utility and shows a success or error notification.

## Lifecycle

- **`created`**: calls `configureActions()` and subscribes to the `user-abilities-changed` event so that actions are refreshed whenever permissions change.
- **`beforeUnmount`**: unsubscribes from the `user-abilities-changed` event.
