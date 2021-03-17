# Components

## Activity

An **activity** is the entry point used in applications for interacting with the user using business specific components. It usually represents a single screen with a user interface. For example, an email app might have one activity that shows a list of new emails, another activity to compose an email, and another activity for reading emails. Although the activities work together to form a cohesive user experience in the email app, each one is independent of the others as much as possible. As such, you should be able to start any one of these activities within the application or from an external application by activating a given [route](https://router.vuejs.org/) (i.e. link/URL).

There is no generic activity component within the core module because activities are usually business/domain-specific components (you might find a lot of them in others modules or in applications). However, it facilitates the interactions between activities and application as you will see hereafter.

## Layout

The basic application layout rely on [Material Design](https://material.io/), as illustred in our [Akt'n'Map](https://github.com/kalisio/aktnmap) application, and is the following:

![Akt'n'Map layout](../../assets/aktnmap-layout.png)

The layout is flexible enough to only use part of it like e.g. the [Kano](https://github.com/kalisio/kano) application which is a map-centered UI with the following layout:

![Kano layout](../../assets/kano-layout.png)

The **k-layout** component based on [QLayout](https://quasar.dev/layout/layout) contains the elements that wrap application's content:
* **k-app-bar**: application bar shown on top of the page - can be overriden using the *header* slot
* **k-side-nav** : a left side navigation panel (which is shown alongside page content on wide screens) - can be overriden using the *left* slot
* **k-right-panel** : a right side panel (which can be shown alongside page content on wide screens) - can be overriden using the *right* slot
* **k-tab-bar**: a navigation with [QTabs](https://quasar.dev/vue-components/tabs) - can be overriden using the *navigation* slot
* **k-fab**: an action button based on a [Quasar Floating Action Button](https://quasar.dev/layout/floating-action-button) at the bottom right corner of the page
* **k-search-bar**: a global search bar
* the embedded content of the page (i.e. the **Activity**) as a [router-view](https://router.vuejs.org/api/#router-view)

::: tip
The application layout is usually wrapped using the **k-home** component that simply load it depending on the authentication state of the user.
:::

Some layout components are fixed for the entire application lifecycle, as such they read their own setup from the [application configuration](../../guides/basics/step-by-step.md#frontend-side): layout, home, side navigation.

Some components are more dynamic and support to be updated depending on the current activity of the user: application bar, tab bar search bar, right panel, FAB. In this case the configuration is read from the [global store](./application.md#store) and any change watched to keep the components in sync.

::: tip
The best thing to do to learn how to configure your application is to have a look to the config files of our production applications like [Akt'n'Map](https://github.com/kalisio/aktnmap/blob/master/config/default.js) and [Kano](https://github.com/kalisio/kano/blob/master/config/default.js)
:::

## Collections

Most activities are used to list, search, edit (i.e. update) and remove data model items. To avoid a lot of boilerplate code the KDK provides you with built-in components to manage item collections either as list or grid as shown below:

![Item collections](../../assets/item-collections.png)

### List

The **k-list** component is powered by [Quasar lists](https://quasar.dev/vue-components/list-and-list-items) and [Quasar pagination](https://quasar.dev/vue-components/pagination). It also relies on the [service](./mixins.md#service) and [collection](./mixins.md#collection) mixins to manage its internal behaviour.

The following properties can be used to customize it:
* **renderer**:
  * **component**: the component to be used to render items (defaults to `collection/KItem`)
  * **options**: options of the rendrer,
  * **props**: properties to be bound to the item components
* **baseQuery**: the base query to be used when retrieving items from the target service
* **filterQuery**: the additional query parameters to be used to filter items according to current search criteria
* **listStrategy**: the update strategy used under the hood by [feathers-reactive](https://github.com/feathersjs-ecosystem/feathers-reactive)

The default **k-item** component is powered by the [base item mixin](./mixins.md#base-item) and provides you with the following properties:
* **item**: the object to be displayed
* **itemActions**: the list of actions available on the object, each action been described as
  * **label**: action label in the action menu
  * **route**: route to be pushed when action is triggerred
  * **handler**: function to be called when action is triggerred
* **options**: 
  * **icon**: icon to be used
  * **color**: icon color to be used
  * **avatar**: avatar image to be used
  * **nameField**: the name or path of the property used to retrieve the displayed name on the object, defaults to `name`
  * **descriptionField**: the name or path of the property used to retrieve the displayed description on the object, defaults to `description`
  
The default **k-item** component also provides you with the following slots will you need more customisation:
* `item-icon` or `item-avatar` to override icon or avatar section
* `item-content` to override content section
* `item-label` and `item-sublabel` to override labels section
* `item-actions` to override actions section

### Grid

The **k-grid** component is powered by [Flex](https://quasar.dev/layout/grid/introduction-to-flexbox), [Quasar cards](https://quasar.dev/vue-components/card) and [Quasar pagination](https://quasar.dev/vue-components/pagination). It also relies on the [service](./mixins.md#service) and [collection](./mixins.md#collection) mixins to manage its internal behaviour.

The same properties as with the **k-list** component can be used to customize it, the component to be used to render items defaults to `collection/KCard`.

The default **k-card** component is powered by the [base item mixin](./mixins.md#base-item) and provides you with the same properties as the **k-item** component but available slots are the following:
* `card-title` to override title section
* `card-icon` to override icon section
* `card-tags` to override tags section
* `card-content` to override content section
* `card-actions` to override actions section

However options of the **itemActions** are more complex:
* **pane**: the list of actions displayed in the pane, each action been described as
  * **name**: unique action name/ID
  * **icon**: action icon
  * **label**: action label in the action menu
  * **route**: route to be pushed when action is triggerred
  * **handler**: function to be called when action is triggerred
* **menu**: the list of actions displayed in the menu, each action been described as above

## Forms 

The **k-form** is a generic form component capable of building HTML forms from of a [JSON schema](https://json-schema.org/). Moreover **k-form** validates that the data is conformed to the schema using [AJV validator](https://github.com/epoberezkin/ajv). 

A schema must have the following convention:
* a `$schema` property specifying the version of the schema
* a `$id` property specifying the id of the schema. It is mainly used by **AJV** to cache the schema.
* a `title` property specifying the title of the form. It is used by the **Editors**.
* a `description` property providing a brief description of the usage of the schema
* a `type` which must be `object`
* a `properties` property which define the list of the fields of the form. To each object is assigned a field. The name of the field is the name of the object and the properties are used to provide the characteristics of the field. A `field` sub-object provides the UI characteristic to assign to the field: the component to be used for the rendering as well as the properties to apply to this component.
* `required` property to define the required fields. You must specify the name of the fields.

As an example, here is a schema defining a basic form asking for an `email` and a `password`:

```json
{
  "$schema": "http://json-schema.org/draft-06/schema#",
  "$id": "A unique identifier",
  "title": "The title of the schema", 
  "description": "A description of the schema", 
  "type": "object",
  "properties": {
     "email": {
      "type": "string",
      "format": "email",
      "field": {
        "component": "form/KTextEmail",
        "helper": "schemas.EMAIL_FIELD_HELPER"
      }
    }
    "password": {
      "type": "string", 
      "field": {
        "component": "form/KTextPassword",
        "helper": "schemas.PASSWORD_FIELD_HELPER"
      }
    }
  },
  "required": ["name", "password"]
}
```

The **KDK** comes with a set of built-in fields:
* **k-attachment-field**: an input used to upload a document
* **k-chips-field**: a basic chips input based on Quasar [Select input](https://quasar.dev/vue-components/select)
* **k-chips-with-icon-field**: extends the previous chips input in 
* **k-datetime-field**: a Quasar [Date input](https://quasar.dev/vue-components/date) and [Time input](https://quasar.dev/vue-components/time)
* **k-email-field**: a Quasar [Text input](https://quasar.dev/vue-components/input) of type of `email`
* **k-icon-field**: an input that allows you to select an icon and to assign it a color among. The list of icons is provided by [FontAwesome](https://fontawesome.com/icons?d=gallery)
* **k-item-field**: an input that allows you to select one or multiple items from one service or many services.
* **k-number-field**: a Quasar [Text input](https://quasar.dev/vue-components/input) of type of `number`
* **k-options-field**: a Quasar [Options group input](https://quasar.dev/vue-components/option-group)
* **k-phone-field**: a Quasar [Text input](https://quasar.dev/vue-components/input) of type of `phone`
* **k-select-field**:  a Quasar [Select input](https://quasar.dev/vue-components/select)
* **k-tag-field**: an input that allows you to define a set of tags
* **k-textarea-field**: a Quasar [Text input](https://quasar.dev/vue-components/input) of type of `textarea`
* **k-text-field**: a Quasar [Text input](https://quasar.dev/vue-components/input) of type of `text`
* **k-toggle-field**: a Quasar [Toggle input](https://quasar.dev/vue-components/toggle)
* **k-url-field**: a Quasar [Text input](https://quasar.dev/vue-components/input) of type of `url`

You can add additional ones, for instance, the **map** submodule provides the [**k-location-field**](../map/components.md#location). You can also add your own field, when implementing it you must rely on the [base field mixin](./mixins.md#base-field). 

The properties to declare  a **k-form** are the following:
* **schema**: the schema object to be used to build the form
* **clearOnCreate**: boolean indicating if the form should be cleared on creation
* **display**: the options to be used when displaying the fields. You can specify:
  * **icon**: a boolean value to tell whether an icon has to be displayed or not in front of each field
  * **label**: a boolean value to tell whether the field label have to be displayed or not in front of each field
  * **labelWidth**: the width used to display the label. Out of 12 grid points, how much should the label take? Default is 5. Minimum is 1 and maximum is 11

::: tip
Because, the **k-form** loads dynamically the required components to build the form, it is mandatory to use use a reference to the form using the keyword `ref` and the [**refs resolver mixin**](./mixins.md#refs-resolver) to wait for the components to be loaded before applying any methods.
:::

The **k-form** components exhibits the following methods:
* **getField(name)** get a field component by its name
* **build()** dynamically build the required field components and internal validator
* **fill(values)** fill the form with given object values
* **clear()** clear the form back to default values
* **validate()** validate the form
* **apply(object)** call **apply()** on all field components
* **submitted(object)** call **submitted()** on all field components

::: tip
If the **schema** props is defined on creation the form will automatically build itself and emit the `form-ready` event.
:::

## Editors

The **Editors** are built-in editors that allow you to create/edit an object/perspective using a **k-form**. Thus we distinguish the following modes:
* the `create` mode allows you to create a new object
* the `update` mode allows you to edit an existing object or a perspective. In that case you must provide to the **editor** the **object id** of the object to edit and the **perspective name** if wanted.

The **KDK** comes with 2 types of editor:
* the **k-editor** which is rendered within the parent container
* the **k-modal-editor** which is rendered within a modal widget

Both components depend on different [mixins](./mixins.md) according to the following lifecycle:

![Editor lifecycle](../../assets/editor-lifecycle.png)

### k-editor

The following example shows how to edit the **profile** perspective of a user (service **users**):

```html
<k-editor service="users" :objectId="objectId" perspective="profile"/>
```

where **k-editor** has been declared with the following code:

```js
this.$options.components['k-editor'] = this.$load('editor/KEditor')
```

The properties to declare a **k-editor** are the following:
* **objectId**: the Id of the object to edit. If not defined, the editor is in the `create` mode
* **perspective**: the perspective of the object to edit
* **schemaName**: the name of the schema to be used to build the corresponding **k-form**. If you do not provide any name, the **editors** will search for a schema with the name:
  * in `create` mode: `<service>-create.json`
  * in `update` mode: `<service>-update.json`
* **baseObject**: an default object to be used to keep track of existing additional properties to the ones edited through the form 
* **baseQuery**: a query to be executed to customize the access to the service
* **clearButton**: the label of the clear button. When clearing the editor, all the fields are emptied. By default the property is empty and the button is not rendered.
* **resetButton**: the label of the reset button. When resetting the editor, the form is filled with the default object. By default the property is empty and the button is not rendered.

::: warning
Schemas are usually stored in a specific folder and you must have tell **Webpack** to look in this folder when searching for a schema.
::: 

### k-modal-editor

There are 2 ways to use the **k-modal-editor**:
* by declaring the **k-modal-editor** directly in the parent component. Check out the code example [here](https://github.com/kalisio/kdk/blob/master/core/client/components/KOrganisationsPanel.vue)
* by declaring a route using the the **KModalEditor**. In this case you must:
  * in the template section, define a `router-view` with the following properties:
    *  the targeted `service`
  
```html
<div>
  ....
  <router-view service="groups"></router-view>
</div>
```
  
```js
  router () {
    return {
      onApply: { name: 'groups-activity', params: { contextId: this.contextId } },
      onDismiss: { name: 'groups-activity', params: { contextId: this.contextId } }
    }
  }
```

  *  define a function that trigger the navigation to the editor route, usually an action within an activity:

```js
 this.registerFabAction({
    name: 'create-group',
    label: this.$t('KGroupsActivity.CREATE_GROUP_LABEL'),
    icon: 'add',
    route: { name: 'create-group', params: { contextId: this.contextId } }
  })
```

  *  define the corresponding route with:
     * the `name` of the route
     * the `component` property set to **editor/KModalEditor** 
     * the `props` property set to to `true`

```js
'groups': {
  name: 'groups-activity',
  component: 'KGroupsActivity',
  props: true,
  children: {
  'create': { name: 'create-group', component: 'editor/KModalEditor', props: true },
  'edit/:objectId': { name: 'edit-group', component: 'editor/KModalEditor', props: true }
}
```

The properties to declare a **k-modal-editor** are identical to those of the **k-modal-editor** plus: 
 * **router**: the router function to be triggered when the editor is getting closed. 

## Authentication

The KDK provides you with some default forms to manage login, logout, registration and server endpoint configuration for mobile apps in the [authentication folder](https://github.com/kalisio/kdk/tree/master/core/client/components/authentication).

## User Account

The KDK provides you with a default [activity](./components.md#activity) to manage user accounts in the [account folder](https://github.com/kalisio/kdk/tree/master/core/client/components/account):
* an "identity panel" to edit profile information
* a "danger zone" for account removal
* a "security zone" for password and email change

