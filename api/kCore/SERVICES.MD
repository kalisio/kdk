# Services

## User service

> Available as a global service

KDK exposes the available users through the `users` service. Although only web sockets are usually used on the client side, both the [REST](https://docs.feathersjs.com/api/rest.html) and the [Socket](https://docs.feathersjs.com/api/socketio.html) interfaces are configured.

For exemple you can request the available users like this:
```javascript
import api from 'kCore/client'

api.getService('users').find()
.then(response => {
  response.data.forEach(user => {
    // Do something with the current user
  })
})
```

> `create`, `update`, `patch`, `remove` methods are only allowed from the server side, clients can only `get`and `find` forecasts

### Data model

The data model of a user as used by the API is [detailed here](../architecture/DATAMODEL.MD#user-data-model).

### Hooks

The following [hooks](./HOOKS.MD) are executed on the user service:
![User hooks](https://rawgit.com/kalisio/kdk/master/images/User%20Hooks%20Diagram.svg)

## Authorisation service

> Available as a global service

**TODO**

## Tag service

> Available as a global and a contextual service

**TODO**

## Storage service

> Available as a global and a contextual service

**TODO**

