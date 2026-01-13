# Hooks

## Query

### marshallComparisonQuery(hook)

Converts from client/server side comparison types (e.g. numbers) to basic JS types, which is usually required when querying the database. Applies to `$lt`, `$lte`, `$gt` and `$gte` operators.

> Reads the query object to process from `hook.params.query`

### populateObject(options)

> Return a hook function according to provided options

Retrieve the target object(s) required by a subsequent operation from its service. The object(s) are populated in `hook.params` according to the following options:
* **serviceField**: name of the field where to read the name of the target service on `hook.data` or `hook.params.query`
* **nameServiceAs**: name of the field where to write the target service when found on `hook.params`
* **idField**: name of the field where to read the `_id` of the target object on `hook.data` or `hook.params.query`
* **nameIdAs**: name of the field where to write the target object when found on `hook.params`
* **throwOnNotFound**: boolean indicating if an error should be raised when either the target service or object is not found

> If when applied existing object(s) and/or service are found in `hook.params` they are reused as is (i.e. not updated)

### populateObjects(options)

Similar to [populateObject](./HOOKS.MD#populateobjectshook) except that if no object ID is found it will retrieve all objects from the target servic using `service.find({ query: {} })`.

## Data model

### processPerspectives(hook)

> Usually used as a app-level hook

Discard all perspectives declared on the model by default. Will for any to be included when using [`$select`](https://docs.feathersjs.com/api/databases/querying.html#select).

> Take care of a subset of perspective fields like when using `$select: ['perspective.fieldName']`

### preventUpdatePerspectives(hook)

> Usually used as a app-level hook

When a perspectives is present in your data model you must disallow update it in order to avoid erasing it. Indeed, when requesting an object e.g. for edition they are not retrieved by default, su sending it back for update will erase the missing perspective fields.

### serialize(rules, options)

> Return a hook function according to provided options

The **rules** argument contains the list of transformations to be applied, it is an array of objects like the following:
  * **source**: the path of the source property to read value from
  * **target**: the path of the target property where to write value to
  * **delete**: boolean indicating if the source property should be deleted after transformation

Modify the data structure of operation item (i.e. data/result in before/after hook) according to the following options:
* **throwOnNotFound**: boolean indicating if an error should be raised when either the target service or object is not found

```js
import { hooks } from '@kalisio/kdk/core.api'
// Will transform hook data from { name: 'toto' } to { profile: { name: 'toto' } }
service.hooks({ before: { create: [ hooks.serialize([{ source: 'name', target: 'profile.name', delete: true }], { throwOnNotFound: true }) ] } })
```

### processObjectIDs(hook)

> Usually used as a app-level hook

Transform any value bound to an `_id` like key from a string into a [Mongo ObjectID](https://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html) on client queries.

> Take care of `$in`, `$nin` and `$or` operators recursively, as well as nested fields query like `field._id`

### convertObjectIDs(properties)

> Return a hook function according to provided property list

Transform a known set of properties from strings into a [Mongo ObjectIDs](https://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html) on client queries.

> Fields are searched on `hook.data` or `hook.params.query`

```js
import { hooks } from '@kalisio/kdk/core.api'
// Will convert data.participant and data.event to ObjectIDs
service.hooks({ before: { all: [ hooks.convertObjectIDs(['participant', 'event']) ] } })
```

### convertDates(properties, asMoment)

> Return a hook function according to provided property list and Date/moment object flag

Transform a known set of properties from strings into a Data or [moment](https://momentjs.com/) object on client queries.

> Fields are searched on `hook.data` or `hook.params.query`

```js
import { hooks } from '@kalisio/kdk/core.api'
// Will convert data.expireAt to Date
service.hooks({ before: { create: [ hooks.convertDates(['expireAt']) ] } })
```

### setAsDeleted(hook)

Flag the item as deleted when required by subsequent operations.

> Delete flag is stored in the `deleted` field

### populatePreviousObject(hook)

> To be used a a before hook

Retrieve the target object before an update or a patch operation.

> Previous object is stored in `hook.params.previousItem`

### setExpireAfter(delayInSeconds)

> To be used a a before hook
> Return a hook function according to provided delay

Set the MongoDB [TTL](https://docs.mongodb.com/manual/tutorial/expire-data/) on the target object.

> TTL is stored in the `expireAt` field

## Service

### rateLimit(options)

> To be used a before hook
> Return a hook function according to provided options

Rate limit the call of a target service (and possibly operation) according to the following options:
* **tokensPerInterval**: the number of allowed tokens in the given delay (1 service call = 1 token)
* **interval**: the delay to fill the bucket with the given number of tokens in
* **operation**: will only apply to this operation when given
* **service**: will only apply to this service when given (usefull when used as a app-level hook)

> Rely on the [token bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket)

## Authorisations

### populateSubjects(hook)

Retrieve the target subject object(s) for an authorisation operation.

Specialises [populateObjects](./HOOKS.MD#populateobjectshook) with the following options:
* **serviceField**: `'subjectsService'`
* **idField**: `'subjects'`
* **throwOnNotFound**: `true`

### populateResource(hook)

Retrieve the target resource object for an authorisation operation.

Specialises the [populateObject](./HOOKS.MD#populateobjecthook) with the following options:
* **serviceField**: `'resourcesService'`
* **idField**: `'resource'`
* **throwOnNotFound**: `true`

### authorise(hook)

> Usually used as a app-level hook

Check permissions to access target resource object(s) for current user on the performed operation.

If the operation is authorised the `hook.params.authorised` flag will be set to `true`.

If you'd like to force/unforce authorisation check use the `hook.params.checkAuthorisation` flag.

> By default check will only be performed when called from a client not from the server itself.

### updateAbilities(options)

> Return a hook function according to provided options

Update cached subject abilities when permissions have changed according to the following options:
* **subjectAsItem**: boolean indicating if the subject is the item of the current operation (e.g. when applied on the users service) or provided by `hook.params.user`
* **fetchSubject**: boolean indicating if the subject object has to be entirely fetched from the underlying service (useful when the item does not include permissions)

## Users

### isNotMe(options)

The `isNotMe` helps ensuring that users can only access or manipulate their own user record on the [users service](./services.md#users-service).
It returns `true` when the requested target user is not the authenticated user and `false` otherwise, typically to be used as a `get` before hook or service operations after hook.

The following code shows how to use this hook inside a **Feathers** hook configuration:
```js
import { iff, disallow, discard } from 'feathers-hooks-common'
import { hooks } from '@kalisio/kdk/core.api.js'

const { isNotMe } = hooks

before: {
  get: [iff(isNotMe(), disallow())],
},
after: {
  all: [iff(isNotMe(),  discard('secret'))]
}
```

The following hook options are available:
* **throwOnMissingUser**: will throw if called when no authenticated user can be found, defaults to `false`

### onlyMe(options)

The `onlyMe` helps ensuring that users can only access or manipulate their own user record on the [users service](./services.md#users-service).
It restricts input query to return only the logged-in user, typically to be used on `find` or `patch` operations.

The following code shows how to use this hook inside a **Feathers** hook configuration:
```js
import { iff, disallow } from 'feathers-hooks-common'
import { hooks } from '@kalisio/kdk/core.api.js'

const { onlyMe } = hooks

before: {
  find: [onlyMe()],
  patch: [onlyMe()],
  remove: [onlyMe()]
}
```

The following hook options are available:
* **throwOnMissingUser**: will throw if called when no authenticated user can be found, defaults to `true`

### enforcePasswordPolicy(options)

> To be used a before hook
> Return a hook function according to provided options

Check password policy when creating/updating the user's password according to the following options:
* **userAsItem**: boolean indicating if the user is the item of the current operation (e.g. when applied on the users service) or provided by `hook.params.user`
* **passwordField**: the name of the field containing the clear password on the item (defaults to `clearPassword`)
* **previousPasswordsField**: the name of the field containing the hashed password history on the item (defaults to `previousPasswords`)

> For more information read about [password policy configuration](../../guides/basics/step-by-step.md#configuring-a-kapp).

### storePreviousPassword(options)

> To be used a before hook
> Return a hook function according to provided options

Update the password history when updating the user's password according to the following options:
* **userAsItem**: boolean indicating if the user is the item of the current operation (e.g. when applied on the users service) or provided by `hook.params.user`
* **passwordField**: the name of the field containing the current hashed password on the item (defaults to `password`)
* **previousPasswordsField**: the name of the field containing the hashed password history on the item (defaults to `previousPasswords`)

> For more information read about [password policy configuration](../../guides/basics/step-by-step.md#configuring-a-kapp).

### generatePassword(hook)

> To be used a before hook

Generate a random password according to password policy (if any) and store it in the **password** item field.

> For more information read about [password policy configuration](../../guides/basics/step-by-step.md#configuring-a-kapp).

## Organisations

### createOrganisationServices(hook)

> To be used an after hook

Create the database used to store organisation data and registered organisation services. Hook `result` is expected to be the organisation object and the organisation ID will be used as the database name.

### removeOrganisationServices(hook)

> To be used an after hook

Delete the database used to store organisation data and registered organisation services. Hook `result` is expected to be the organisation object.

### createOrganisationAuthorisations(hook)

> To be used an after hook

Set default membership of the user as params to organisation owner after creating it. Hook `result` is expected to be the organisation object.

### removeOrganisationAuthorisations(hook)

> To be used an after hook

Removes membership of all users of the organisation after removing it. Hook `result` is expected to be the organisation object.

## Groups

### createGroupAuthorisations(hook)

> To be used an after hook

Set default membership of the user as params to group owner after creating it. Hook `result` is expected to be the group object.

### removeGroupAuthorisations(hook)

> To be used an after hook

Removes membership of all users of the group after removing it. Hook `result` is expected to be the group object.

## Logs

### log(hook)

> Usually used as a app-level hook

* Log error for each hook in error with error log level.
* Log information for each hook ran with verbose (respectively debug for client) log level.
* Log detailed information for each hook ran with debug (respectively trace for client) log level.

## Events

### emit(hook)

> Usually used as a app-level hook

Emit an event named `{hook_type}Hook` (e.g. `beforeHook` or `afterHook`) for each hook ran, the payload of the event being the hook object.
