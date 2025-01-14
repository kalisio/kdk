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
* **clear/setSearchBar(field, services)** (un)sets the application search bar in store `searchBar` property
* **clear/setLeftDrawer(component, content)** (un)sets the application left drawer in store `leftDrawer` property
* **clear/setRightDrawer(component, content)** (un)sets the application right drawer in store `rightDrawer` property
* **clearActivity()** resets actions/title used by the activity
* **refreshActivity()** should be overridden in concrete activities to implement action registration and title - search bar - right panel setup

> Causes the activity to be automatically refreshed on user' permissions changes or route change.

## Base Collection

Used to retrieve items from a specific service and keep track of real-time updates using [RxJS](https://github.com/feathersjs-ecosystem/feathers-reactive):
* **(un)subscribe()** causes the component to (un)subscribe to real-time events
* **refreshCollection()** queries the service to retrieve items according to current pagination settings
* **getCollectionBaseQuery()** should be overridden in concrete activities to implement any required parameter in the base query
* **getCollectionFilterQuery()** should be overridden in concrete activities to provide any filtering parameter

> To be used with the [service mixin](./mixins.md#service).

## Base Item

Make it easier to setup items displayed by a collection:
* **clearActions()/registerAction(type, action)** (un)registers actions to be used on the item
  * **registerPaneAction()** registers actions to be used in item pane, `type = 'pane'`
  * **registerMenuAction()** registers actions to be used in item menu, `type = 'menu'`
* **refreshActions()** should be overridden in concrete items to implement action registration

> Causes the item actions to be automatically refreshed on user' permissions changes.

## Service Proxy

Make it easier to access an underlying service from the **contextId** and **service** props:
* **getService()** to retrieve the service

## Object Proxy

Make it easier to access an underlying object of a given service from the **objectId** and **perspective** props:
* **getObject()** to retrieve the service object
* **getObjectId()** to retrieve the service object ID
* **loadObject()** causes the service object to be resolved for current properties values

::: tip
If a perspective is configured only that perspective will be retrieved.
:::

::: danger
The [service mixin](./mixins.md#service-proxy) is mandatory when using this mixin.
:::

## Schema Proxy

Make it easier to access an underlying [JSON schema](https://json-schema.org/) object for a given service from the **schema-name**, **service** or **schema-json** props:
* **getSchema()** to retrieve the schema object
* **getSchemaId()** to retrieve the schema object ID
* **getSchemaName()** to retrieve the schema name
* **loadSchema()** causes the schema object to be resolved for current properties values

If a JSON schema is directly provided (as a string) it will be parsed, otherwise it will load a schema file which name is computed like this:
* basename is the given schema name or service name
* suffix is `.update` if the `objectId` props is defined or `.create` otherwise
* `-perspective` is added to suffix if the `perspective` props is defined
* extension is always `.json`

::: warning
This mixin has been designed to be used with the [service mixin](./mixins.md#service-proxy) and the [object mixin](./mixins.md#object-proxy).
:::

For instance, if you set props like this `<my-editor service="users"/>` on your component using the mixins, the `users.create.json` schema file will be loaded. If you set props like this `<my-editor service="users" :objectId="objectId" perspective="profile"/>`, the `users.update-profile.json` schema file will be loaded.

## Base Editor

Make it easier to build [editors](./components.md#editors) from **baseObject** and **baseQuery** props, as well as props defined on associated mixins:
* **getMode()** returns `updated` or `create` depending if the **objectId** props is defined or not
* **fillEditor()** fill all forms with current object values
* **clear()** clear all forms back to default values
* **validateForms()** validate all forms
* **applyForms()** call **apply()** on all forms
* **submittedForms()** call **submitted()** on all forms
* **getBaseObject()** return retrieved object from service or input base object as defined in **baseObject** props, if a perspective is defined through the **perspective** props only that perspective is returned.
* **getBaseQuery()** return input base query as defined in **baseQuery** props, will automatically add object ID and perspective to query if any defined
* **async apply(event, done)** setups all the underlying objects to make it ready for edition
* **refresh()** setups all the underlying objects to make it ready for edition
  1. [load service](./mixins.md#service-proxy) from the **contextId** and **service** props
  2. [load schema](./mixins.md#schema-proxy) from the **schema-name**, **service** or **schema-json** props
  3. [load object](./mixins.md#object-proxy) from the **objectId** and **perspective** props
  4. [load form refs](./mixins.md#refs-resolver) from the set of **refs** that have been defined
  5. [build forms](./components.md#forms)
  6. [fill forms](./components.md#forms)

::: danger
This mixin has been designed to be used with the [service mixin](./mixins.md#service-proxy), the [schema mixin](./mixins.md#schema-proxy), the [object mixin](./mixins.md#object-proxy) and the [refs resolver mixin](./mixins.md#refs-resolver).
:::

::: tip
The **baseObject** props is usually used to keep track of existing or additional "hidden" or "internal" properties in addition to the ones edited throught the form.
:::

Check out a code example [here](https://github.com/kalisio/kdk/blob/master/core/client/components/editor) to see how to create your own editors.

## Base Field

Make it easier to build [form fields](./components.md#editors) from the **properties** and **display** props:
* **emptyModel()** get the default "empty" value of the field, returns an empty string by default
* **clear()** set the current value of the field to be the default one if provided through `properties.field.default`, use "empty" model value otherwise
* **value()** get the current value of the field, simply gets the value from model by default
* **fill(value)** set the current value of the field, simply copies the value as model by default
* **apply (object, field)** applies the current field value on the given target object, simply copies the value in the object by default, to be overloaded if you need to perform specific operations before the form has been submitted
* **submitted (object, field)** does nothing by default, to be overloaded if you need to perform specific operations after the form has been submitted
* **onChanged()** emits the `field-changed` event whenever the field value has changed, consequently the form will validate or invalidate the field, should be binded in template to events like [`blur`](https://quasar.dev/vue-components/input#QInput-API).

[Quasar field components](https://quasar.dev/vue-components/field) are usually used to implement form fields, the given set of computed properties are available to be bound:
* **icon** alias for `properties.field.icon` if `display.icon` is `true`, empty by default
* **label** alias for `properties.field.label` if `display.label` is `true`, empty by default
* **helper** alias for `properties.field.helper`
* **disabled** alias for `properties.field.disabled`, `false` by default
* **hasError** boolean indicating if a validation error has occured
* **errorLabel** alias for `properties.field.errorLabel`, empty by default

::: tip
**label**, **helper** and **errorLabel** properties will be automatically internationalized if corresponding values are valid translation keys.
:::

Check out a code example [here](https://github.com/kalisio/kdk/blob/master/core/client/components/form) to see how to create your own fields.

## Version

Make it easier to display information about client and API versions in applications:
* **refreshVersionNames()** retrieves the version information, it will be stored in `clientVersionName` and `apiVersionName` data variables