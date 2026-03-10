# Local settings service

This **client-side** service allows restoring and saving persistent settings to/from the [global store](../application.md#store) from/to [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

::: warning
`get` and `patch` are the only methods allowed. The `id` parameter is ignored — methods always target the whole settings object.
:::

::: warning
This service must be instantiated at application level. None is provided by default.
:::

## Overview

`LocalSettingsService` bridges the Feathers service interface with the browser's `localStorage`. It maps named service properties to paths in the global store via a `propertyMapping` configuration, enabling settings to be edited through the [editor system](../components.md#editors) and persisted across sessions.

## Usage

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

## JSON Schema example

Because settings are available through a service interface, they can be edited using the [editor system](../components.md#editors). The `propertyMapping` is used to match form field names and corresponding global store properties:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://www.kalisio.xyz/schemas/settings.update.json#",
  "title": "schemas.UPDATE_SETTINGS_TITLE",
  "type": "object",
  "properties": {
    "x": {
      "type": "string",
      "field": {
        "component": "form/KTextField",
        "helper": "schemas.X_FIELD_LABEL"
      }
    }
  },
  "required": ["x"]
}
```
