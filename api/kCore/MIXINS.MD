# Mixins

## Authentication [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.authentication.js)

Provide basic methods to **register(user)**, **login(email, password)**, **logout()**, and **restoreSession()**.

> Will make the currently authenticated user available in the `user` property of the [global store](./APPLICATION.MD#store).

## Authorisation [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.authorisation.js)

Compute user' abilities and keeps it up-to-date on user' permissions changes.

> Abilities are stored in the `user.abilities` property of the [global store](./APPLICATION.MD#store).

## Activity [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-activity.js)

Make it easier to update the application layout when the user changes his current activity:
* **clearTitle()/setTitle()** (un)sets the application bar title in store `appBar` property
* **clearActions()/registerAction(type, action)** (un)registers actions to be used by the activity
  * **registerFabAction()** registers actions to be used in action button, `type = 'fab'`
  * **registerTabAction()** registers actions to be used in navigation bar, `type = 'tabBar'`
* **clearActivity()** resets actions/title used by the activity
* **refreshActivity()** should be overriden in concrete activities to implement action registration and title setup

> Causes the activity to be automatically refreshed on user' permissions changes or route change.

## Collection [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-collection.js)

Used to retrieve items from a specific service and keep track of real-time updates using [RxJS](https://github.com/feathersjs-ecosystem/feathers-reactive):
* **refreshCollection()** queries the service to retrive items according to current pagination settings
* **getCollectionBaseQuery()** should be overriden in concrete activities to implement any required parameter in the base query
* **getCollectionFilterQuery()** should be overriden in concrete activities to provide any filtering parameter

> To be used with the [service mixin](./MIXINS.MD#service).

## Context [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-context.js)

Retrieve the current context of the application from the **contextId** props, usually set on the target route:
* **clearContext()** clears actions set by the context and context in store
* **refreshContext()** clears the current context if **contextId** is not set or retrieve it if different from current one
* **getActionsForContext()** can be overriden in concrete context-aware components to provide actions required by the context to be set it in the [application bar](./COMPONENTS.MD#k-app-bar), default behaviour is to get the action list from the configuration `context.actions` property.

The context service to be used is the one set in the `context.service` property of the [configuration](./APPLICATION.MD#configuration-1).

> Causes the context to be automatically refreshed on route change.

> Will make the context available in the `context` property of the [global store](./APPLICATION.MD#store).

## Editor [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-editor.js)

## Field [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-field.js)

## Item [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-items.js)

## Object [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.object-proxy.js)

## Schema [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.schema-proxy.js)

## Refs [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.refs-resolver.js)

## Service [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.service.js)

## Version [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.version.js)

