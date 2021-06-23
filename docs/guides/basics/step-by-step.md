# A Step-by-Step introduction to KDK

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

Our main module is simply called [kdk](https://github.com/kalisio/kdk), available now as a single package [@kalisio/kdk](https://www.npmjs.com/package/@kalisio/kdk), but actually composed of two logical parts:
* **[core](../../api/core)** containing basic application services and components
* **[map](../../api/map)** containing required services and components to build geospatial applications

::: tip
Although bundled together you can only use the core part without the map part, for instance our application template does not use it. Indeed, on the bakend side related services will not be allocated if the map part is not explicitely used, and on the frontend side Webpack will not bundle unused components.
:::

However, this module also relies on [Weacast](https://weacast.github.io/weacast-docs/) to manage weather data and [feathers-distributed](https://github.com/kalisio/feathers-distributed) is often used to build [microservices architecture](../../architecture/global-architecture.md), we recommend reading this articles on Medium to get a deeper overview:
* [Introducing Weacast](https://towardsdatascience.com/introducing-weacast-e6e98487b2a8)
* [A use case of microservices with FeathersJS: building a geospatial platform](https://blog.feathersjs.com/a-use-case-of-microservices-with-feathersjs-building-a-geospatial-platform-56373604db71)

::: warning
The KDK was previously available as separated modules like [kCore](https://github.com/kalisio/kCore)/[@kalisio/kdk-core](https://www.npmjs.com/package/@kalisio/kdk-core), [kMap](https://github.com/kalisio/kMap)/[@kalisio/kdk-map](https://www.npmjs.com/package/@kalisio/kdk-map), etc. We strongly recommend to upgrade to the latest single package as the features remain similar and development is made easier.
:::

## Application template

A KDK-based application (a.k.a. kApp) usually includes a front-end side client as well as back-end services or an API gateway proxying requests to back-end services. In order to ease the development of new applications we provide you with a KDK application template called the [kApp](https://github.com/kalisio/kApp) as a starting point. In this guide we will use the template as a reference but most commands will be valid for any KDK-based application.

The kApp includes all the necessary boilerplate that you will need to get started building your application:
* [client-side boilerplate](https://quasar.dev/quasar-cli/developing-spa/introduction) in the *root* folder
* [server-side boilerplate](https://docs.feathersjs.com/guides/basics/generator.html) in the *api* folder
* [continuous integration/deployment boilerplate](../development/deploy.md) in the *root* folder as Dockerfiles and Travis CI scripts

It also includes the minimum viable set of features to start:
* a [basic application layout](../../api/core/components.md#layout) including side navigation, application bar and a right panel
* ready-to-go [user authentication services](../../api/core/services.md#users) and [screens](../../api/core/components.md#authentication)
* a [basic service](../../api/core/application.md) to create/remove documents in database
* a [basic activity](../../api/core/mixins.md#base-activity) listing documents using a [k-list](../../api/core/components.md#collections)
* a [basic editor](../../api/core/components.md#editors) to fill document properties when creating a new document

## Running a kApp from a Docker image

::: warning
This requires you to [install Docker](https://docs.docker.com/engine/installation/), the world’s leading software container platform.
:::

Kalisio provides Docker images for the template on the [Docker Hub](https://hub.docker.com/u/kalisio/) to ease testing it. To run correctly it has to be linked with a standard [MongoDB container](https://hub.docker.com/_/mongo/) for the database. 

The following commands should do the job:
```bash
// Retrieve the latest available dev tag
docker pull kalisio/kapp:0.3.0-dev
// Run the MongoDB container
docker run --name mongodb-kapp -v mongodb_kapp:/data/db -d mongo

// Run the Kalisio app container
docker run --name kapp -d -p 8081:8081 --link mongodb-kapp:mongodb -e "NODE_APP_INSTANCE=" kalisio/kapp:0.3.0-dev
```

Then point your browser to [localhost:8081](http://localhost:8081).

::: tip 
If running Docker under Windows in a virtual machine first redirect the port 8081 of your virtual machine to your host
::: 

You can also use [docker-compose](https://docs.docker.com/compose/) and the [docker compose files](https://github.com/kalisio/kApp/tree/master/deploy).
The following commands should do the job:
```bash
docker pull kalisio/kapp
// Run the MongoDB and Kalisio app containers
docker-compose up -d

// Stop the MongoDB and Kalisio app containers
docker-compose down
// Stop the MongoDB and Kalisio app containers erasing DB data
docker-compose down -v
```

::: tip
For most applications some secrets (like your AWS S3 access key) need also to be set in your environment to make it work, see [deployment prerequisites](./../development/deploy.md#prerequisites)
::: 

## Running a kApp from source code

First you have to ensure you fulfilled the [prerequisites](./../development/develop.md#prerequisites) to build and run kApp from source code. Then the following commands, assuming you have a MongoDB instance running on local host and default port (27017), should launch your local instance:

```bash
// Clone kApp
git clone https://github.com/kalisio/kApp.git
cd kApp

// Client build
yarn install
yarn build

// Server build
cd api
yarn install
yarn build

// Running the server in production will also serve the client
yarn prod
```

Then point your browser to [localhost:8081](http://localhost:8081).

To start coding into your application please refer to our [development guide](../development/develop.md).

## Configuring a kApp

### Backend side

kApp backend configuration is based on [Feathers](https://docs.feathersjs.com/guides/advanced/configuration.html) so the same guidelines are applicable, the default configuration can be found in the `api/config` folder. The main properties are the following:
* **apiPath**: the API path prefix
* **port**: the server port
* **domain**: the web application domain name (eg https://app.kalisio.xyz)
* **apiLimiter**: the API rate limiting configuration
  * **http**: for HTTP REST clients, compliant with [express-rate-limit](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fnfriedly%2Fexpress-rate-limit) options
  * **websocket**: for Websocket clients, compliant with [node-rate-limiter](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fjhurliman%2Fnode-rate-limiter) options
* **authentication** : object configuring [Feathers authentication](https://github.com/feathersjs/feathers-authentication#default-options) plus custom options
  * **passwordPolicy**: password policy configuration
    * **minLength**: minimum length
    * **maxLength**: maximum length
    * **uppercase**: boolean indicating if the password requires at least an uppercase letter
    * **lowercase**: boolean indicating if the password requires at least an uppercase letter
    * **digits**: boolean indicating if the password requires at least a digit
    * **symbols**: boolean indicating if the password requires at least a symbol
    * **prohibited**: array of prohibited common passwords
    * **history**: number of passwords to look for in history to avoid keeping a similar one when changing
  * **defaultUsers**: the array of default users to be created on launch (format `{ email, password }`)
    * note: will not be exposed on staging/production environments for security concerns
  * **limiter**: the authentication API rate limiting configuration
    * **http**: for HTTP REST clients, compliant with [express-rate-limit](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fnfriedly%2Fexpress-rate-limit) options
    * **websocket**: for Websocket clients, compliant with [node-rate-limiter](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fjhurliman%2Fnode-rate-limiter) options
* **logs**: object configuring the [winston](https://github.com/winstonjs/winston) loggers to be used - each key is a [transport name](https://github.com/winstonjs/winston/blob/master/docs/transports.md) which value is associated configuration options
* **db**: database configuration
  * **adapter**: the database adapter, for now the only supported one is [`mongodb`](https://github.com/feathersjs/feathers-mongodb)
  * **url**: database URL to access the app database used by drivers such as [mongodb](https://github.com/mongodb/node-mongodb-native)
* **storage**: storage service configuration used by [core](../../api/core/services.md#storage-service)
  * **accessKeyId**: AWS S3 access key
  * **secretAccessKey**: AWS S3 secret access key
  * **bucket**: AWS S3 bucket to be used
* **mailer**: [e-mail service](../../api/core/services.md#mailer-service) configuration, compliant with [nodemailer](https://github.com/nodemailer/nodemailer-smtp-transport) options plus custom Kalisio options, e.g.
  * **service**: e-mail service to be used (like `gmail`)
  * **auth**: user login and password
  * **templateDir**: directory containing the e-mails templates to be used
* **pusher**: [push notification service](../../api/core/services.md#pusher-service) configuration
  * **accessKeyId**: AWS SNS access key
  * **secretAccessKey**: AWS SNS secret access key
  * **region**: AWS region to be used (like `eu-west-1`)
  * **apiVersion**: AWS API version to be used (like `2010-03-31`)
  * **platforms**: object containing as keys platforms names in uppercase (like `ANDROID`) and corresponding AWS SNS ARN as values
* **proxyTable**: a set of proxy rules typically used for [scaling](./architecture/GLOBAL.MD#architecture-at-scale)

Environment variables (will override defaults in config file):
* **PORT / HTTPS_PORT**: backend port for HTTP and HTTPS modes
* **CLIENT_PORT / HTTPS_CLIENT_PORT**: frontend port for HTTP and HTTPS modes (only used in development)
* **DB_URL**: database URL to access the app database

### Frontend side

kApp frontend configuration is based on the same underlying [tool](https://github.com/lorenwest/node-config) that powers [Feathers](https://docs.feathersjs.com/guides/advanced/configuration.html) so the same guidelines are applicable, the default configuration can be found in the `config` folder. The main properties are the following:
* **apiPath**: the API path prefix
* **apiTimeout**: the API timeout
* **apiJwt**: name of the local storage key used to store the JWT used by the internal API
* **gatewayJwt**: name of the local storage key used to store the JWT used by the API gateway
* **version**: the web application version number
* **flavor**: the web application [flavor](../development/deploy.md#deployment-flavors)
* **domain**: the web application domain name (eg https://kapp.dev.kalisio.xyz)
* **gateway**: the API gateway domain name (eg https://api.dev.kalisio.xyz)
* **transport** : the transport to be used between frontend and backend, could be `http` for standard REST or `websocket` for WebSockets
* **appName**: the name of the app
* **appLogo**: the image to be used as logo for the app
* **logs**
  * **level**: [log level](https://github.com/pimterry/loglevel#documentation) to be used
* **screens**: connection screens configuration
  * **extraLinks**: extra links displayed at the bottom of all screens,
  * **banner**: displayed application banner,
  * **login**: login screen configuration
    * **providers**: array of OAuth2 providers to be used (like `['google', 'github']`),
    * **links**: links displayed at the bottom of the screen,
  * **logout**: logout screen configuration
    * **links**: links displayed at the bottom of the screen,
  * **changeEndpoint**: change endpoint screen configuration (only useful for mobile apps)
    * **links**: links displayed at the bottom of the screen,
* **layout**: layout configuration, see [Quasar docs](https://quasar.dev/layout/layout) for details
* **myActivity**: configuration of the activity named `my-activity` in the application
  * **topPane**: application bar components configuration for this activity
    * **content**: list of components to be displayed according to current mode of the activity (if any),
    * **filter**: component filter using any expression supported by [sift](https://github.com/crcn/sift.js),
  * **leftPane**: left pane (i.e. main menu) components configuration for this activity
    * **content**: list of components to be displayed according to current mode of the activity (if any),
    * **filter**: component filter using any expression supported by [sift](https://github.com/crcn/sift.js),
  * **bottomPane**: bottom pane components configuration for this activity
    * **content**: list of components to be displayed according to current mode of the activity (if any),
    * **filter**: component filter using any expression supported by [sift](https://github.com/crcn/sift.js),
  * **rightPane**: right pane components configuration for this activity
    * **content**: list of components to be displayed according to current mode of the activity (if any),
    * **filter**: component filter using any expression supported by [sift](https://github.com/crcn/sift.js),
  * **page**: additional page components configuration for this activity
    * **content**: list of components to be displayed according to current mode of the activity (if any),
    * **filter**: component filter using any expression supported by [sift](https://github.com/crcn/sift.js),
  * **window**: window (i.e. widgets) configuration for this activity
    * **widgets**: list of widgets to be displayed,
    * **filter**: component filter using any expression supported by [sift](https://github.com/crcn/sift.js),
  * **fab**: floating action button (FAB) configuration for this activity
    * **actions**: list of actions to be displayed,
    * **filter**: action filter using any expression supported by [sift](https://github.com/crcn/sift.js)

::: tip 
The main difference with the backend configuration is that the actual frontend configuration is generated by WebPack at build time from the config files, so you will need to rebuild the app to see your changes applied
::: 

::: warning 
Althought we use JS objects en environment variables in the frontend configuration to ease writing it please note that the resulting configuration file will be a static JSON file so don't store complex JS objects like functions in the config as it will not work
::: 

Environment variables for the frontend development server (will override defaults):
* **PORT / HTTPS_PORT**: backend port for HTTP and HTTPS modes (used to configure proxy)
* **CLIENT_PORT / HTTPS_CLIENT_PORT**: frontend port for HTTP and HTTPS modes


