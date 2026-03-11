# Catalog hooks

## Overview

Hooks for the catalog service: injecting default categories and sublegends from service configuration, filtering query results to layers only, propagating layer renames and removals to referencing contexts and categories, updating projects when layers or views are deleted, and serializing layer filter queries to/from JSON strings.

## Functions

### `filterLayers(hook)`

> To be used as a `before find` hook.

Ensures that `find` queries return only layer objects by default. When no `type` filter is present in the query, injects `type: { $nin: ['Context', 'Service', 'Category', 'Sublegend'] }` to exclude non-layer catalog items.

---

### `getDefaultCategories(hook)`

> To be used as an `after find` hook.

Appends categories defined in `service.options.categories` to the find result when the query targets the `Category` type (or has no type filter). Each default category is filtered through the current query conditions (excluding pagination operators) before being added to the result set.

---

### `getDefaultSublegends(hook)`

> To be used as an `after find` hook.

Appends sublegends defined in `service.options.sublegends` to the find result when the query targets the `Sublegend` type (or has no type filter). Behaves identically to `getDefaultCategories` but for sublegend items.

---

### `updateLayerReferences(hook)`

> To be used as an `after update/patch/remove` hook.

Propagates a layer rename or removal to all catalog items (`Context`, `Category`) that reference the layer by name in their `layers` array.

- On `update` or `patch`: replaces the old layer name with the new one in each referencing item.
- On `remove`: removes the layer name from each referencing item's `layers` array.

Requires `hook.params.previousItem` (set by [`populatePreviousObject`](../../core/hooks/hooks.model.md#populatepreviousobjecthook)) to identify the original layer name and type. No-op when the item is not a layer.

---

### `updateProjects(hook)`

> To be used as an `after remove` hook.

Removes references to a deleted layer or view from all projects in the same service context. For each removed item:
- **Layer**: removes it from `project.layers` matching by `_id` or `name`.
- **View (Context)**: removes it from `project.views` matching by `_id`.

No-op when no `projects` service is available in the context.

---

### `convertFilterQueriesToString(hook)`

> To be used as a `before create/update/patch` hook.

Serializes the `active` and `inactive` filter query objects on each layer's `filters` array to JSON strings before writing to the database. Uses [`convertToString`](../../core/hooks/hooks.model.md) from the core model hooks.

---

### `convertFilterQueriesToObject(hook)`

> To be used as an `after find/get` hook.

Deserializes the `active` and `inactive` filter query strings on each layer's `filters` array back to JS objects after reading from the database. Uses [`convertToJson`](../../core/hooks/hooks.model.md) from the core model hooks.
