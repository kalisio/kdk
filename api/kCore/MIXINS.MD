# Mixins

## Authentication [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.authentication.js)

Provide basic methods to **register()**, **login()**, **logout()**, and **restoreSession()**.

## Authorisation [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.authorisation.js)

Compute user' abilities and keeps it up-to-date on user' permissions changes.

> Abilities are stored in the `user.abilities` property of the store.

## Activity [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-activity.js)

Make it easier to update the application layout when the user changes his current activity:
* **clearTitle()/setTitle()** (un)sets the application bar title in store `appBar` property
* **clearActions()/registerAction(type, action)** (un)registers actions to be used by the activity
  * **registerFabAction()** registers actions to be used in action button, `type = 'fab'`
  * **registerTabAction()** registers actions to be used in navigation bar, `type = 'tabBar'`
* **clearActivity()** resrt actions/title used by the activity
* **refreshActivity()** should be overriden in concrete activities to implement action registration and title setup

> Causes the activity to be automatically refreshed on user' permissions changes or route change.

## Collection [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-collection.js)

Used to retrieve items from a specific service and keep track of real-time updates using [RxJS](https://github.com/feathersjs-ecosystem/feathers-reactive):
* **refreshCollection()** queries the service to retrive items according to current pagination settings
* **getCollectionBaseQuery()** should be overriden in concrete activities to implement any required parameter in the base query
* **getCollectionFilterQuery()** should be overriden in concrete activities to provide any filtering parameter

> To be used with the [service mixin](./MIXINS.MD#service).

## Context [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-context.js)

## Editor [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-editor.js)

## Field [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-field.js)

## Item [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-items.js)

## Object [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.object-proxy.js)

## Schema [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.schema-proxy.js)

## Refs [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.refs-resolver.js)

## Service [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.service.js)

## Version [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.version.js)

