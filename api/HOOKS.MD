# Hooks

Kaelia [core module](https://github.com/kaelia-tech/kCore) and [client module](https://github.com/kaelia-tech/kClient) provides a collection of common [hooks](https://docs.feathersjs.com/api/hooks.html) to be used by plugins or [client applications](https://docs.feathersjs.com/api/client.html). They also rely on [Feathers common hooks](https://docs.feathersjs.com/api/hooks-common.html).

> [Hooks](https://docs.feathersjs.com/api/hooks.html) are the main way to introduce business logic into applications and plugins so we recommand to understand them well first before reading this.

## Query management [source](https://github.com/kaelia-tech/kCore/blob/master/src/hooks/query.js)

### .marshallComparisonQuery(hook)

Converts from client/server side comparison types (e.g. numbers) to basic JS types, which is usually required when querying the database. Applies to `$lt`, `$lte`, `$gt` and `$gte` operators.

### .marshallGeometryQuery(hook)

Converts from client/server side spatial types (e.g. coordinates or numbers) to basic JS types, which is usually required when querying the database. Applies to [MongoDB geospatial operators](https://docs.mongodb.com/manual/reference/operator/query-geospatial/).

## Logging [core source](https://github.com/kaelia-tech/kCore/blob/master/src/hooks/logger.js), [client source](https://github.com/kaelia-tech/kClient/blob/master/src/hooks/logger.js)

### .log(hook)

* Log error for each hook in error with error log level.
* Log information for each hook ran with verbose (respectively debug for client) log level.
* Log detailed information for each hook ran with debug (respectively trace for client) log level.

## Events [source](https://github.com/kaelia-tech/kClient/blob/master/src/hooks/events.js)

### .emit(hook)

Emit an event named `{hook_type}Hook` (e.g. `beforeHook` or `afterHook`) for each hook ran, the payload of the event being the hook object.
