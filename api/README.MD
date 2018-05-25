# API

These sections detail the external (i.e. REST/Websocket) as well as the internal (ie Classes/Functions) [API](https://en.wikipedia.org/wiki/Application_programming_interface) for each module of KDK.

## Services

On the client/server side each service API is exposed using the [Feathers isomorphic API](https://docs.feathersjs.com/api/client.html#universal-isomorphic-api) and the [Feathers common database query API](https://docs.feathersjs.com/api/databases/querying.html). Although only web sockets are usually used on the client side, both the [REST](https://docs.feathersjs.com/api/rest.html) and the [Socket](https://docs.feathersjs.com/api/socketio.html) interfaces are configured.

KDK usually exposes the available items of a service (e.g. users) through the `items` (e.g. `users`) service. For exemple you can request the available users like this on the client side:
```javascript
let response = await api.getService('users').find({})
response.data.forEach(user => {
  // Do something with the current user
})
```

> Depending on the permissions set on the user by the application he might not have access to all items of the service.

## Hooks

KDK modules provide a collection of [hooks](https://docs.feathersjs.com/api/hooks.html) to be used by plugins or [client applications](https://docs.feathersjs.com/api/client.html). They often rely on [Feathers common hooks](https://docs.feathersjs.com/api/hooks-common.html).

> [Hooks](https://docs.feathersjs.com/api/hooks.html) are the main way to introduce business logic into applications and plugins so we recommand to understand them well first before reading this.

Each service can include a set of *internal* [hooks](https://docs.feathersjs.com/api/hooks.html), i.e. hooks required to make the service work. They are built-in with the service and cannot usually be removed.

Each module then exposes a set of *external* [hooks](https://docs.feathersjs.com/api/hooks.html) you can use to extend the capabilites of your application. They are not built-in with the services and are usually added or removed on-demand by your application. The main reason is that you must have control over the order of execution when mixing different hooks to best fit your application logic and avoid any side effect.

## Data model

Each service can declare a set of *perspectives*, which are not retrieved by default when querying the object(s), you will need to use [`$select`](https://docs.feathersjs.com/api/databases/querying.html#select) to do so. A perspective is simply a field of the data model containing a nested object, like the **profile** field containing the user's profile information on the user data model.

> All dates/times in KDK are managed as date or [moment](https://momentjs.com) objects and expressed in [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time).

## Client

KDK modules provide a collection of reusable *mixins* and *components* to be used by plugins or applications.

[Mixins](https://vuejs.org/v2/guide/mixins.html) are a flexible way to distribute reusable functionalities for [Vue components](https://vuejs.org/v2/guide/components.html). A mixin object can contain any component options. When a component uses a mixin, all options in the mixin will be “mixed” into the component’s own options.

> Although `.vue` components are stored at the module level to ensure right configuration management with backend code they are not "processed" within. Instead, the application process them directly using [WebPack dynamic imports](https://medium.com/front-end-hacking/webpack-and-dynamic-imports-doing-it-right-72549ff49234).

## Plugins/Modules

* kCore
  * [Application](./kCore/APPLICATION.MD)
  * [Services](./kCore/SERVICES.MD)
  * [Hooks](./kCore/HOOKS.MD)
  * Client
    * [Components](./kCore/COMPONENTS.MD)
    * [Mixins](./kCore/MIXINS.MD)
* kTeam
  * [Services](./kTeam/SERVICES.MD)
  * [Hooks](./kTeam/HOOKS.MD)
  * Client
    * [Components](./kTeam/COMPONENTS.MD)
    * [Mixins](./kTeam/MIXINS.MD)
* kNotify
  * [Services](./kNotify/SERVICES.MD)
  * [Hooks](./kNotify/HOOKS.MD)
  * Client
    * [Components](./kNotify/COMPONENTS.MD)
    * [Mixins](./kNotify/MIXINS.MD)
* kMap
  * [Services](./kMap/SERVICES.MD)
  * [Hooks](./kMap/HOOKS.MD)
  * Client
    * [Components](./kMap/COMPONENTS.MD)
    * [Mixins](./kMap/MIXINS.MD)
  
## Testing

You will find [here](./kApp.postman_collection.json) a collection of ready-to-go REST requests to test the API with the great [POSTMAN](https://www.getpostman.com/) tool. Simply download it and import it in your POSTMAN installation.

You should do the following:
1. make your Kalisio installation run (the collection is configured for default dev port `8080` but you can easily switch to `8081` for production mode for instance or any other)
2. use the authenticate request with a registered user e-mail/password to retrieve an authorization token
3. set this token in the header of other requests in order to be authorized to perform the request
4. renew your token when expired (step 2)
