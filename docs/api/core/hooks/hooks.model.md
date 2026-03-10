# Model hooks

## Overview

Hooks for transforming data model items: serializing/moving properties, converting types (ObjectIDs, dates, JSON), enforcing uniqueness, managing perspectives, and handling TTL or soft-delete flags.

## Functions

### `processTimes(properties)`

> Returns a hook function.

Converts moment date values at the given `properties` paths on hook items to plain JS `Date` objects before writing to the database adapter (marshalling).

---

### `unprocessTimes(properties)`

> Returns a hook function.

Converts plain JS `Date` values at the given `properties` paths on hook items back to moment objects after reading from the database adapter (unmarshalling).

---

### `serialize(rules, options?)`

> Returns a hook function.

Copies or moves properties within hook items according to an array of transformation rules.

#### Parameters

- `rules` *(Array)*: Each rule is an object with:
  - `source` *(string)*: Lodash path of the property to read.
  - `target` *(string)*: Lodash path of the property to write.
  - `delete` *(boolean, optional)*: If `true`, removes the source property after copying.
  - `filter` *(Object, optional)*: Sift filter applied to the source value before writing.
  - `throwOnNotFound` *(boolean, optional)*: Throw if the source value is `null`/`undefined`.
- `options.throwOnNotFound` *(boolean)*: Global throw-on-missing flag applied to all rules.

#### Example

```js
import { hooks } from '@kalisio/kdk/core.api'
// Transforms { name: 'toto' } → { profile: { name: 'toto' } }
service.hooks({
  before: {
    create: [hooks.serialize([{ source: 'name', target: 'profile.name', delete: true }], { throwOnNotFound: true })]
  }
})
```

---

### `processObjectIDs(hook)`

> Usually used as an app-level hook.

Converts all `_id`-like keys and operator values (`$in`, `$nin`, `$or`, `$ne`, nested `field._id`) from strings to MongoDB `ObjectID` instances. Applies to both `hook.data` items and `hook.params.query`.

---

### `convertObjectIDs(properties)`

> Returns a hook function.

Converts a known set of named properties from strings to MongoDB `ObjectID` instances. Applies to both `hook.data` items and `hook.params.query`.

#### Example

```js
import { hooks } from '@kalisio/kdk/core.api'
// Converts data.participant and data.event to ObjectIDs
service.hooks({ before: { all: [hooks.convertObjectIDs(['participant', 'event'])] } })
```

---

### `convertDates(properties, asMoment?)`

> Returns a hook function.

Converts a known set of named properties from strings to `Date` objects (or moment objects when `asMoment` is `true`). Applies to both `hook.data` items and `hook.params.query`.

#### Example

```js
import { hooks } from '@kalisio/kdk/core.api'
// Converts data.expireAt to a Date
service.hooks({ before: { create: [hooks.convertDates(['expireAt'])] } })
```

---

### `convertToJson(properties)`

> Returns a hook function.

Converts a known set of named properties from JSON strings to parsed JS objects on hook items.

---

### `convertToString(properties)`

> Returns a hook function.

Converts a known set of named properties from JS objects to JSON strings on hook items.

---

### `populatePreviousObject(hook)`

> To be used as a `before` hook.

Fetches the current version of the item from the service before an update or patch operation, making it available to subsequent hooks as `hook.params.previousItem`.

---

### `setAsDeleted(hook)`

Sets a `deleted: true` flag on hook items. Useful for soft-delete patterns where subsequent hooks or operations need to know the item has been marked for deletion.

---

### `setExpireAfter(delayInSeconds)`

> To be used as a `before` hook. Returns a hook function.

Sets the MongoDB TTL field `expireAt` on hook items to `now + delayInSeconds`. Requires a [TTL index](https://docs.mongodb.com/manual/tutorial/expire-data/) on `expireAt` for MongoDB to automatically remove the document.

---

### `distinct(hook)`

Executes a MongoDB `distinct` query when `hook.params.query.$distinct` is set, bypassing the normal service call and setting `hook.result` directly.

---

### `checkUnique(options?)`

> Returns a hook function.

Checks whether an object with the same value for a given field already exists in the service (or a target service). Throws a `Conflict` error if a duplicate is found during `create`, or if a different existing object has the same value during `update`/`patch`.

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `field` | string | Field name to check for uniqueness (default: `'name'`) |
| `service` | string | Target service name (defaults to the current service) |
| `query` | Function | Optional function `(query, hook) => void` to augment the uniqueness query |

---

### `preventChanges(ifThrow, fieldNames)`

> To be used as a `before patch` hook. Returns a hook function.

Prevents specified fields from being changed in a patch operation. When `ifThrow` is `true`, throws a `BadRequest` if a prevented field is found. When `false`, silently removes it from `hook.data`. Supports dot-notation field names.
