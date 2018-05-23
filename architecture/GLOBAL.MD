# Global architecture

The typical global architecture and the underlying technologies of KDK are summarized in the following diagram.

You might prefer to have a:
* [component-oriented view](./COMPONENTS.MD) of the architecture
* [data model-oriented view](./DATAMODEL.MD) of the architecture

![Global architecture](https://rawgit.com/kalisio/kdk/master/images/Global%20Architecture%20Diagram.svg)

## Architecture at scale

Although the typical architecture presented previously can be deployed in a single-server environment KDK has been developed as a loosely coupled set of modules to prevent it being a [monolithic piece of software](http://whatis.techtarget.com/definition/monolithic-architecture). The built-in [service layer](https://docs.feathersjs.com/guides/about/philosophy.html#services) helps decoupling the business logic from how it is being accessed based on a [simple and unambiguous interface](https://docs.feathersjs.com/guides/about/philosophy.html#uniform-interfaces). Kalisio applications can thus be deployed in a [microservice architectural style](http://searchmicroservices.techtarget.com/definition/microservices), which is typically used to provide high availability. The idea is to deploy different application instances on different *logical hosts* (can be physical machines as well as containers or virtual machines) each running the same or a different set of services.

However, you will have to face some [scaling configuration issues](https://docs.feathersjs.com/guides/advanced/scaling.html) first. You also have to setup the underlying logical infrastructure. It is recommanded to have a single source of truth (SSOT) for your data (i.e. a single database), simplifying authentication, which requires you to setup a [MongoDB replica set](https://docs.mongodb.com/manual/tutorial/deploy-replica-set/) and configure the DB URL [accordingly](http://mongodb.github.io/node-mongodb-native/2.0/reference/connecting/connection-settings/). Then you should make each instance aware of others instances to [synchronize service events](https://github.com/feathersjs/feathers-sync). At last, you should deploy a frontend application serving as an [API gateway](http://microservices.io/patterns/apigateway.html). To configure the proxy rules, edit the `proxyTable` option in your configuration. The frontend server is using [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) for proxying, so you should refer to its docs for a detailed usage but here's a simple example:

``` js
// config/default.js
module.exports = {
  // ...
  proxyTable: {
    // proxy all requests starting with /api/service
    '/api/service': {
      target: 'http://my.service.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/service': '/api'
      }
    }
  }
}
```

The above example will proxy the request `/api/service/1` to `http://my.service.com/api/1`.

Our [feathers-distributed](https://github.com/kalisio/feathers-distributed) module aims at making distribution more transparent.


