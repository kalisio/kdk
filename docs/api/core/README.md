# Overview

The core module includes basic features to create a backend [application](./application.md) and related [services](./services.md) for e.g. [users management](./services.md#users-service), [database](./services.md#database-service), [storage](./services.md#storage-service) management, ...

The core module also includes basic features to create a frontend application: services access layer (mainly based on [mixins](./mixins.md)), [authentication components](./components.md), [application layout](./components.md#layout), [item collection components](./components.md#collections), [form and editor components](./components.md#forms-and-editors).

## Utilities

### Functions

Here are a set of utility functions:
* **createQuerablePromise (promiseOrExecutor)** modify a Promise by adding some status functions (`isFulfilled, isPending, isRejected`)
* **getPaletteFromColor (color)** convert from hexadecimal color value to color name in basic [Quasar palette](https://quasar.dev/style/color-palette)
* **getColorFromPalette (color)** convert from color name  in basic [Quasar palette](https://quasar.dev/style/color-palette) to color hexadecimal value
* **getLocale ()** find the current user's locale
* **isEmailValid (email)** emails validator
* **isObjectID (id)** ObjectID validator
* **getIconName (object, path = 'icon.name')** extract icon name from a given icon property on a given target object
* **dotify (object)** transform nested object to dot notation

### Store objects

The [global store](../core/application.md#store) contains the following defaults objects:
```js
topPane: { content: [current pane content], mode: 'current pane mode', filter: { curent content filter }, visible: current visibility state }
rightPane: { content: [current pane content], mode: 'current pane mode', filter: { curent content filter }, visible: current visibility state }
bottomPane: { content: [current pane content], mode: 'current pane mode', filter: { curent content filter }, visible: current visibility state }
page: { content: [current page content], mode: 'current pane mode', filter: { curent content filter } }
window: { current: 'current widget', widgets: [available widgets], filter: { curent widgets filter } }
fab: { actions: [current actions], filter: { curent actions filter } }
```

> More details in the [layout section](./components.md#layout)

### Layout

Global object used to build the layout content:
```js
import { Layout } from '@kalisio/kdk/core.client'
// Bind a UI configuration to a target component
Layout.bindContent([{
	id: 'action', icon: 'las la-eye-dropper', label: 'MyActivity.ACTION_LABEL', handler: 'onAction'
}], myComponent)
```