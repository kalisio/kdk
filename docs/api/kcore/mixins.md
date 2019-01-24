# Mixins

## Authentication

Provide basic methods to **register(user)**, **login(email, password)**, **logout()**, and **restoreSession()**.

> Will make the currently authenticated user available in the `user` property of the [global store](./application.md#store).

## Authorisation

Compute user' abilities and keeps it up-to-date on user' permissions changes.

> Abilities are stored in the `user.abilities` property of the [global store](./application.md#store).

## Base Activity

Make it easier to update the application layout when the user changes his current activity:
* **clearTitle()/setTitle()** (un)sets the application bar title in store `appBar` property
* **clearActions()/registerAction(type, action)** (un)registers actions to be used by the activity
  * **registerFabAction()** registers actions to be used in action button, `type = 'fab'`
  * **registerTabAction()** registers actions to be used in navigation bar, `type = 'tabBar'`
* **clear/setRightPanelContent(component, content)** (un)sets the application right panel in store `rightPanel` property
* **clear/setSearchBar(field, services)** (un)sets the application search bar in store `searchBar` property
* **clearActivity()** resets actions/title used by the activity
* **refreshActivity()** should be overriden in concrete activities to implement action registration and title - search bar - right panel setup

> Causes the activity to be automatically refreshed on user' permissions changes or route change.

## Base Collection

Used to retrieve items from a specific service and keep track of real-time updates using [RxJS](https://github.com/feathersjs-ecosystem/feathers-reactive):
* **(un)subscribe()** causes the component to (un)subscribe to real-time events
* **refreshCollection()** queries the service to retrive items according to current pagination settings
* **getCollectionBaseQuery()** should be overriden in concrete activities to implement any required parameter in the base query
* **getCollectionFilterQuery()** should be overriden in concrete activities to provide any filtering parameter

> To be used with the [service mixin](./mixins.md#service).

## Base Item

Make it easier to setup items displayed by a collection:
* **clearTitle()/setTitle()** (un)sets the application bar title in store `appBar` property
* **clearActions()/registerAction(type, action)** (un)registers actions to be used on the item
  * **registerPaneAction()** registers actions to be used in item pane, `type = 'pane'`
  * **registerMenuAction()** registers actions to be used in item menu, `type = 'menu'`
* **refreshActions()** should be overriden in concrete items to implement action registration

> Causes the item actions to be automatically refreshed on user' permissions changes.

## Base Context

Retrieve the current context of the application from the **contextId** props, usually set on the target route:
* **clearContext()** clears actions set by the context and context in store
* **refreshContext()** clears the current context if **contextId** is not set or retrieve it if different from current one
* **getActionsForContext()** can be overriden in concrete context-aware components to provide actions required by the context to be set it in the [application bar](./components.md#layout), default behaviour is to get the action list from the configuration `context.actions` property.

The context service to be used is the one set in the `context.service` property of the [configuration](./application.md#configuration).

> Causes the context to be automatically refreshed on route change.

> Will make the context available in the `context` property of the [global store](./application.md#store).

## Base Editor

## Base Field

## Service

Make it easier to access an underlying service from the **contextId** and **service** props:
* **getService()** to retrieve the service object
* **loadService()** causes the service object to be resolved for current properties values
* **serviceFind/Get/Update/Patch/Remove()** to perform [service operations](https://docs.feathersjs.com/api/services.html#service-methods)

## Object

## Schema

## Refs

## Version

