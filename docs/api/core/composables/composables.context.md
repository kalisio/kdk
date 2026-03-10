# Context

## Overview

`useContext(options)` manages the current application context — a single object (e.g. an organisation or project) that scopes the rest of the application. It keeps the context in sync with the backend by listening to `patched` and `removed` service events, and redirects to a fallback route when the context is deleted.

The context service name is configured via the `context.service` property in the [application configuration](../application.md#configuration).

> Makes the context available in the `context` property of the [global store](../application.md#store).

## Usage

```javascript
import { useContext } from '@kalisio/kdk/core.client'

const { Context, setContext, clearContext, getService } = useContext({ fallbackRoute: 'home' })
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.fallbackRoute` | `string` | `'home'` | Name of the route to navigate to when the context is removed or cannot be loaded. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `Context` | `readonly Ref<Object \| null>` | The current context object, or `null` when none is set. Reactive — components using it will update automatically. |
| `getService()` | `Function` | Returns the FeathersJS service used to manage the context. |
| `setContext(objectOrId)` | `async Function` | Sets the context. Accepts either an object (used directly) or a string ID (fetched from the service). Clears any previous context first. Navigates to `fallbackRoute` after 2 seconds if fetching by ID fails. |
| `clearContext()` | `Function` | Clears the current context and stops tracking service events. |
