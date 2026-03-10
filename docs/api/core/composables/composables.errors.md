# Errors

## Overview

`useErrors()` sets up a centralised error display handler for a component. It listens to the global `error` event bus, translates error messages using i18n, and displays Quasar notifications. It also handles errors embedded in route query parameters (e.g. OAuth callback errors).

## Usage

```javascript
import { useErrors } from '@kalisio/kdk/core.client'

// Typically called once in the root App component
const { showError } = useErrors()
```

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `showError(error, options?)` | `Function` | Displays an error as a Quasar `negative` notification. If `error.ignore` is `true`, only logs to console. If `error.retryHandler` is set, adds a **Retry** action to the notification with a 20-second timeout. `options.html` (default `true`) controls HTML rendering in the message. |
| `showRouteError(route)` | `Function` | Inspects `route.query.error_message`, `route.query.error`, and `route.params.token` for embedded error information and displays it. HTML is disabled to prevent XSS. |

## Lifecycle

- **`mounted`**: calls `showRouteError` for the current route, subscribes to the global `error-hook` event (forwarding non-`TokenExpiredError` errors), and subscribes to the global `error` event (translating messages via `errors.*` i18n keys before displaying).
- Watches the current route and calls `showRouteError` on each navigation.
