# API

These sections detail the external (i.e. REST/Websocket) as well as the internal (ie Classes/Functions) [API](https://en.wikipedia.org/wiki/Application_programming_interface) for each module of KDK.

On the client/server side each service API is exposed using the [Feathers isomorphic API](https://docs.feathersjs.com/api/client.html#universal-isomorphic-api) and the [Feathers common database query API](https://docs.feathersjs.com/api/databases/querying.html).

Each service can include a set of *internal* [hooks](https://docs.feathersjs.com/api/hooks.html), i.e. hooks required to make the service work. They are built-in with the service and cannot usually removed.

Each module then exposes a set of *external* [hooks](https://docs.feathersjs.com/api/hooks.html) you can use to extend the capabilites of your application. They are not built-in with the service and are usually added or removed on-demand by your application. The main reason is that you must have control over the order of execution when mixing different hooks to best fit your application logic and avoid any side effect.

> **All dates/times in KDK are managed as date or [moment](https://momentjs.com) objects and expressed in [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time).**

* kCore
  * [Services](./kCore/SERVICES.MD)
  * [Application](./kCore/APPLICATION.MD)
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
