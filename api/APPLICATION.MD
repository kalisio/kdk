## Backend setup

Kaelia [core module](https://github.com/kaelia-tech/kCore) provides a helper to quickly initialize what is required for your [server application](https://docs.feathersjs.com/api/application.html). The core module provides the ability to initialize a new Weacast application instance, attach it to the configured database and setup authentication:
```javascript
import { kaelia } from 'kCore'

// Initialize app
let app = kaelia()
// Connect to DB
await app.db.connect()
```

## Client setup

Weacast [client module](https://github.com/kaelia-tech/kClient) provides a helper to quickly initialize what is required for your [client application](https://docs.feathersjs.com/api/client.html).
```javascript
import { kaelia } from 'kClient'

// Initialize API wrapper
let api = kaelia()
// Retrieve a given service
let users = api.getService('users')
```

## Application API

### .getService(name) - backend/client

Retrieve the given service by name, should replace [Feathers service method](https://docs.feathersjs.com/api/application.html#servicepath) so that you are abstracted away from service path (i.e. API prefix) and only refer to it by internal name.

> On the client side this is also used to instanciate the service on first call.

### .createService(name, app, modelsPath, servicesPath) - backend only

Create a new service attached to the application by name and given a set of directories where to find model/service

This assumes you have created a *models* and *services* directories containing the required files to declare your service, e.g. your folder/file hierarchy should look like this:
* *index.js*
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
![Application hooks](https://cdn.rawgit.com/kaelia-tech/kDocs/9d7ac840bd860ce612ffe098f1b8c1027de8d914/images/Application%20Hooks%20Diagram.svg)
