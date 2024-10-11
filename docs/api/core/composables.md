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

## useCollection

_TODO_