# A Step-by-Step introduction to KDK

A Kalisio application includes the front-end side client as well as back-end services/API gateway.

## Running the app

### The easy way : using Docker

> This requires you to [install Docker](https://docs.docker.com/engine/installation/), the world’s leading software container platform.

Kalisio provides Docker images on the [Docker Hub](https://hub.docker.com/u/kalisio/) to ease deploying your own server. To run correctly it has to be linked with a standard [MongoDB container](https://hub.docker.com/_/mongo/) for the database. 

The following commands should do the job (assuming `kApp` is the name of the app):
```bash
// Run the MongoDB container
docker run --name mongodb-kapp -v mongodb_kapp:/data/db -d mongo

// Run the Kalisio app container
docker run --name kapp -d -p 8081:8081 --link mongodb-kapp:mongodb kalisio/kapp
```

Then point your browser to [localhost:8081](http://localhost:8081).

> If running Docker under Windows in a virtual machine first redirect the port 8081 of your virtual machine to your host

You can also use [docker-compose](https://docs.docker.com/compose/) and the [docker compose file](https://github.com/kalisio/kApp/blob/master/docker-compose.yml).
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

> Some secrets (like your AWS S3 access key) need to be set in your environment to make it work

### The hard way : from source code

First you have to ensure the same [prerequisites](./../development/develop.md#prerequisites) as for developing to build Kalisio app from source code. Then the following commands, assuming you have a MongoDB instance running on local host and default port (27017), should launch your local instance of the Kalisio app:

```bash
// Clone Kalisio app
git clone https://github.com/kalisio/kApp.git
cd kApp

// Client build (or using yarn)
yarn/npm install
quasar build

// Server build (or using yarn)
cd api
yarn/npm install
yarn/npm run build

// Running the server
yarn/npm run prod
```

Then point your browser to [localhost:8081](http://localhost:8080).

## Configuring the app

### Backend side

Kalisio app backend configuration is based on [Feathers](https://docs.feathersjs.com/guides/advanced/configuration.html) so the same guidelines are applicable, the default configuration can be found in the `api/config` folder. The main properties are the following:
* **apiPath**: the API path prefix
* **port**: the server port
* **domain**: the web application domain name (eg https://app.kalisio.xyz)
* **apiLimiter**: the API rate limiting configuration
  * **http**: for HTTP REST clients, compliant with [express-rate-limit](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fnfriedly%2Fexpress-rate-limit) options
  * **websocket**: for Websocket clients, compliant with [node-rate-limiter](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fjhurliman%2Fnode-rate-limiter) options
* **authentication** : object configuring [Feathers authentication](https://github.com/feathersjs/feathers-authentication#default-options) plus custom Kalisio options
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
* **mailer**: e-mail service configuration, compliant with [nodemailer](https://github.com/nodemailer/nodemailer-smtp-transport) options plus custom Kalisio options, e.g.
  * **service**: e-mail service to be used (like `gmail`)
  * **auth**: user login and password
  * **templateDir**: directory containing the e-mails templates to be used
* **storage**: storage service configuration
  * **accessKeyId**: AWS SNS access key
  * **secretAccessKey**: AWS SNS secret access key
  * **region**: AWS region to be used (like `eu-west-1`)
  * **apiVersion**: AWS API version to be used (like `2010-03-31`)
  * **platforms**: object containing as keys platforms names in uppercase (like `ANDROID`) and corresponding AWS SNS ARN as values
* **pusher**: push notification service configuration
  * **accessKeyId**: AWS S3 access key
  * **secretAccessKey**: AWS S3 secret access key
  * **bucket**: AWS S3 bucket to be used
* **proxyTable**: a set of proxy rules typically used for [scaling](./architecture/GLOBAL.MD#architecture-at-scale)

Environment variables (will override defaults in config file):
* **PORT / HTTPS_PORT**: backend port for HTTP and HTTPS modes
* **CLIENT_PORT / HTTPS_CLIENT_PORT**: frontend port for HTTP and HTTPS modes (only used in development)
* **DB_URL**: database URL to access the app database

### Frontend side

Kalisio app frontend configuration is based on the same underlying [tool](https://github.com/lorenwest/node-config) that powers [Feathers](https://docs.feathersjs.com/guides/advanced/configuration.html) so the same guidelines are applicable, the default configuration can be found in the `config` folder. The main properties are the following:
* **apiPath**: the API path prefix
* **apiTimeout**: the API timeout
* **version**: the web application version number
* **domain**: the web application domain name (eg https://app.kalisio.xyz)
* **transport** : the transport to be used between frontend and backend, could be `http` for standard REST or `websocket` for WebSockets
* **appName**: the name of the Kalisio app
* **appLogo**: the image to be used as logo for the Kalisio app
* **logs**
  * **level**: [log level](https://github.com/pimterry/loglevel#documentation) to be used
* **login**
  * **providers**: array of OAuth2 providers to be used (like `['google', 'github']`)
* **layout**:
  * **appBar**: component to be used for the app bar, e.g. `'layout/KAppBar'`
  * **sideNav**: component to be used for the side bar, e.g. `'layout/KSideNav'`
* **sideNav**:
  * **banner**: image to be used as banner
  * **components**: object containing as keys configuration key names (like `ANDROID`) and corresponding component to be used as values
* **XXX**: configuration object for component YYY

> The main difference with the backend configuration is that the actual frontend configuration is generated by WebPack at build time from the config files, so you will need to rebuild the app to see your changes applied

Environment variables for the frontend development server (will override defaults):
* **PORT / HTTPS_PORT**: backend port for HTTP and HTTPS modes (used to configure proxy)
* **CLIENT_PORT / HTTPS_CLIENT_PORT**: frontend port for HTTP and HTTPS modes


