# Welcome

## Overview

`useWelcome()` displays a welcome prompt dialog (`KWelcomePrompt`) automatically after each login and hides it on logout. It respects a user preference stored in `LocalStorage` (key `'welcome'`) and a configuration flag (`config.layout.welcome`, default `true`).

## Usage

```javascript
import { useWelcome } from '@kalisio/kdk/core.client'

// Typically called once in the root App or layout component
useWelcome()
```

No return value is exposed — the composable operates entirely through side effects.

## Behaviour

- After a successful login (`api` emits `'login'`), shows the `KWelcomePrompt` dialog — unless `LocalStorage.get('welcome')` is `false` or `config.layout.welcome` is `false`.
- After a logout (`api` emits `'logout'`), dismisses the dialog if it is open.

## Lifecycle

- **`beforeUnmount`**: removes the `login` and `logout` API event listeners.
