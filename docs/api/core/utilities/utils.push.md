# Push

## Overview

The `utils.push.js` module provides a helper for subscribing the current device to web push notifications. It integrates with the [feathers-webpush](https://github.com/kalisio/feathers-webpush) client library and requires the application to run in PWA mode.

## Functions

### `async subscribeToPushNotifications()`

Subscribes the current device to web push notifications and registers the subscription with the authenticated user's account.

**Flow:**
1. Checks that the application is running in PWA mode — aborts if not.
2. Calls `checkPrerequisites()` and `requestNotificationPermission()` — shows an error notification and aborts if either fails.
3. If the device is already subscribed (matching endpoint found in `user.subscriptions`), updates the `lastActivity` timestamp only.
4. Otherwise, creates a new push subscription using the server's VAPID public key, enriches it with device metadata (fingerprint, browser, OS, `lastActivity`), and patches the user's `subscriptions` array.

- **Returns:** `Promise<void>`
- **Requires:** The user must be authenticated before calling this function. The `capabilities.api.vapidPublicKey` must be available in the global store.

```javascript
import { subscribeToPushNotifications } from '@kalisio/kdk/core.client'

// e.g. called when the user enables push notifications
await subscribeToPushNotifications()
```
