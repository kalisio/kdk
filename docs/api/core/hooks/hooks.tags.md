# Tag hooks

## Overview

Hooks for propagating tag changes to resources that reference them.

## Functions

### `reflectTagUpdate(hook)`

> To be used as an `after update`, `after patch`, or `after remove` hook.

Propagates a tag change (rename, recolor, or removal) to all resources that reference the tag. Uses the tag's `service` and `property` fields to find the target service and update all affected records.

- On `update` or `patch`: replaces the tag's `name`, `description`, and `color` on all matching resources.
- On `remove`: removes the tag from all resources that referenced it.

Matching is based on the previous tag's `name` and `color` stored in `hook.params.previousItem` (set by [`populatePreviousObject`](./hooks.model.md#populatepreviousobjecthook)).

::: tip
This hook requires `hook.params.previousItem` to be available, so it should always be preceded by `populatePreviousObject` in the hook chain.
:::
