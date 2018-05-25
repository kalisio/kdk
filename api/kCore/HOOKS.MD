# Hooks

Kalisio [core module](https://github.com/kalisio/kCore) aprovides a collection of common [hooks](https://docs.feathersjs.com/api/hooks.html) to be used by plugins or [client applications](https://docs.feathersjs.com/api/client.html). They also rely on [Feathers common hooks](https://docs.feathersjs.com/api/hooks-common.html).

> [Hooks](https://docs.feathersjs.com/api/hooks.html) are the main way to introduce business logic into applications and plugins so we recommand to understand them well first before reading this.

## Query management [source](https://github.com/kalisio/kCore/blob/master/src/hooks/query.js)

### .marshallComparisonQuery(hook)

Converts from client/server side comparison types (e.g. numbers) to basic JS types, which is usually required when querying the database. Applies to `$lt`, `$lte`, `$gt` and `$gte` operators.

> Reads the query object to process from `hook.params.query`

### .marshallGeometryQuery(hook)

Converts from client/server side spatial types (e.g. coordinates or numbers) to basic JS types, which is usually required when querying the database. Applies to [MongoDB geospatial operators](https://docs.mongodb.com/manual/reference/operator/query-geospatial/).

> Reads the query object to process from `hook.params.query`

### .populateObject(options)

> Return a hook function according to provided options

Retrieve the target object(s) required by a subsequent operation from its service. The object(s) are populated in `hook.params` according to the following options:
* **serviceField**: name of the field where to read the name of the target service on `hook.data` or `hook.params.query`
* **nameServiceAs**: name of the field where to write the target service when found on `hook.params`
* **idField**: name of the field where to read the `_id` of the target object on `hook.data` or `hook.params.query`
* **nameIdAs**: name of the field where to write the target object when found on `hook.params`
* **throwOnNotFound**: boolean indicating if an error should be raised when either the target service or object is not found

> If when applied existing object(s) and/or service are found in `hook.params` they are reused as is (i.e. not updated)

## Authorisations management [source](https://github.com/kalisio/kCore/blob/master/src/hooks/authorisations.js)

### .populateSubjects(hook)

Retrieve the target subject object(s) for an authorisation operation.

Specialises the [populateObjects](./HOOKS.MD#populateobjectshook) with the following options:
* **serviceField**: `'subjectsService'`
* **idField**: `'subjects'`
* **throwOnNotFound**: `true`

### .populateResource(hook)

Retrieve the target resource object for an authorisation operation.

Specialises the [populateObjects](./HOOKS.MD#populateobjectshook) with the following options:
* **serviceField**: `'resourcesService'`
* **idField**: `'resource'`
* **throwOnNotFound**: `true`

### .authorise(hook)

Check permissions to access target resource object(s) for current user on the performed operation.

If the operation is authorised the `hook.params.authorised` flag will be set to `true`.

If you'd like to force/unforce authorisation check use the `hook.params.checkAuthorisation` flag.

> By default check will only be performed when called from a client not from the server itself.

### .updateAbilities(options)

> Return a hook function according to provided options

Update cached subject abilities when permissions have changed according to the following options:
* **TODO**

## Logging [core source](https://github.com/kalisio/kCore/blob/master/src/hooks/logger.js), [client source](https://github.com/kalisio/kCore/blob/master/src/client/hooks/logger.js)

### .log(hook)

* Log error for each hook in error with error log level.
* Log information for each hook ran with verbose (respectively debug for client) log level.
* Log detailed information for each hook ran with debug (respectively trace for client) log level.

## Events [source](https://github.com/kalisio/kCore/blob/master/src/hooks/events.js)

### .emit(hook)

Emit an event named `{hook_type}Hook` (e.g. `beforeHook` or `afterHook`) for each hook ran, the payload of the event being the hook object.
