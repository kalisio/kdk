# Application

KDK [core](https://github.com/kalisio/kdk/core) offers a thin layer on top of the [FeathersJS application](https://docs.feathersjs.com/api/application.html) mainly to simplify the creation and configuration of services. It also provide some helpful concepts and utilities to structure your application right.

## Application API

### Backend setup

KDK [core](https://github.com/kalisio/kdk/core) provides a helper to quickly initialize what is required for your [server application](https://docs.feathersjs.com/api/application.html). The core module provides the ability to initialize a new KDK application instance, attach it to the configured database and setup authentication:
```javascript
import { kdk } from '@kalisio/kdk/core.api'

// Initialize app
let app = kdk()
// Connect to DB
await app.db.connect()
```

### Client setup

KDK [core](https://github.com/kalisio/kdk/core) provides a helper to quickly initialize what is required for your [client application](https://docs.feathersjs.com/api/client.html).
```javascript
import { initializeApi } from '@kalisio/kdk/core.client'

// Initialize API wrapper
let api = await initializeApi()
// Retrieve a given service
let users = api.getService('users')
```

You can provide the API initialization with an optional function that could be used to extend the wrapper object with additional features (i.e. properties or methods). This is typically used by the KDK [map](https://github.com/kalisio/kdk/core) submodule:
```javascript
import { initializeApi } from '@kalisio/kdk/core.client'
import { setupApi } from '@kalisio/kdk/map.client'

// Initialize API wrapper with extension function
let api = await initializeApi(setupApi)
```

### Isomorphic features

KDK provides some isomorphic features like the [permission system](./application.md#permissions).
```javascript
import { permissions } from '@kalisio/kdk/core.common'

...
```

### Configuration

Any value from the backend [configuration](../../guides/basics/step-by-step.md#configuring-a-kapp) can be directly retrieved on the application object like this:
```javascript
const value = app.get('property')
```

Any value from the frontend [configuration](../../guides/basics/step-by-step.md#configuring-a-kapp) can be directly retrieved by importing it like this:
```javascript
import config from 'config'

const value = config.property
```

> Under the hood [FeathersJS configuration module](https://github.com/feathersjs/configuration) and [node-config](https://github.com/lorenwest/node-config) are used to manage configuration so that any related concept to organise your configuration according to deployment options can be used.

### getService(name, context)

::: tip
backend/client
:::

Retrieve the given service by its name, should replace [Feathers service method](https://docs.feathersjs.com/api/application.html#servicepath) so that you are abstracted away from the internal service path (i.e. API prefix and context ID) and only refer to it by its "usual" name.

If no context is given, the current context set in the the store will be retrieved (if any) and the associated contextual or global service returned (if any).

> On the client side this will also instanciate the service on the first call by default if not already created (see below).

### createService(name, options)

::: tip
backend/client
:::

Create a new service attached to the application by name and given a set of options in the backend:
* **context**: the context object the service will be contextual to, if given the internal service path will be `contextId/serviceName`
* **modelsPath**: directory where to find model declaration (optional), if provided will initiate a DB service based on the model file
* **modelName**: name of the model file is not named after the service
* **servicesPath**: directory where to find service declaration (optional), if provided for a non-DB service will initiate a service based on the returned object or constructor function from the service module, for a DB service it will apply the provided mixin object coming from the service module
* **fileName**: by default the function will look to a model/service file named after the service name, this option allows to override it
* **events**: [service events](https://feathersjs.com/api/application.html#options) to be used by the service
* **methods**: [service methods](https://feathersjs.com/api/application.html#options) typically useful for [custom methods](https://feathersjs.com/api/services.html#custom-methods)
* **proxy**: options for a service to be proxied by the created service
  * **service**: the name of the proxied service
  * **params**: the parameters to be used when calling the proxied service, either an object or a function returning the object and applied on the input parameters
  * **id**: the id map function to be used when calling the proxied service, will be applied on the input id
  * **data**: the data map function to be used when calling the proxied service, will be applied on the input the object
  * **result**: the result map to be used when calling the proxied service, will be applied on the returning the object(s)

Depending on the options you have to create a *models* and *services* directories containing the required files to declare your services, e.g. your folder/file hierarchy should look like this:
* *index.js*: contains a default function instantiating all the services
* *models* : contains one file per database adapter you'd like to support
  * *serviceName.model.mongodb.js* : exporting the data model managed by your service in [MongoDB](https://docs.feathersjs.com/api/databases/mongodb.html), 
  * *serviceName.model.levelup.js* : exporting the data model managed by your service in [LevelUP](https://github.com/feathersjs/feathers-levelup), 
  * ...
* *services*
  * *serviceName*
    * *serviceName.hooks.js* : exporting the [hooks](https://docs.feathersjs.com/api/hooks.html) of your service, 
    * *serviceName.filters.js* : exporting the [filters](https://docs.feathersjs.com/api/events.html#event-filtering) of your service, 
    * *serviceName.service.js* : exporting the specific mixin or mixin constructor function associated to your service (optional)

By default in Feathers client-side services related to backend services don't have to be explicitely created as it will automatically generate a wrapper on the first access, although using custom methods requires the service to be declared upfront.
However, in the frame of the **KDK**, it is highly recommanded to also use the `createService()` method on the client side to declare any required service and related options:
```js
api.createService('catalog', { methods: [...] })
```

::: tip
backend/client
:::

You can create a new service attached to the application by name and give a set of options in the frontend almost like in the backend:
* **context**: the context object the service will be contextual to, if given the internal service path will be `contextId/serviceName`
* **events**: [service events](https://feathersjs.com/api/application.html#options) to be used by the service
* **methods**: [service methods](https://feathersjs.com/api/application.html#options) typically useful for [custom methods](https://feathersjs.com/api/client/rest.html#custom-methods)
* **hooks**: object defining client-side hooks
* **service**: service object or function like `fn(name, app, options)` generating a serive object

For instance this creates a in-memory service on the frontend:
```js
import { memory } from '@feathersjs/memory'

api.createService('myService', {
  service: memory({
    id: 'name',
    paginate: { default: 12 }
  })
})
```

## Application Hooks

The following [hooks](./HOOKS.MD) are usually globally executed on the application:

![Application hooks](../../.vitepress/public/images/application-hooks.svg)

## Permissions

We provide an isomorphic permissions management system so that user access can be checked:
* at backend level, typically when accessing the API
* at frontend level, typically before constructing the UI

The primary level of a permissions management system is a [Role Based Access Control](https://en.wikipedia.org/wiki/Role-based_access_control) (RBAC), which relies on the grouping of users into various roles which are then assigned rights.
A right is typically made up of an action and a resource type, e.g. role manager can create (action) documents (resource type).
The KDK provide the following default roles, ordered by privilege level:
* `Roles.member`, usually a "standard" user
* `Roles.manager`, usually a "privileged" user
* `Roles.owner`, usually a "superuser" or "administrator"

The secondary level of a permissions management system is an [Attribute Based Access Control](https://en.wikipedia.org/wiki/Attribute-based_access_control) (ABAC), which allows to enforce authorization decisions based on any attribute accessible to your application and not just the user's role. Let's say we'd like to give a specific user access to a specific resource and this resource is created/removed dynamically at run time by your app. RBAC is a legacy access control that usually fails in this kind of dynamic environments. ABAC is more flexible and powerful to support these use cases, and technically ABAC is also capable of enforcing RBAC. This is the reason why the KDK implements this type of access control.

The `create`, respectively `remove`, operation on the `authorisations` service will:
1. add, respectively remove, a privilege or permission level (e.g. `owner` or `manager`)
2. for a subject (i.e. a user in most case but it could be generalized)
3. on a resource (e.g. an organisation).

The permission will be stored directly on the subject (i.e. user) object so that they are already available once authenticated.
They will be organized by resource types (what is called a *scope*) so that a user being the owner of the *feathers* organisation
will be structured like this (*organisations* is an *authorization scope* on the user object):
```javascript
{
  email: 'xxx',
  name: 'xxx',
  organisations: [{
    name: 'feathers',
    _id: ID,
    permissions: 'owner'
  }]
}
```

A hook system allows to register the different rules that should be enforced, [CASL](https://stalniy.github.io/casl/) is used under-the-hood:
```javascript
import { permissions } from '@kalisio/kdk/core.common'

permissions.defineAbilities.registerHook((subject, can, cannot) => {
  if (subject && subject._id) { // Subject can be null on anonymous access
    // Anyone can create new organisations
    can('service', 'organisations')
    can('create', 'organisations')
    if (subject.organisations) { // Check for authorisation scope
      subject.organisations.forEach(organisation => {
        if (organisation._id) {
          // Get user privilege level for this organisation
          const role = permissions.Roles[organisation.permissions]
          if (role >= Roles.member) { // Members have read-only access to organisation
            can('read', 'organisations', { _id: organisation._id })
          }
          if (role >= Roles.manager) { // Manager have read-write access to organisation
            can('update', 'organisations', { _id: organisation._id })
          }
          if (role >= Roles.owner) { // Owners have full access to organisation
            can('remove', 'organisations', { _id: organisation._id })
          }
        }
      })
    }
  }
})
```
The `can/cannot` method requires three arguments to define permissions:
* the first one is the action or the set of actions you're setting the permission for
  * `service` can be used to completely block access to a given service, otherwise specify either
  `get`, `find`, `create`, `update`, `patch`, or `remove` service-level operation
  * `read` is an alias for `get` + `find`
  * `all` is an alias for `read` + `create` + `update` + `remove`
  * `update` is an alias for `patch` as objects are usually only patched due to [perspectives](../README.md#data-model)
* the second one is the name of the resource type (i.e. usually the service) you're setting it on,
* the third one is the conditions to further restrict which resources the permission applies to.

::: warning
It is important to only use database fields for the conditions so it can be used for fetching records.
:::

Once registered, rules can be enforced at API level using the `authorise` application-level hook:
```javascript
import { hooks } from '@kalisio/kdk/core'

app.hooks({
  before: {
    all: [hooks.authorise]
  }
})
```

You will find implementation details [in this article](https://blog.feathersjs.com/access-control-strategies-with-feathersjs-72452268739d).

## i18n

### Client-side internationalization

Internationalization relies on [i18next](https://github.com/i18next/i18next) and its [Vue plugin](https://github.com/panter/vue-i18next). We don't use [component based localization](https://panter.github.io/vue-i18next/guide/component.html) and prefer to use [component interpolation](https://panter.github.io/vue-i18next/guide/component-interpolation.html). Each module/application has its own set of translation files stored in the *client/i18n* folder. To avoid conflicts the convention we use is the following:
* a translation used in multiple components has no prefix
* a translation used in a single component is prefixed by the source component name
* some prefixes are reserved
  * `errors` for error messages
  * `schemas` for labels in JSON schemas

```json
{
  "CANCEL": "Cancel",
  "errors": {
    "400": "Operation cannot be performed: bad parameters",
    ...
  },
  "schemas": {
    "AVATAR_FIELD_LABEL": "Select an avatar",
    ...
  },
  "KScreen": {
    "CLIENT_VERSION": "Client version",
    ...
  }
  ...
}
```

The setup of your application simply consists in providing to the i18n system the resolvers to load all the required translation files, please refer to our [application template](https://github.com/kalisio/kApp/blob/master/src/i18n/index.js).

### Server-side internationalization

Usually translations are only meant to be used at the client level, server errors are converted to client-side translation based on error codes. However, sometimes you need to raise more specific and meaningful error messages from the server, in this case the raised error should contain translation key(s) and context instead of raw message(s), e.g.:

```js
import { BadRequest } from '@feathersjs/errors'

  // Somewhere in a hook or service
  throw new BadRequest('The provided password does not comply to the password policy', {
    translation: {
      key: 'WEAK_PASSWORD',
      params: { failedRules: ... }
    }
  })
```

That way you can generate client-side translation with a generic error handler like in our [application template](https://github.com/kalisio/kApp/blob/master/src/App.vue):

```js
Events.on('error', error => {
  // Translate the message if a translation key exists
  const translation = _.get(error, 'data.translation')
  if (translation) {
    error.message = this.$t('errors.' + translation.key, translation.params)
  } else {
    // Overwrite the message using error code
    if (error.code) {
      error.message = this.$t('errors.' + error.code)
    }
  }
  this.showError(error.message)
})
```