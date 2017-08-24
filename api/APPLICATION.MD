## Backend setup

Kalisio [core module](https://github.com/kalisio/kCore) provides a helper to quickly initialize what is required for your [server application](https://docs.feathersjs.com/api/application.html). The core module provides the ability to initialize a new Kalisio application instance, attach it to the configured database and setup authentication:
```javascript
import { kalisio } from 'kCore'

// Initialize app
let app = kalisio()
// Connect to DB
await app.db.connect()
```

## Client setup

Kalisio [core module](https://github.com/kalisio/kCore) provides a helper to quickly initialize what is required for your [client application](https://docs.feathersjs.com/api/client.html).
```javascript
import { kalisio } from 'kCore/client'

// Initialize API wrapper
let api = kalisio()
// Retrieve a given service
let users = api.getService('users')
```

## Application API

### .getService(name) - backend/client

Retrieve the given service by name, should replace [Feathers service method](https://docs.feathersjs.com/api/application.html#servicepath) so that you are abstracted away from service path (i.e. API prefix) and only refer to it by internal name.

> On the client side this is also used to instanciate the service on first call.

### .createService(name, app, options) - backend only

Create a new service attached to the application by name and given a set of options:
* **modelsPath**: directory where to find model declaration (optional), if provided will initiate a DB service based on the model
* **servicesPath**: directory where to find service declaration (optional), if provided for a non-DB service will initiate a service based on the returned object or constructor function from the service module, for a DB service it will apply the provided mixin object coming from the service module
* **proxy**: options for a service to be proxied by the created service
  * **service**: the name of the proxied service
  * **params**: the parameters to be used when calling the proxied service, either an object or a function returning the object
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
    * *serviceName.service.js* : exporting the specific mixin associated to your service (optionnal)
    
## Application Hooks

The following [hooks](./HOOKS.MD) are globally executed on the application:
![Application hooks](https://cdn.rawgit.com/kaelia-tech/kDocs/c70b836e2a7c92c98afd73eac9d2010f897b68b7/images/Application%20Hooks%20Diagram.svg)
