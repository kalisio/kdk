# Authorisation hooks

## Overview

Hooks for the CASL-based authorisation system: populating subjects and resources, enforcing access control, preventing privilege escalation, updating the abilities cache, and generating JWT tokens.

## Functions

### `createJWT(options?)`

> Returns a hook function.

Generates JWT access tokens for each item in the hook result using the application's authentication service, and stores them on the item.

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `name` | string | Property name to store the token on each item (default: `'accessToken'`) |
| `payload` | Function | `(user) => Object` — custom JWT payload properties |
| `jwt` | Function | `(user) => Object` — custom JWT sign options merged with the application defaults |

---

### `populateSubjects(hook)`

> To be used as a `before` hook.

Retrieves authorisation subject object(s) from their service and stores them in `hook.params.subjects`.

Specialises [`populateObjects`](./hooks.query.md#populateobjectsoptions) with:
- `serviceField: 'subjectsService'`
- `idField: 'subjects'`
- `throwOnNotFound: true`

---

### `unpopulateSubjects(hook)`

> To be used as an `after` hook.

Removes the `subjects` and `subjectsService` properties set by `populateSubjects` from `hook.params`.

---

### `populateResource(hook)`

> To be used as a `before` hook.

Retrieves the authorisation resource object from its service and stores it in `hook.params.resource`.

Specialises [`populateObject`](./hooks.query.md#populateobjectoptions) with:
- `serviceField: 'resourcesService'`
- `idField: 'resource'`
- `throwOnNotFound: true`

---

### `unpopulateResource(hook)`

> To be used as an `after` hook.

Removes the `resource` and `resourcesService` properties set by `populateResource` from `hook.params`.

---

### `preventEscalation(hook)`

> To be used as a `before` hook.

Prevents privilege escalation during authorisation `create` and `remove` operations. Checks that:
- Users cannot grant permissions higher than their own.
- Users cannot modify or remove subjects whose permissions exceed their own.

By default, only applied to external (provider) requests. Can be overridden with `hook.params.checkEscalation`.

---

### `authorise(hook)`

> Usually used as an app-level `before` hook.

Checks whether the current user has the required CASL abilities to perform the requested operation on the target resource. Builds the ability for the user via the authorisations service, then:
- For `create` and custom methods: checks the data object directly.
- For `find/update/patch/remove`: injects ability constraints into the query so only authorised items are returned.
- For `get/update/patch/remove` with a specific ID: fetches the item first and checks permissions against it.

Sets `hook.params.authorised = true` when access is granted.

> By default, only applies to external (provider) requests. Override with `hook.params.checkAuthorisation`.

---

### `updateAbilities(options?)`

> Returns a hook function.

Updates the CASL abilities cache for a subject after their permissions have changed.

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `subjectAsItem` | boolean | If `true`, the subject is the hook result item (e.g. on the users service). If `false`, uses `hook.params.user`. |
| `fetchSubject` | boolean | If `true`, re-fetches the full subject from the users service before recomputing abilities (useful when the item is a partial patch result). |
