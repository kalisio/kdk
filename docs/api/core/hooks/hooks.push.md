# Push hooks

## Overview

Hooks for the push notification service: controlling external access and sending security alert emails on new device subscriptions.

## Functions

### `disallowExternalPush(hook)`

Helper predicate for use in `iff` hooks. Returns the value of the `push.disallowExternalPush` app config flag (defaults to `true`). When `true`, external clients are blocked from calling the push service directly.

---

### `sendNewSubscriptionEmail(hook)`

> To be used as an `after` hook.

Sends a security alert email to the user when a push notification subscription from a new device fingerprint is detected. Compares the current user's subscriptions (from `hook.result`) against the previous user object (from `hook.params.user`) to identify new fingerprints.

Uses the [mailer service](../services/mailer.md) and an email template from `mailerService.options.templateDir/newSubscription`. Errors during email sending are caught and logged without failing the hook chain.
