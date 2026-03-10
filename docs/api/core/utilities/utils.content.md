# Content

## Overview

The `utils.content.js` module provides the content binding and filtering engine used throughout KDK to connect configuration-driven UI component definitions to their runtime context. It enables declarative handler and property binding using `:xxx` syntax in configuration objects.

## Functions

### `filterContent(content, filter)`

Recursively applies a [sift](https://github.com/crcn/sift.js) filter to a content definition. Supports both flat arrays and mode-keyed objects.

- **Parameters:**
  - `content` *(Array | Object | any)*: The content to filter. Arrays are filtered directly; objects with a `content` sub-key recurse; objects with mode keys filter each mode.
  - `filter` *(Object)*: A sift-compatible filter object.
- **Returns:** The filtered content (same type as input).

### `bindContent(content, context, omit?)`

Binds all handler functions and `:xxx` properties in a content definition array to the given context object. Mutates the content in place.

- **Parameters:**
  - `content` *(Array)*: Array of component definition objects.
  - `context` *(Object)*: The binding context (typically a Vue component instance).
  - `omit` *(Array, default `[]`)*: Property keys to skip during binding (e.g. `['header', 'fab']`).
- **Returns:** The mutated `content` array.

### `bindProperties(item, context, omit?)`

Recursively walks an object or array and replaces any string value starting with `:` with the corresponding value from `context`.

- **Parameters:**
  - `item` *(Object | Array | any)*: The item to process.
  - `context` *(Object)*: The binding context.
  - `omit` *(Array, default `[]`)*: Keys to skip.
- **Returns:** The mutated item.

### `bindHandler(component, path, context)`

Resolves the handler at `path` on a component and replaces it with a bound function. Supports three forms:
- **Array**: each element is bound and the final handler returns `true` only if all handlers return `true` (AND semantics).
- **Object `{ name, params }`**: binds `context[name]` with optional params. Names starting with `:` are treated as property bindings.
- **String**: binds `context[name]`. A leading `!` negates the result.

- **Parameters:**
  - `component` *(Object)*: The component definition.
  - `path` *(string)*: Lodash path to the handler within `component`.
  - `context` *(Object)*: The binding context.
- **Returns:** The resolved handler function.

### `generateHandler(context, name, params?)`

Creates a closure that calls `context[name]` with optional bound parameters when invoked.

- **Parameters:**
  - `context` *(Object)*: The binding context.
  - `name` *(string)*: Function or property name on context. Prefix with `!` to negate.
  - `params` *(any, optional)*: Static or bound parameters passed to the function.
- **Returns:** `Function` — the generated handler.

### `bindParams(params, context, args)`

Recursively resolves bound parameter values, handling arrays, objects, and scalar `:xxx` strings.

- **Parameters:**
  - `params` *(any)*: Parameters to resolve.
  - `context` *(Object)*: The binding context.
  - `args` *(Array)*: The original handler arguments (for `:n` index references).
- **Returns:** The resolved parameters.

### `getBoundValue(value, context, args?)`

Resolves a single `:xxx` binding expression:
- `:store.path` — reads from the global `Store` by path.
- `:storeRef.path` — returns a reactive `ref` from the global `Store`.
- `:n` — returns the nth element of `args` (handler call arguments).
- `:prop` — reads `context[prop]`.
- Non-`:` strings are returned as-is.

- **Parameters:**
  - `value` *(any)*: The value to resolve.
  - `context` *(Object)*: The binding context.
  - `args` *(Array, optional)*: Handler call arguments.
- **Returns:** The resolved value, or `undefined` if the binding target is not found.
