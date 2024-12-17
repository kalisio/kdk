# Introduction to KDK

**KDK** is mainly powered by the following stack:
* [Feathers](https://feathersjs.com/) on the backend side
* [Quasar](https://quasar.dev/) on the frontend side

If you are not familiar with those technologies and want to develop with the **KDK**, we first recommend studying how they work. To get a deeper overview of some of the internals we also recommend you to read our technical articles on Medium:
* [FeathersJS in production: configuration, API prefixing, logging and error catching](https://blog.feathersjs.com/feathersjs-in-production-configuration-api-prefixing-logging-and-error-catching-2a80e044e233)
* [How to setup OAuth flow with FeathersJS](https://blog.feathersjs.com/how-to-setup-oauth-flow-with-featherjs-522bdecb10a8)
* [Enterprise-grade authentication using AWS Cognito and OneLogin with FeathersJS](https://blog.feathersjs.com/enterprise-grade-authentication-using-aws-cognito-and-onelogin-with-feathersjs-d4c6f46ab123)
* [Access control strategies with FeathersJS](https://blog.feathersjs.com/access-control-strategies-with-feathersjs-72452268739d)
* [Stress testing your FeathersJS application like in production](https://blog.feathersjs.com/stress-testing-your-feathersjs-application-like-in-production-4b8611ee8d9e)
* [FeathersJS in production: password policy and rate limiting](https://blog.feathersjs.com/feathersjs-in-production-password-policy-and-rate-limiting-32c9874dc563)
* [Mocking custom service queries with FeathersJS](https://blog.feathersjs.com/mocking-custom-service-queries-with-feathersjs-3aae74003259)

## Application template

A KDK-based application (a.k.a. skeleton) usually includes a front-end side client as well as back-end services or an API gateway proxying requests to back-end services. In order to ease the development of new applications we provide you with a KDK application template called the [skeleton](https://kalisio.github.io/skeleton) as a starting point. In this guide we will use the template as a reference when dealing with KDK-based application.

You can start your journey by [running the skeleton](https://kalisio.github.io/skeleton/guides/installing.html).

## KDK internals

Our main module is simply called [kdk](https://github.com/kalisio/kdk), available now as a single package [@kalisio/kdk](https://www.npmjs.com/package/@kalisio/kdk). It is actually composed of two logical parts:
* **[core](../../api/core)** containing basic application services and components
* **[map](../../api/map)** containing required services and components to build geospatial applications

::: tip
Although bundled together you can only use the core part without the map part, for instance our application template does not use it. Indeed, on the bakend side related services will not be allocated if the map part is not explicitely used, and on the frontend side Webpack will not bundle unused components.
:::

::: warning
The KDK was previously available as separated modules like [kCore](https://github.com/kalisio/kCore)/[@kalisio/kdk-core](https://www.npmjs.com/package/@kalisio/kdk-core), [kMap](https://github.com/kalisio/kMap)/[@kalisio/kdk-map](https://www.npmjs.com/package/@kalisio/kdk-map), etc. We strongly recommend to upgrade to the latest single package as the features remain similar and development is made easier.
:::

The KDK relies on third-party modules which not directly integrated (they can be used as standalone modules), but it might be useful to know more about them. For instance:
* [feathers-s3](https://github.com/kalisio/feathers-s3) to manage file upload/download to/from object storages like Amazon S3,
* [feathers-import-export](https://github.com/kalisio/feathers-import-export) to import/export data using services API,
* [feathers-webpush](https://github.com/kalisio/feathers-webpush) to manage push notifications,
* [feathers-distributed](https://github.com/kalisio/feathers-distributed) to build [microservices architectures](../../architecture/global-architecture.md),
* [weacast](https://weacast.github.io/weacast/) to manage weather data.

As a consequence, we recommend reading this articles on Medium to get a deeper overview:
* [Introducing Weacast](https://towardsdatascience.com/introducing-weacast-e6e98487b2a8)
* [A use case of microservices with FeathersJS: building a geospatial platform](https://blog.feathersjs.com/a-use-case-of-microservices-with-feathersjs-building-a-geospatial-platform-56373604db71)

