Kaelia is powered by the following stack:
* [Feathers](https://feathersjs.com/) on the backend side
* [Quasar](http://quasar-framework.org/) on the frontend side

If you are not familiar with those technologies and want to develop for Kaelia, in addition to read the dedicated documentation, we recommand reading https://github.com/claustres/quasar-feathers-tutorial. Indeed, Kaelia template application is based on the [Quasar wrapper for Feathers](https://github.com/quasarframework/quasar-wrapper-feathersjs-api), while Kaelia plugins are [Feathers plugins](https://docs.feathersjs.com/guides/advanced/creating-a-plugin.html). 

## Setup your environment

### Prerequisites

#### Install Node.js

[Node](https://nodejs.org/en/) is a server platform which runs JavaScript.
It's lightweight and efficient.
It has the largest ecosystem of open source libraries in the world.

- [Default install.](https://nodejs.org/en/)
- [Specific versions.](https://nodejs.org/en/download/)

#### Install Git

[git](https://git-scm.com/) is the version control system most frequently used in open source.
There are many resources available for installing it.

- [Linux.](https://www.atlassian.com/git/tutorials/install-git#linux)
- [macOS.](https://www.atlassian.com/git/tutorials/install-git#mac-os-x)
- [Windows.](https://www.atlassian.com/git/tutorials/install-git#windows)

#### Install MongoDB

[Mongo](https://www.mongodb.com/) is an open-source, document database designed for ease of development and scaling.

- [Linux.](https://docs.mongodb.com/manual/administration/install-on-linux/)
- [macOS.](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
- [Windows.](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

#### Install Quasar CLI

Install the Quasar CLI : `$ npm install -g quasar-cli`

### Web app

While it is a WIP and not yet pushed to NPM, or when developing, please use the following process.

First clone all the plugins you need and use [npm link](https://docs.npmjs.com/cli/link) to make them globally available to your Node.js installation:

```bash
// Clone and link the plugins
git clone https://github.com/kaelia-tech/kCore.git
cd kCore
npm link

git clone https://github.com/kaelia-tech/kTeam.git
cd kTeam
npm link

git clone https://github.com/kaelia-tech/kClient.git
cd kClient
npm link

...
```

Then clone the main Weacast repository and use [npm link](https://docs.npmjs.com/cli/link) to make Node.js pointing to the previously cloned modules instead of those installed by npm, e.g. :
```bash
// Clone and link plugins to Kaelia app
git clone https://github.com/kaelia-tech/kApp.git
cd kApp
// Client side
npm link kClient
// API side
cd api
npm link kCore
npm link kTeam
...
```

> **Take care that a top-level plugin might depend on another plugin so you will have to link them together, for instance the kTeam plugin depends on the kCore plugin.**

## Develop

### Web app

The default Kaelia web application template is based on the [Quasar wrapper for Feathers](https://github.com/quasarframework/quasar-wrapper-feathersjs-api).

#### Running for development
Run the frontend Quasar app (from root project folder): `$ quasar dev`

Then from the backend `api` folder run the server-side Feathers app: `$ npm run dev`

Then point your browser to [localhost:8080](http://localhost:8080).

#### Building for production
Build the frontend Quasar app (from root project folder): `$ quasar build`.

Then from the backend `api` folder build the server-side Feathers app: `$ npm run build`

#### Running in production
**Make sure you built your app first**

From the backend `api` folder run the server-side Feathers app, this will also serve the frontend Quasar app : `$ npm run prod`

Then point your browser to [localhost:8081](http://localhost:8081).

#### Running test

From the backend `api` folder run the server-side tests : `$ npm run test`
This will lint and fix issues in the code according to [JS standard](https://github.com/feross/standard), then execute tests using [Mocha](https://mochajs.org/) and compute code coverage using [Istanbul](https://istanbul.js.org/).

> **We are looking for integrating frontend and end-to-end tests, please contribute !**

### Plugins

Kaelia plugins are [Feathers plugins](https://docs.feathersjs.com/guides/advanced/creating-a-plugin.html), so you will find most of the required information in the linked Feathers documentation. Typically for development you will do the following for each required plugins
```bash
cd kTeam
npm install
npm run watch
```

To run the module tests (same as above) : `$ npm run test`

## Publish

### Prerequisites

#### Install Change log generator

This [gem](https://github.com/skywinder/github-changelog-generator) generates a change log file based on **tags**, **issues** and merged **pull requests** (and splits them into separate lists according to labels) from :octocat: GitHub Issue Tracker. This requires you to install (e.g. for Windows) [Ruby](http://rubyinstaller.org/downloads/) and its [DevKit](https://github.com/oneclick/rubyinstaller/wiki/Development-Kit).

### Web app

The same process applies when releasing a patch, minor or major version, i.e. the following tasks are done:
* increase the package version number in the **package.json** file (frontend and backend API)
* create a tag accordingly in the git repository and push it
* generates the changelog in the git repository and push it

> **Before you publish your app take care of updating the version of all dependent plugins to the latest version published, for example  perform `yarn upgrade kCore kTeam kClient`**

Depending on the release type the following command will do the job (where type is either `patch`, `minor`, `major`):
```bash
npm run release:type
```

Because Kaelia web app are also released as Docker images you can build it like this:
```bash
docker build -t kaeliatech/kApp .
```
Then release it as latest version:
```bash
docker login
docker push kaeliatech/kApp
```
And tag it (`version_tag` being the current version number like `1.1.2`)
```bash
docker tag kaeliatech/kApp kaeliatech/kApp:version_tag
docker push kaeliatech/kApp:version_tag
```

> This requires you to have a DockerHub account and be a team member of the Kaelia organization, if you'd like to become a maintainer please tell us

### Plugins

The same process applies as for the web app but in addition the module is published on the NPM registry.

> This requires you to have a NPM and GitHub account and be a team member of the Kaelia organization, if you'd like to become a maintainer please tell us

> **Before you publish a plugin take care of updating the version of your dependent plugins to the latest version published, for example  perform `yarn upgrade kCore` for a plugin depending on the core plugin before publishing it**


