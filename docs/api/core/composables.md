# Composables

## useStore

Used to setup a reactive store, call **useStore()** with the following arguments:
* **name** unique store name within the application
* **initialStore** initial store content if any

The composable exposes the following:
* **store**: the created store object
* **clear()**: reset store content
* **set(path, value)**: set a store value by path
* **get(path)**: get a store value by path
* **unset(path)**: unset a store value by path
* **has(path)**: test if a store has a value by path
* **forOwn(f)**: call function `f` on each `(value, key)` of the store

## useContext

Used to manage the current context of the application, call **useContext()** with the following arguments:
* **fallbackRoute** the route used to redirect the application when the current context is removed or does not exist

The composable exposes the following:
* **Context**: the current context as a ref
* **setContext(objectOrId)**: clears the current context and set the current context with the provided object or the object corresponding to the given id.
* **clearContext()**: clears the current context
* **getService()**: returns the service used to manage the context

The context service to be used is the one set in the `context.service` property of the [configuration](./application.md#configuration).

> Causes the context to be automatically refreshed on route change.

> Will make the context available in the `context` property of the [global store](./application.md#store).

## useSelection

Used to setup a reactive store for selection items, call **useSelection()** with the following arguments:
* **name** unique store name within the application
* **options** options to setup the store
  * **matches** comparison function to identify two selected items as equal, defaults to Lodash [matches](https://lodash.com/docs/4.17.15#matches)

The composable exposes the following:
* **selection**: the created store object
* **clearSelection()**: reset selection content
* **get/setSelectionMode(mode)**: get current selection mode or switch between `'single'` or `'multiple'` mode
* **get/setSelectionFilter(filter)**: get/set filtering function to avoid selecting certain items
* **selectItem(path)**: select a new item
* **unselectItem(path)**: unselect an item
* **has/getSelectedItem()**, **has/getSelectedItems()**: check for selected item(s) depending on selection mode

## Screen & Layout

### useScreen

Used to watch the screen properties, call **useScreen()** without the following arguments:
* **options** options to setup the `dense` and `wide` [breakpoints](https://quasar.dev/style/breakpoints#introduction)
  * **denseBreakpoint** the breakpoint that sets the maximum screen width below which the `dense` property is true. Default value is `sm`.
  * **wideBreakpoint** the breakpoint that specifies the minimum screen width at which the `wide` property becomes true. Default value is `sm`.

The composable exposes the [properties provide by the Quasar screen plugin](https://quasar.dev/options/screen-plugin/), as well as the following capabilities:
* **dense**: `true` if the screen size is `xs`
* **wide**: `true` if the screen size is greater than `sm`
* **orientation**: `portrait` or `landscape` according the screen orientation
* **Fullscreen**: true if the screen is in fullscreen mode
* **toggleFullscreen**: toggle the fullscreen mode
* **lockOrientation**: locks the screen orientation to either 'portrait' or 'landscape'

### useLayout

Used to manipulate the **layout**, call **useLayout()** without arguments.

The composable exposes the following (**{Placement}** can be **Top**, **Bottom**, **Left**, **Right**):
* **configureLayout(configuration, context)**: apply the layout configuration with provided binding context (i.e. `this`)
* **clearLayout()**: reset layout content
* **setLayoutMode(mode)**: change current layout mode
* **set{Placement}Pane(configuration, context)**: apply the layout configuration to target placement with provided binding context (i.e. `this`)
* **set{Placement}PaneMode(mode)**: change current layout mode of target placement
* **set{Placement}PaneFilter(filter)**: change filter applied on elements of target placement
* **set{Placement}PaneVisible(visible)**: change the visibility of target placement
* **set{Placement}PaneOpener(opener)**: change the visibility of target placement's opener
* **clear{Placement}Layout()**: reset layout content of target placement

## Activity

### useActivity

Used to setup states and options for a new activity, call **useActivity()** with the following arguments:
* **name** unique activity name within the application
* **options** options to setup the activity
  * **selection** `true` to also create a selection store associated with the activity
  * **state** initial state content if any

> Causes the current activity to be automatically reset on unmount.

The composable exposes the following:
* **state**: the store object for activity state
* **options**: the store object for activity options
* **setCurrentActivity(activity)**: set the given component as the current activity
* elements exposed by the [selection composable](./composables#useselection) associated to the activity

### useCurrentActivity

Used to access the current activity, call **useCurrentActivity()** with the following arguments:
* **options** options to retrieve the activity
  * **selection** `true` to also retrieve the selection store associated with the activity
  * **state** initial state content if any

> Causes the current activity to be automatically reset on unmount.

The composable exposes the following:
* **state**: the store object for current activity state
* **options**: the store object for current activity options
* elements exposed by the [selection composable](./composables#useselection) associated to the activity

## Collection

### useCollection

_TODO_

### useCollectionCounter

Used to count the items within a collection. Call **useCollectionCounter** with the following arguments:
* **options** options to define the access to the service 
  * **service** the service name
  * **contextId** the context Id if the service is contextual
  * **baseQuery** the base query to apply
  * **filterQuery** the filter query to apply

::: details  Example
```js
import { composables as kdkComposables } from '@kalisio/kdk/core.client'
...
// Data
const { counter } = kdkComposables.useCollectionCounter({ 
  service: ref('missions'), 
  contextId: ref(props.eventId) 
})
```
:::

### useCollectionTimeRange

Used to get min and max value from a collection. Call **useCollectionTimeRange** with the following arguments:
* **options** options to define the access to the service
  * **service** the service name
  * **contextId** the context Id if the service is contextual
  * **baseQuery** the base query to apply
  * **filterQuery** the filter query to apply
  * **property** the collection property to search on (default: ``createdAt``)
* **return** Object 
  * **start** the min property value
  * **end** the max property value

::: details Example 
```js
import { composables as kdkComposables } from '@kalisio/kdk/core.client'
...
// Data
const { timeRange } = kdkComposables.useCollectionTimeRange({
  service: ref('events'),
  property: ref('updatedAt'),
})
```
:::