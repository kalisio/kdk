# User hooks

## Overview

Hooks specific to the users service: access guards, password policy enforcement, password history management, email verification, and account verification token management.

## Functions

### `disallowRegistration(context)`

Helper predicate for use in `iff` hooks. Returns `true` when the `authentication.disallowRegistration` app config flag is set, to block user self-registration.

---

### `allowLocalAuthentication(context)`

Helper predicate for use in `iff` hooks. Returns `true` when `'local'` is included in the `authentication.authStrategies` config array.

---

### `onlyMe(options?)`

> To be used as a `before` hook. Returns a hook function.

Restricts `find`, `patch`, and `remove` queries to only match the currently authenticated user by injecting `query._id = userId` into the query.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `throwOnMissingUser` | boolean | `true` | Throw a `Forbidden` error if no authenticated user is found |

#### Example

```js
import { hooks } from '@kalisio/kdk/core.api.js'
const { onlyMe } = hooks
before: {
  find: [onlyMe()],
  patch: [onlyMe()],
  remove: [onlyMe()]
}
```

---

### `isNotMe(options?)`

Returns a predicate function for use in `iff` hooks. Returns `true` when the target item(s) are **not** the currently authenticated user.

- In `before` hooks: compares `hook.id` against the authenticated user's `_id`.
- In `after` hooks: filters out items that match the authenticated user's `_id` and returns `true` if any non-self items remain.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `throwOnMissingUser` | boolean | `false` | Throw a `Forbidden` error if no authenticated user is found |

#### Example

```js
import { iff, disallow, discard } from 'feathers-hooks-common'
import { hooks } from '@kalisio/kdk/core.api.js'
const { isNotMe } = hooks
before: {
  get: [iff(isNotMe(), disallow())]
},
after: {
  all: [iff(isNotMe(), discard('secret'))]
}
```

---

### `enforcePasswordPolicy(options?)`

> To be used as a `before` hook. Returns a hook function.

Validates the user's new clear-text password against the application password policy (minimum length, character rules, history check). Throws `BadRequest` with translated failure keys when the password does not comply.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `userAsItem` | boolean | — | If `true`, the user object is the hook item; otherwise `hook.params.user` |
| `passwordField` | string | `'clearPassword'` | Path to the clear-text password on the item |
| `previousPasswordsField` | string | `'previousPasswords'` | Path to the hashed password history on the user |

> For more information read about [password policy configuration](../../../guides/basics/step-by-step.md#configuring-a-kapp).

---

### `storePreviousPassword(options?)`

> To be used as a `before` hook. Returns a hook function.

Appends the user's current hashed password to their `previousPasswords` history before a password update. Respects the maximum history length from the password policy (default 5). Requires `hook.params.previousItem` to be populated (e.g. by `populatePreviousObject`).

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `userAsItem` | boolean | — | If `true`, the user object is the hook item; otherwise `hook.params.user` |
| `passwordField` | string | `'password'` | Path to the current hashed password |
| `previousPasswordsField` | string | `'previousPasswords'` | Path to the hashed password history |

> For more information read about [password policy configuration](../../../guides/basics/step-by-step.md#configuring-a-kapp).

---

### `generatePassword(options?)`

> To be used as a `before` hook. Returns a hook function.

Generates a random password that complies with the application password policy and stores it in the `password` field. If a compliant password is already provided in `suggestedPasswordField`, it is used instead.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `passwordField` | string | `'password'` | Field to store the generated/validated password |
| `suggestedPasswordField` | string | `'password'` | Field to read a user-supplied candidate password |

> For more information read about [password policy configuration](../../../guides/basics/step-by-step.md#configuring-a-kapp).

---

### `sendVerificationEmail(hook)`

> To be used as an `after` hook.

Triggers a verification email for a newly created user by calling the account service notifier with `'resendVerifySignup'`. Skipped if the user was registered through an OAuth2 provider.

---

### `addVerification(hook)`

Adds `feathers-authentication-management` verification fields to the user data before creation. Sets `isVerified = true` if the user is registering through an OAuth2 provider (bypassing email verification).

---

### `removeVerification(hook)`

Removes `feathers-authentication-management` verification fields (tokens, expiry dates) from the hook result after they are no longer needed.
