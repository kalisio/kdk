# Application

Kalisio [core module](https://github.com/kalisio/kCore) offers a thin layer on top of the [FeathersJS application](https://docs.feathersjs.com/api/application.html) mainly to simplify the creation and configuration of services. It also provide some helpful concepts and utilities to structure your application right.

## Application API

### Backend setup

Kalisio [core module](https://github.com/kalisio/kCore) provides a helper to quickly initialize what is required for your [server application](https://docs.feathersjs.com/api/application.html). The core module provides the ability to initialize a new Kalisio application instance, attach it to the configured database and setup authentication:
```javascript
import { kalisio } from 'kCore'

// Initialize app
let app = kalisio()
// Connect to DB
await app.db.connect()
```

### Client setup

Kalisio [core module](https://github.com/kalisio/kCore) provides a helper to quickly initialize what is required for your [client application](https://docs.feathersjs.com/api/client.html).
```javascript
import { kalisio } from 'kCore/client'

// Initialize API wrapper
let api = kalisio()
// Retrieve a given service
let users = api.getService('users')
```

### Configuration

Any value from the backend [configuration](../../guides/basics/step-by-step.md#configuring-the-app) can be directly retrieved on the application object like this:
```javascript
const value = app.get('property')
```

Any value from the frontend [configuration](../../guides/basics/step-by-step.md#configuring-the-app) can be directly retrieved by importing it like this:
```javascript
import config from 'config'

const value = config.property
```

> Under the hood [FeathersJS configuration module](https://github.com/feathersjs/configuration) and [node-config](https://github.com/lorenwest/node-config) are used to manage configuration so that any related concept to organise your configuration according to deployment options can be used.

### .getService(name) - backend/client

Retrieve the given service by name, should replace [Feathers service method](https://docs.feathersjs.com/api/application.html#servicepath) so that you are abstracted away from service path (i.e. API prefix) and only refer to it by internal name.

> On the client side this is also used to instanciate the service on first call.

### .createService(name, options) - backend only

Create a new service attached to the application by name and given a set of options:
* **modelsPath**: directory where to find model declaration (optional), if provided will initiate a DB service based on the model
* **servicesPath**: directory where to find service declaration (optional), if provided for a non-DB service will initiate a service based on the returned object or constructor function from the service module, for a DB service it will apply the provided mixin object coming from the service module
* **proxy**: options for a service to be proxied by the created service
  * **service**: the name of the proxied service
  * **params**: the parameters to be used when calling the proxied service, either an object or a function returning the object and applied on the input parameters
  * **id**: the id map function to be used when calling the proxied service, will be applied on the input id
  * **data**: the data map function to be used when calling the proxied service, will be applied on the input the object
  * **result**: the result map to be used when calling the proxied service, will be applied on the returning the object(s)
* **perspectives**: the *perspectives* of the model that will not be retrieved by default except if [`$select`](https://docs.feathersjs.com/api/databases/querying.html#select) is used

Depending on the options you have to create a *models* and *services* directories containing the required files to declare your services, e.g. your folder/file hierarchy should look like this:
* *index.js*: contains adefault function instantiating all the services
* *models* : constains one file per database adapter you'd like to support
  * *serviceName.model.mongodb.js* : exporting the data model managed by your service in [MongoDB](https://docs.feathersjs.com/api/databases/mongodb.html), 
  * *serviceName.model.levelup.js* : exporting the data model managed by your service in [LevelUP](https://github.com/feathersjs/feathers-levelup), 
  * ...
* *services*
  * *serviceName*
    * *serviceName.hooks.js* : exporting the [hooks](https://docs.feathersjs.com/api/hooks.html) of your service, 
    * *serviceName.filters.js* : exporting the [filters](https://docs.feathersjs.com/api/events.html#event-filtering) of your service, 
    * *serviceName.service.js* : exporting the specific mixin or mixin constructor function associated to your service (optional)
    
## Application Hooks

The following [hooks](./HOOKS.MD) are usually globally executed on the application:

![Application hooks](../../assets/application-hooks.svg)

## Permissions

Isomorphic permissions management system.

**TODO**

## Client ecosystem

### Events

We use the [global event bus](https://alligator.io/vuejs/global-event-bus/) provided by Quasar to exchange events between independent components in the app:
```javascript
import { Events } from 'quasar'

// Register callback on event
const myCallback = (object) => { ... }
Events.$on('myEvent', myCallback)
// Unregister it
Events.$off('myEvent', myCallback)
```

> The event bus is notably used to be aware of state changes in the global store (see hereafter)

### Store

A component-based system like the one offered by KDK has its local and global states. Each component has its local data, but the application has a global application state that can be accessed by any component of the application. This is the purpose of the **Store** singleton:

```javascript
import { Store } from 'kCore/client'
import { Events } from 'quasar'

Store.set('myGlobal', { ... }) // Set a root object
Store.patch('myGlobal', { property: value }) // Set a specific property path
Store.set('myGlobal.property', value)
Store.get('myGlobal.property', defaultValue) // defaultValue is returned if path is not found
Events.$on('myGlobal-changed', myCallback) // When updating a root object
Events.$on('myGlobal-property-changed', myCallback) // When patching on a specific property path
```

### Context

**TODO**

