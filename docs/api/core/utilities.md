# Utilities

Here are a set of utility functions:
* **createQuerablePromise (promiseOrExecutor)** modify a Promise by adding some status functions (`isFulfilled, isPending, isRejected`)
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

### [utils.collection](./utilities/utils.collection.md)
### [utils.colors](./utilities/utils.colors.md)
### [utils.locale](./utilities/utils.locale.md)
### [utils.screen](./utilities/utils.screen.md)
### [utils.services](./utilities/utils.services.md)
