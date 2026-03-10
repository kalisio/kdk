# Authentication hooks

## Overview

Hooks related to authentication: password hashing and discarding third-party authentication provider fields from responses.

## Functions

### `hashPassword`

Re-exported from `@feathersjs/authentication-local`. Hashes the `password` field on hook items before they are stored. Should be used as a `before create/update/patch` hook on the users service.

---

### `discardAuthenticationProviders(hook)`

> Usually used as an `after all` hook.

Removes all third-party OAuth provider fields (e.g. `googleId`, `githubId`) from hook items. The list of providers is read from `hook.app.authenticationProviders`. Prevents leaking provider-specific tokens or identifiers to clients.
