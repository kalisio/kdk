# Session

## Overview

`useSession(options)` manages the full client session lifecycle: restoring an existing session on mount, redirecting based on route guards and user abilities, and handling socket disconnection/reconnection events with appropriate UI prompts.

It relies on [global guards](../application.md#guards) for route-based redirection and integrates with the KDK authentication flow.

## Usage

```javascript
import { useSession } from '@kalisio/kdk/core.client'

const { isInitialized } = useSession({
  redirect: (route, result, user) => {
    if (!user && route.meta.requiresAuth) return 'login'
  },
  logout: 'home'
})
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.redirect` | `async Function(route, result, user)` | — | Custom redirection function. Receives the current route, the result from the before guard, and the current user. Should return a route name string, a route object, or a falsy value to use default behaviour. |
| `options.logout` | `Function \| string` | — | Called when the user logs out from another client session. A string is treated as a route name to push; a function is called directly. Falls back to the `'logout'` route. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `isInitialized` | `Ref<boolean>` | `true` after the session has been restored and the first redirection evaluated. Guards are registered only after this point. |
| `redirect()` | `async Function` | Re-evaluates route guards and performs redirection. Called automatically on `user-abilities-changed` events. |
| `onReconnectError()` | `Function` | Handles socket reconnection errors by showing the reconnection prompt dialog. |
| `onReconnect()` | `Function` | Handles socket reconnection by dismissing the reconnection prompt and showing a reload prompt. |
| `onRateLimit()` | `Function` | Handles rate-limit events by showing the rate-limit prompt dialog. |

## Lifecycle

- **`mounted`**: registers socket event handlers, subscribes to `user-abilities-changed`, and calls `restoreSession()` followed by `redirect()`.
- **`beforeUnmount`**: removes all socket and event handlers.
