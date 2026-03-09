# Mixins

## Base Activity

Make it easier to update the application layout when the user changes his current activity.

> Causes the activity to be automatically refreshed on user' permissions changes or route change.

> More details in [mixins.base-activity](./mixins/mixins.base-activity.md)

## Base Item

Make it easier to setup items displayed by a collection.

> Causes the item actions to be automatically refreshed on user' permissions changes.

> More details in [mixins.base-item](./mixins/mixins.base-item.md)

## Service

Make it easier to access an underlying service.

> More details in [mixins.service](./mixins/mixins.service.md)

## Object Proxy

Make it easier to access an underlying object of a given service.

> More details in [mixins.object-proxy](./mixins/mixins.object-proxy.md)

## Schema Proxy

Make it easier to access an underlying [JSON schema](https://json-schema.org/) object for a given service.

> More details in [mixins.schema-proxy](./mixins/mixins.schema-proxy.md)

## Base Editor

Make it easier to build [editors](./components.md#editors) from props defined on associated mixins. Typically if a JSON schema is directly provided (as a string) it will be parsed, otherwise it will load a schema file which name is computed like this:
* basename is the given schema name or service name
* suffix is `.update` if the `objectId` props is defined or `.create` otherwise
* `-perspective` is added to suffix if the `perspective` props is defined
* extension is always `.json`

For instance, if you set props like this `<my-editor service="users"/>` on your component using the mixins, the `users.create.json` schema file will be loaded. If you set props like this `<my-editor service="users" :objectId="objectId" perspective="profile"/>`, the `users.update-profile.json` schema file will be loaded.

Check out a code example [here](https://github.com/kalisio/kdk/blob/master/core/client/components/editor) to see how to create your own editors.

> More details in [mixins.base-editor](./mixins/mixins.base-editor.md)

## Base Viewer

Make it easier to build [viewers](./components.md#viewers) from props defined on associated mixins.

> More details in [mixins.base-viewer](./mixins/mixins.base-viewer.md)

## Base Field

Make it easier to build [form fields](./components.md#editors).

> More details in [mixins.base-field](./mixins/mixins.base-field.md)

Check out a code example [here](https://github.com/kalisio/kdk/blob/master/core/client/components/form) to see how to create your own fields.

## Base Modal

Make it easier to build [modals](./components.md#modals).

> More details in [mixins.base-modal](./mixins/mixins.base-modal.md)