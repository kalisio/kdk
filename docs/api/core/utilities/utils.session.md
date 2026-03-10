# Session

## Overview

The `utils.session.js` module provides the core authentication and session management functions for KDK applications. It handles login, logout, session restoration, user ability computation, and remote logout synchronisation.

## Functions

### `async login(email, password)`

Authenticates the user with the local strategy, stores the user object in the global store, and computes their abilities.

- **Parameters:**
  - `email` *(string)*: The user's email address.
  - `password` *(string)*: The user's password.
- **Returns:** `Promise<void>`

### `async register(user)`

Creates a new user account via the `users` service (removing `confirmPassword` first) and then logs them in.

- **Parameters:**
  - `user` *(Object)*: The user data object (must include `email` and `password`).
- **Returns:** `Promise<void>`

### `async logout()`

Logs the user out: removes the cached authentication token, calls `api.logout()`, and clears the user from the global store.

- **Returns:** `Promise<void>`
- **Throws:** Re-throws service errors after cleaning up the local token.

### `async restoreSession()`

Restores a previous session. In offline (disconnected) mode, reads the cached authentication from `LocalCache`. Otherwise, calls `api.reAuthenticate()`. Throws if no valid session can be restored.

- **Returns:** `Promise<void>`
- **Throws:** `Error` if re-authentication fails.

### `async updateAbilities()`

Recomputes the current user's abilities and stores them in `Store('user.abilities')`. Only updates the store if the computed rules have changed.

- **Returns:** `Promise<void>`

### `async updateUser(user)`

Updates the stored user object and recomputes abilities if the given `user._id` matches the currently authenticated user.

- **Parameters:**
  - `user` *(Object)*: The patched user object received from the service.
- **Returns:** `Promise<void>`

### `async logoutUser(user)`

Performs a client-side-only logout in response to a remote logout event (e.g. the user logged out from another device). Clears local authentication state without making a service call.

- **Parameters:**
  - `user` *(Object)*: The user that was logged out.
- **Returns:** `Promise<void>`

### `subscribeToUserChanges()`

Registers `patched` and `logout` event handlers on the `users` service to keep the local user state in sync.

### `unsubscribeToUserChanges()`

Removes the `patched` and `logout` event handlers registered by `subscribeToUserChanges()`.
