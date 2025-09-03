# Using KDK with Vite

This repository contains the Vite configuration required to:
* build the KDK client-side library,
* run application samples based on the KDK.

The objectives of such experiment is to be able to:
1. use the KDK outside our [skeleton](https://kalisio.github.io/skeleton/) in the most simple way (i.e. without configuring the Vue app too specifically),
2. use the KDK inside an application built with Vite instead of Webpack, which is now the main choice when building apps with Quasar.

> [!NOTE]
> First you need to install required dependencies:
```bash
cd vite
yarn install
```

## Application samples

There are two application samples available:
* a 2D map view,
* a 2D map view side-by-side with a 3D globe view that can be synchronized.

You can run both samples in dev mode like this:
```bash
// 2D view only
yarn dev
// 2D/3D views
yarn dev:globe
```

You can produce application distribution files like this:
```bash
// 2D view only
yarn build:app
// 2D/3D views
yarn build:app:globe
```

You should then serve the `dist` folder with eg `http-server` NodeJs module like this:
```bash
// Install module first if required 
npm install -g http-server
cd dist
http-server --cors --port 3000
```

## Library build

You can retrieve the library files in the KDK :open_file_folder: [client](../client) folder and put it into an external application, to avoid the burden of importing [Cesium](https://cesium.com/) in applications not requiring 3D capabilities the following files are available:
* 2D capabilities only - minified: `kdk.client.map.min.js`
* 2D/3D capabilities - minified: `kdk.client.min.js`
* 2D capabilities only - unminified, `kdk.client.map.js`
* 2D/3D capabilities - unminified: `kdk.client.js`

You can build the KDK client-side libraries like this:
```bash
// 2D/3D capabilities - minified/unminified
yarn build
// 2D capabilities only - minified
yarn build:lib
// 2D/3D capabilities - minified
yarn build:lib:globe
// 2D capabilities only - unminified
yarn build:lib:debug
// 2D/3D capabilities - unminified
yarn build:lib:globe:debug
```

> [!NOTE]
> Unminified versions for debug purpose are build by defining the `DEBUG` environment variable.

## Changes and remaining issues

In order to switch from Webpack to Vite and to build a stand alone library the following issues have been tackled or remain to be.

> [!NOTE]
> It was required to add all frontend dependencies required to build with Vite to the main KDK `package.json` file at the root level.
> Indeed, it appears that if a `node_modules` directory is available at the root level Vite will use it instead of the one located in the directory of the Vite configuration.

Some useful links and plugins:
* https://cesium.com/blog/2024/02/13/configuring-vite-or-webpack-for-cesiumjs/
* https://quasar.dev/start/vite-plugin/
* https://github.com/davidmyersdev/vite-plugin-node-polyfills
* https://github.com/unplugin/unplugin-vue-components

## Avoid depending on application specific elements

Typically using the router in a library does not make really sense as an app might not use it, if required add a check:
```js
const router = useRouter()
if (router) router.XXX
```

### Get rid of global properties in the Vue app

We were used to inject some objects to be available globally on any Vue component of the app (eg `$store, $api, $config, ...`), we should now directly import the target object:
```js
// Don't do
app.config.globalProperties.$store = Store
this.$store.patch(...)
// Do
import { Store } from ''
Store.patch(...)
```

> [!NOTE]
> As the `$tie` utility function is used in a lot of components it has not yet been changed.

## Avoid importing internal module pathes

When building a library Vite requires each external dependency to be listed individually in the build configuration.
In order to make this smooth we read dependencies from the `package.json` file but this only works when importing the module directly not internal pathes:
```js
// Don't do
import reactive from 'feathers-reactive/dist/feathers-reactive.js'
// Do
import { rx as reactive } from 'feathers-reactive'
```

> [!NOTE]
> This might require changes to dependent modules, notably if not really provided to be natively used as ES modules.

### Get rid of dynamic imports

Sometimes named imports are not useful because they are static, e.g. the name of the function that will be called is actually defined by a runtime variable.
Avoid using dynamic import for such use case but prefer importing all named elements with a global alias.
```js
// Don't do
Cesium = await import(`cesium`)
// Do
import * as Cesium from 'cesium'
```

### Avoid aliases to multiple directories

We used to define aliases to dynamic load resources like schemas, components, etc. like this:
```js
alias: {
	'@schemas': [
		path.resolve(__dirname, 'node_modules/@kalisio/kdk/core/common/schemas'),
		path.resolve(__dirname, 'node_modules/@kalisio/kdk/map/common/schemas')
	]
}
```

However it does not seem that alias can target multiple directories with Vite, resources should be placed in a single directory whenever possible:
```js
alias: {
	'@schemas': fileURLToPath(new URL('node_modules/@kalisio/kdk/extras/schemas', import.meta.url))
}
```

> [!NOTE]
> Moving components to a single directory is hard as they are part of the source code split into `core`/`map` directories.
> This would probably require to rewrite the `loadComponent` utility function using the `@component` alias.

### How to integrate Quasar langage packs ?

Not yet found a solution to integrate it with Vite, an alias does not seem to work.

### How to integrate Vue components ?

Not yet tested how to integrate single-file components into the library with Vite, only JS files are considered so far.
