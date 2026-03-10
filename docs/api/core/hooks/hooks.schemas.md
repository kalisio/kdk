# Schema hooks

## Overview

Hooks for validating hook data against JSON Schema definitions using AJV.

## Functions

### `validateData(schema)`

> To be used as a `before` hook. Returns a hook function.

Validates each item in `hook.data` against the provided JSON Schema using the KDK AJV instance. Invalid items are filtered out. The hook throws `BadRequest` in two cases:

- **Single item**: any validation failure throws immediately with the error message and field details.
- **Multiple items**: throws only if **all** items are invalid. Partially valid batches proceed with only the valid items.

Each validation error includes:
- `message` — AJV error message.
- `propertyPath` — JSON Pointer path to the invalid field (e.g. `/name`).
- `propertyValue` — the actual value that failed validation.

#### Parameters

- `schema` *(Object)*: A JSON Schema draft-07 object. It is wrapped with the KDK AJV instance via `@feathersjs/schema`.
