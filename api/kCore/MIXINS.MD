# Mixins

## Authentication [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.authentication.js)

Provide basic methods to perform registration, login, logout, and restore user session.

## Authorisation [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.authorisation.js)

Compute user' abilities and keeps it up-to-date on user' permissions changes.

> Abilities are stored in the `user.abilities` property of the store.

## Activity [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-activity.js)

Makeit easier to update the application layout when the user changes his current activity:
* **clearTitle()/setTitle()** (un)sets the application bar title in store `appBar` property
* **clearActions()/registerAction()()/registerAction()** (un)registers actions to be used by the activity
  * **registerFabAction()** registers actions to be used in action button 
  * **registerTabAction()** registers actions to be used in navigation bar 

> Causes the activity to be automatically refreshed on user' permissions changes.

## Collection [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-collection.js)

## Context [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-context.js)

## Editor [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-editor.js)

## Field [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-field.js)

## Item [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.base-items.js)

## Object [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.object-proxy.js)

## Schema [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.schema-proxy.js)

## Refs [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.refs-resolver.js)

## Service [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.service.js)

## Version [source](https://github.com/kalisio/kCore/blob/master/src/client/mixins/mixin.version.js)

