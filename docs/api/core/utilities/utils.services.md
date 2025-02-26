# Services

## Overview

This module provides helper functions to manage recurring tasks on services like binding and unbinding event listeners to track real-time events such as `created`, `updated`, `patched`, and `removed`.

## Functions

### `listenToServiceEvents(service, options, listeners)`

Binds event listeners to a service and stores them in an object.

- **Parameters:**
  - `service` *(string | Object)*: The service instance or name.
  - `options` *(string | Object, optional)**:
    - `context` *(Object, optional)*: Context for retrieving the service if `service` is a string.
    - `created` *(Function, optional)*: Listener for the `created` event.
    - `updated` *(Function, optional)*: Listener for the `updated` event.
    - `patched` *(Function, optional)*: Listener for the `patched` event.
    - `removed` *(Function, optional)*: Listener for the `removed` event.
    - `all` *(Function, optional)*: Listener for all events when no other is given (`created`, `updated`, `patched`, `removed`).
  - `listeners` *(Object, optional)*: The previous object returned from `listenToServiceEvents`, containing event handlers to unbind first.
- **Returns:**
  - An object containing the service and the provided listeners.
  
::: tip Notes
- If `service` is a string, it is resolved using `api.getService(service, context)`.
- The `all` option applies the same function to all event types.
:::

### `unlistenToServiceEvents(listeners)`

Unbinds previously stored listeners from a service. 

After calling `unlistenToServiceEvents`, the service will no longer trigger the specified event listeners.

- **Parameters:**
  - `listeners` *(Object)*: The object returned from `listenToServiceEvents`, containing event handlers.

::: tip Note
Calling `unlistenToServiceEvents` is necessary to prevent memory leaks when event listeners are no longer needed.
:::

## Usage

```javascript
import { listenToServiceEvents, unlistenToServiceEvents } from './utils'

const listeners = listenToServiceEvents('users', {
  created: (data) => console.log('User created:', data),
  updated: (data) => console.log('User updated:', data)
})

// Later, when no longer needed
unlistenToServiceEvents(listeners)
```