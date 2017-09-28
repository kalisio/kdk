Kalisio is powered by the following stack:
* [Feathers](https://feathersjs.com/) on the backend side
* [Quasar](http://quasar-framework.org/) on the frontend side

If you are not familiar with those technologies and want to develop for Kalisio, in addition to read the dedicated documentation, we recommand reading https://github.com/claustres/quasar-feathers-tutorial. Indeed, Kalisio template application is based on the [Quasar wrapper for Feathers](https://github.com/quasarframework/quasar-wrapper-feathersjs-api), while Kalisio plugins are [Feathers plugins](https://docs.feathersjs.com/guides/advanced/creating-a-plugin.html). 

## Setup your environment

### Prerequisites

#### Install Node.js

[Node](https://nodejs.org/en/) is a server platform which runs JavaScript.
It's lightweight and efficient.
It has the largest ecosystem of open source libraries in the world.

- [Default install.](https://nodejs.org/en/)
- [Specific versions.](https://nodejs.org/en/download/)

> **Kalisio modules are expected to work with Node.js >= 8**

**In order to be able to switch easily between different versions of Node.js we recommand to use a version manager like [n](https://github.com/tj/n)/[nvm](https://github.com/creationix/nvm) under Linux/Mac or [nvm](https://github.com/coreybutler/nvm-windows) under Windows.**

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

> **Kalisio modules are expected to work with MongoDB >= 3**

#### Install Yarn

Due to some [changes](http://codetunnel.io/npm-5-changes-to-npm-link/) in the way `npm` manages linked modules we prefer to use [Yarn](https://yarnpkg.com) as a package manager.

[Install Yarn](https://yarnpkg.com/en/docs/install) on your platform.

https://yarnpkg.com

#### Install Quasar CLI

Install the Quasar CLI : `$ npm install -g quasar-cli`

### Web app

While it is a WIP and not yet pushed to NPM, or when developing, please use the following process.

First clone all the modules/plugins you need and use [yarn/npm link](https://docs.npmjs.com/cli/link) to make them globally available to your Node.js installation:

```bash
// Clone and link the plugins
git clone https://github.com/kalisio/kCore.git
cd kCore
yarn link

git clone https://github.com/kalisio/kTeam.git
cd kTeam
yarn link

git clone https://github.com/kalisio/kClient.git
cd kClient
yarn link

...
```

Then clone the main app repository and link to modules/plugins to make Node.js pointing to the previously cloned modules instead of those installed by yarn/npm, e.g. :
```bash
// Clone and link plugins to Kalisio app
git clone https://github.com/kalisio/kApp.git
cd kApp
// Client side
yarn link kCore
yarn link kTeam
// API side
cd api
yarn link kCore
yarn link kTeam
...
```

> **Take care that a top-level plugin might depend on another plugin so you will have to link them together, for instance the kTeam plugin depends on the kCore plugin.**

### Cordova wrapper

Follow [Quasar guide](http://quasar-framework.org/guide/cordova-wrapper.html).

Under Windows you might have somme issue creating a symbolic link. First you need to have administrator privileges in your shell. Then  the easy way is to use the [PowerShell Community Extensions](http://pscx.codeplex.com/) and the `New-SymLink dir link_target` command. The environment variable `PSModulePath` needs to be updated to add the path to the extension (eg `C:\Program Files (x86)\PowerShell Community Extensions\Pscx3\Pscx`) and the command should be run as administrator or your user should have [appropriate rights](http://superuser.com/questions/104845/permission-to-make-symbolic-links-in-windows-7).

If you have some issue about *You have not accepted the license agreements of the following SDK components...* you need to update first your installed SDKs through *Android Studio > Configure > SDK Manager > Install*. You might need to do it multiple times since the last version of a SDK only appear for download when previous version dependencies are installed.

To have a viable emulator install [HAXM](https://software.intel.com/en-us/articles/intel-hardware-accelerated-execution-manager-intel-haxm).

## Develop

### Web app

The default Kalisio web application template is based on the [Quasar wrapper for Feathers](https://github.com/quasarframework/quasar-wrapper-feathersjs-api).

#### Running for development
Run the frontend Quasar app (from root project folder): `$ quasar dev`

Then from the backend `api` folder run the server-side Feathers app: `$ yarn/npm run dev`

Then point your browser to [localhost:8080](http://localhost:8080).

#### Building for production
Build the frontend Quasar app (from root project folder): `$ quasar build`.

Then from the backend `api` folder build the server-side Feathers app: `$ yarn/npm run build`

#### Running in production
**Make sure you built your app first**

From the backend `api` folder run the server-side Feathers app, this will also serve the frontend Quasar app : `$ yarn/npm run prod`

Then point your browser to [localhost:8081](http://localhost:8081).

#### Running test

From the backend `api` folder run the server-side tests : `$ yarn/npm run test`
This will lint and fix issues in the code according to [JS standard](https://github.com/feross/standard), then execute tests using [Mocha](https://mochajs.org/) and compute code coverage using [Istanbul](https://istanbul.js.org/).

> **We are looking for integrating frontend and end-to-end tests, please contribute !**

### Cordova wrapper

[Quasar guide](http://quasar-framework.org/guide/cordova-wrapper.html) might help.

#### Configuring the app

Information about the [Android Emulator Networking](https://developer.android.com/studio/run/emulator-networking.html) might be usefull.

When running the app through cordova the `domain` entry of the client-side config file is used to know how to contact the remote API service:
* use http://10.0.2.2:8081 in the emulator which is an alias to host loopback interface
* use eg http://192.168.1.16:8081 in your device which is the IP affected by your router to your localhost (use `ipconfig /all` under Windows or `ifconfig` under Linux to get it)
* use [port forwarding](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/local-server)

#### Building the app
Build the app (from *cordova* project folder): `$ cordova build android`

#### Running the app
Run the app (from *cordova* project folder): `$ cordova run android`

If no device is connected this should launch the emulator, otherwise this should use your device.

> Check that the [`adb` daemon](https://developer.android.com/studio/command-line/adb.html) is running and that you authorized USB debug on your device. Use `adb devices` to check if your device is here, if you see it in `unauthorised` state uncheck/check again the USB debug option on your device.

#### Icons & Splashscreens

It does exist a couple of solutions to generate it for your app:
* https://github.com/eberlitz/splashicon-generator
* https://www.npmjs.com/package/cordova-gen-icon
* https://www.javascripttuts.com/how-to-automatically-generate-icons-and-splash-screens-with-the-ionic-cli/
* https://github.com/AlexDisler/cordova-icon

You will find the example model icon/splash in *cordova/model* so that running https://github.com/eberlitz/splashicon-generator in the *cordova* directory should work. **Under windows** take care to [this issue](https://github.com/eberlitz/splashicon-generator/issues/23).

#### Plugins

We rely on a bunch of cordova plugins so it might be usefull to refer to their specific issues:
* https://github.com/apache/cordova-plugin-device
* https://github.com/phonegap/phonegap-plugin-push
* https://github.com/apache/cordova-plugin-geolocation
* https://github.com/crosswalk-project/cordova-plugin-crosswalk-webview

### Modules/Plugins

Kalisio modules/plugins are [Feathers plugins](https://docs.feathersjs.com/guides/advanced/creating-a-plugin.html), so you will find most of the required information in the linked Feathers documentation. Typically for development you will do the following for each required plugins
```bash
cd kTeam
yarn/npm install
yarn/npm run watch
```

To run the module tests (same as above) : `$ yarn/npm run test`

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
yarn/npm run release:type
```

Because Kalisio web app are also released as Docker images you can build it like this:
```bash
docker build -t kalisio/kapp .
```
Then release it as latest version:
```bash
docker login
docker push kalisio/kapp
```
And tag it (`version_tag` being the current version number like `1.1.2`)
```bash
docker tag kalisio/kapp kalisio/kapp:version_tag
docker push kalisio/kapp:version_tag
```

> This requires you to have a DockerHub account and be a team member of the Kalisio organization, if you'd like to become a maintainer please tell us

### Plugins

The same process applies as for the web app but in addition the module is published on the NPM registry.

> This requires you to have a NPM and GitHub account and be a team member of the Kalisio organization, if you'd like to become a maintainer please tell us

> **Before you publish a plugin take care of updating the version of your dependent plugins to the latest version published, for example  perform `yarn upgrade kCore` for a plugin depending on the core plugin before publishing it**


