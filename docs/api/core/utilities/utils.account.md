# Account

## Overview

The `utils.account.js` module provides helper functions for user account management operations. All functions communicate with the KDK `account` FeathersJS service which is typically backed by [feathers-authentication-management](https://github.com/feathersjs-ecosystem/feathers-authentication-management).

## Functions

### `async verifyEmail(email)`

Checks whether an email address is registered and verified.

- **Parameters:**
  - `email` *(string)*: The email address to verify.
- **Returns:** `Promise<boolean>` — `true` if the service responds with status 200.

### `resendVerifySignup(email)`

Resends the email verification message to the given address.

- **Parameters:**
  - `email` *(string)*: The user's email address.
- **Returns:** `Promise` — the service response.

### `verifySignup(token, email)`

Completes email verification using a short token.

- **Parameters:**
  - `token` *(string)*: The verification token sent by email.
  - `email` *(string)*: The user's email address.
- **Returns:** `Promise` — the service response.

### `sendResetPassword(email)`

Initiates the password reset flow by sending a reset email.

- **Parameters:**
  - `email` *(string)*: The user's email address.
- **Returns:** `Promise` — the service response.

### `resetPassword(email, token, password)`

Completes the password reset using a short token.

- **Parameters:**
  - `email` *(string)*: The user's email address.
  - `token` *(string)*: The reset token sent by email.
  - `password` *(string)*: The new password.
- **Returns:** `Promise` — the service response.

### `changePassword(email, oldPassword, password)`

Changes the user's password, requiring the current password for verification.

- **Parameters:**
  - `email` *(string)*: The user's email address.
  - `oldPassword` *(string)*: The current password.
  - `password` *(string)*: The new password.
- **Returns:** `Promise` — the service response.

### `sendChangeIdentity(oldEmail, email, password)`

Initiates an email (identity) change, requiring the current password for confirmation.

- **Parameters:**
  - `oldEmail` *(string)*: The current email address.
  - `email` *(string)*: The new email address.
  - `password` *(string)*: The user's current password.
- **Returns:** `Promise` — the service response.

### `changeIdentity(token)`

Completes an identity (email) change using a verification token. Delegates to `verifySignup(token)`.

- **Parameters:**
  - `token` *(string)*: The token sent to the new email address.
- **Returns:** `Promise` — the service response.
