# About

The **Kalisio Development Kit** (**KDK**) aims to simplify the development of geospatial web applications running on desktop or mobile devices. It is a strongly opiniated stack initially developed to build applications provided as SaaS (i.e. Cloud) solutions like [Akt'n'Map](https://aktnmap.com). However, you can also build legacy applications because of the modularity and the flexibility of the KDK.

![Kano application built with the KDK](../assets/kano-weather.png)

Our objective is to propose a microservice based platform. Each building block has the responsibility to deliver specific and limited functionalities. Such an architectural approach plays a key role in helping us face the challenge of maintaining several mature products that need scalability within multiple contexts in terms of processing, storage, and features delivery.

**KDK** is mainly powered by the following stack:
* [Feathers](https://feathersjs.com/) on the backend side
* [Quasar](https://quasar-framework.org/) on the frontend side

If you are not familiar with those technologies and want to develop with the **KDK**, in addition to read the dedicated documentation, we recommend reading [https://github.com/claustres/quasar-feathers-tutorial](https://github.com/claustres/quasar-feathers-tutorial). Indeed, Kalisio template application is based on the Quasar wrapper for Feathers, while Kalisio plugins are Feathers plugins.

To get a deeper overview of some of the internals we recommend you to read our technical articles on Medium as a source of inspiration:
* [FeathersJS in production: configuration, API prefixing, logging and error catching](https://blog.feathersjs.com/feathersjs-in-production-configuration-api-prefixing-logging-and-error-catching-2a80e044e233)
* [How to setup OAuth flow with FeathersJS](https://blog.feathersjs.com/how-to-setup-oauth-flow-with-featherjs-522bdecb10a8)
* [Enterprise-grade authentication using AWS Cognito and OneLogin with FeathersJS](https://blog.feathersjs.com/enterprise-grade-authentication-using-aws-cognito-and-onelogin-with-feathersjs-d4c6f46ab123)
* [Access control strategies with FeathersJS](https://blog.feathersjs.com/access-control-strategies-with-feathersjs-72452268739d)
* [Stress testing your FeathersJS application like in production](https://blog.feathersjs.com/stress-testing-your-feathersjs-application-like-in-production-4b8611ee8d9e)
* [FeathersJS in production: password policy and rate limiting](https://blog.feathersjs.com/feathersjs-in-production-password-policy-and-rate-limiting-32c9874dc563)

::: tip Note
The Kalisio framework is also inspired by our experience in developing [Weacast](https://weacast.gitbooks.io/weacast-docs/), referring to it as a more simple project might help.
:::

If you'd like more information on how this documentation is built please refer to our [tools section](../tools/documentation.md#documentation).


