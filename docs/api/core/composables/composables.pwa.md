# PWA

## Overview

`usePwa(options)` manages the Progressive Web App installation prompt and service worker update lifecycle. It wraps the browser's native `beforeinstallprompt` event and the KDK `pwa-updated` event to provide a smooth install and update experience.

> Note: `usePwa` starts listening for the `pwa-updated` event at module load time so that updates triggered before the component mounts are not missed.

## Usage

```javascript
import { usePwa } from '@kalisio/kdk/core.client'

const { installPwa } = usePwa({ updateTimeout: 5000 })
// call installPwa() to show the install prompt e.g. on a button click
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.updateTimeout` | `number` | `5000` | Milliseconds to display the update notification spinner before posting the `SKIP_WAITING` message to the service worker. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `installPwa()` | `Function` | Shows the PWA install prompt dialog (`KPwaPrompt`). Does nothing if: the build mode is not `pwa`, the app is already installed (standalone mode), the app is inside an iframe, or the user has previously dismissed via `LocalStorage`. |

## Lifecycle

- **`mounted`**: removes the module-level `pwa-updated` listener, checks if an update already occurred before mount, and re-registers the listener.
- **`beforeUnmount`**: removes the `pwa-updated` listener.
