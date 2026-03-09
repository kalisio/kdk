# Service

## Overview

The `service` mixin provides a component with a reactive `service` prop and a helper method to retrieve the corresponding FeathersJS service instance from the KDK API. It is the foundation for all mixins and components that need to communicate with a backend service.

## Usage

```javascript
import { service } from '@kalisio/kdk/core/client'

export default {
  mixins: [service],
  // ...
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `service` | `String` | `''` | The name of the FeathersJS service to target. |

## Methods

### `getService()`

Retrieves the FeathersJS service instance registered under the `service` prop name.

- **Returns:** the FeathersJS service object.
- **Throws:** `Error` if no service is found for the given name.

```javascript
const usersService = this.getService() // equivalent to api.getService(this.service)
const users = await usersService.find({ query: { role: 'admin' } })
```

::: tip
This mixin is a prerequisite for the [Object Proxy](./mixins.object-proxy.md), [Schema Proxy](./mixins.schema-proxy.md), [Base Editor](./mixins.base-editor.md), and [Base Viewer](./mixins.base-viewer.md) mixins.
:::
