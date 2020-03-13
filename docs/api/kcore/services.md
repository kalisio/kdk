# Services

## Users service

::: tip
Available as a global service
:::

### Data model

The data model of a user as used by the API is [detailed here](../../architecture/data-model-view.md#user-data-model).

### Hooks

The following [hooks](./hooks.md) are executed on the `users` service:
![Users hooks](../../assets/users-hooks.png)

## Authorisations service

::: tip
Available as a global service
:::

::: warning
`create` and `remove` methods are the only one allowed from the client/server side
:::

### Data model

No data model, authorisations are directly stored on target subject(s).

### Hooks

The following [hooks](./hooks.md) are executed on the `authorisations` service:

![Authorisations hooks](../../assets/authorisations-hooks.png)

## Tags service

::: tip
Available as a global and a contextual service
:::

::: warning
`update` method is not available
`get`, `patch` methods are only allowed from the server side
clients can only `create`, `remove` and `find` tags
:::

### Data model

The data model of a user as used by the API is [detailed here](../../architecture/data-model-view.md#tag-data-model).

### Hooks

The following [hooks](./hooks.md) are executed on the `tags` service:

![Tags hooks](../../assets/tags-hooks.png)

## Storage service

::: tip
Available as a global and a contextual service
:::

::: warning
`get`, `create` and `remove` methods are the only one allowed from the client/server side
:::

This service heavily relies on [feathers-blob](https://github.com/feathersjs-ecosystem/feathers-blob) and [multer](https://github.com/expressjs/multer) for handling [multipart/form-data](https://docs.feathersjs.com/guides/advanced/file-uploading.html#feathers-blob-with-multipart-support).

### Data model

No data model, data are directly stored on target storage backend (i.e. AWS S3).

### Hooks

The following [hooks](./hooks.md) are executed on the `storage` service:

![Storage hooks](../../assets/storage-hooks.png)

## Local settings service

This **client-side** service allows to restore/save persistent settings to/from the [global store](./application.md#store) from/to [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

::: warning
`get` and `patch` methods are the only one allowed, `id` parameter is ignored and methods will always target the whole settings object
:::

::: warning
This service has to be instanciated at application level, none provided by default
:::

To create your own service use the following code:
```js
import { Store, LocalSettingsService } from '@kalisio/kdk/core.client'

// Setup defaults in global store
Store.set('app-settings', { x: y, ... })
// Create a service targeting only settings in store
const settingsService = api.createService('settings', {
  service: LocalSettingsService,
  propertyMapping: {
    x: 'app-settings.x',
    ...
  }
})
// Restore previous settings from local storage if any
settingsService.restoreSettings()
```

::: tip
Because settings are available through a service interface you can edit it using the [editor system](./components.md#editors). The `propertyMapping` will be used to match form field names and corresponding global store properties.
:::

For instance the following schema can be used to edit the previous sample:
```json
{
  "$schema": "http://json-schema.org/draft-06/schema#",
  "$id": "http://www.kalisio.xyz/schemas/settings.update.json#",
  "title": "schemas.UPDATE_SETTINGS_TITLE",
  "type": "object",
  "properties": {
    "x": {
      "type": "string", 
      "field": {
        "component": "form/KTextField",
        "helper": "schemas.X_FIELD_HELPER"
      }
    }
  },
  "required": ["x"]
}

```