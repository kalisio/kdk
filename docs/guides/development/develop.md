# Develop with KDK

The default Kalisio application template [kApp](https://github.com/kalisio/kApp) provides the basic structure and tools to build and run a KDK-based application. We detail the main commands in the following sections.

## Web app

### Running for development
Run the frontend app (from root project folder): `$ yarn dev`

Then from the backend `api` folder run the server-side app: `$ yarn dev`

Then point your browser to [localhost:8080](http://localhost:8080).

### Building for production
Build the frontend app (from root project folder): `$ yarn build`.

Then from the backend `api` folder build the server-side app: `$ yarn build`

### Running in production

> Make sure you built your app first

From the backend `api` folder run the server-side Feathers app, this will also serve the frontend Quasar app : `$ yarn prod`

Then point your browser to [localhost:8081](http://localhost:8081).

### Linting the code

The **KDK** relies on [JavaScript standard style](https://github.com/feross/standard).

To lint the code:

```bash
$yarn lint
```

You can also lint each of the submodules independently using the following commands:

```bash
$yarn lint:core   # lint the core part
$yarn lint:map    # lint the map part
```
:::

### Running the tests

The **KDK** relies on two different frameworks to perform the tests:
* API tests are based on [Mocha](https://mochajs.org/)
* Client tests are based on [TestCafé](https://github.com/DevExpress/testcafe)

#### API 

From the root or backend `api` folder run the server-side tests: 

```bash
$yarn mocha
```

For coverage use: 

```bash
$yarn coverage
```

You can run the tests of each part independently using the following commands:

```bash
$yarn mocha:core   # test the core module
$yarn mocha:map    # test the map module
```

:::tip
If you need to perform some specific tests, you can use the `-g` or `--grep` option of the `mocha` command:

```bash
$yarn mocha:core -g "core:team" # run the team tests
```
:::

```bash
$yarn test:server
```

This will lint and fix issues in the code according to [JS standard](https://github.com/feross/standard), then execute tests using [Mocha](https://mochajs.org/) and compute code coverage using [Istanbul](https://istanbul.js.org/).

#### Client 

From the root folder run the client-side tests : `yarn test:client`. This will build the client, launch the server then execute tests using [TestCafé](https://github.com/DevExpress/testcafe). 

If you already have a built app and a running server you could simply do this to launch TestCafé: `$ yarn cafe:chrome` or `$ yarn cafe:firefox`

In development mode, you can tell **TestCafé** to run a specific fixture:

```bash
$yarn cafe:firefox -f "a-fxture"
```

Or a specific test:

```bash
$yarn cafe:firefox -t "a-test"
```

::: tip
Because the UI components are rendered asynchronously, it is often convenient to reduce the overall test execution speed to ensure the components are visible:

```bash
$yarn cafe:firefox -f "a-fixture" --speed 0.8
```
:::

### Debugging

Use [Chrome DevTools](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27), look at this [tutorial video](https://www.youtube.com/watch?v=Xb_0awoShR8). Usually you simply have to open `chrome://inspect` in the Chrome URL.

If you want to launch a specific test use: `yarn mocha -- --grep "My test"`.

If you want to pause the debugger when running the tests this should do it: `yarn mocha -- --inspect-brk`.

If you want to debug replicas you can use the following environment variables to launch two instances of your apps:
* **PORT / HTTPS_PORT**: API server port for HTTP and HTTPS modes
* **CLIENT_PORT / HTTPS_CLIENT_PORT**: frontend server port for HTTP and HTTPS modes

For the backend run one instance with `$ yarn dev` and the other one with `$ yarn dev:replica` (this will use another port for the Node.js debugger on the second instance and avoid conflict).

## Cordova wrapper

[Quasar guide](https://quasar.dev/quasar-cli/developing-cordova-apps/introduction) might help.

### Running for development
Run your web app as usual first, then build and run the mobile app in debug mode (from project folder):

```bash
// Android
$ yarn cordova:dev:android
// iOS
$ yarn cordova:dev:ios
```

If no device is connected this should launch the emulator, otherwise this should use your device.

::: tip
Check that the [`adb` daemon](https://developer.android.com/studio/command-line/adb.html) is running and that you authorized USB debug on your device. Use `adb devices` to check if your device is here, if you see it in `unauthorised` state uncheck/check again the USB debug option on your device.
:::

Information about the [Android Emulator Networking](https://developer.android.com/studio/run/emulator-networking.html) might be useful.

When running the app through Cordova the `domain` entry of the client-side config file is used to know how to contact the remote API service:
* use http://10.0.2.2:8081 in the emulator which is an alias to host loopback interface
* use eg http://192.168.1.16:8081 in your device which is the IP affected by your router to your localhost (use `ipconfig /all` under Windows or `ifconfig` under Linux to get it)
* use [port forwarding](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/local-server)

### Building for production
Build the app in release mode (from project folder):

```bash
// Android
$ yarn cordova:build:android
// iOS
$ yarn cordova:build:ios
```

### Debug

Use [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/) for the WebView. If you want to also get native errors without running Android Studio use [logcat](https://ourcodeworld.com/articles/read/295/how-to-debug-java-code-in-a-Cordova-android-application-from-your-device-using-adb-in-windows).

If you'd like to debug similarly your iOS Webview you can use the [remotedebug-ios-webkit-adapter](https://github.com/RemoteDebug/remotedebug-ios-webkit-adapter) under Windows.

### Icons & Splashscreens

It does exist a couple of solutions to generate it for your app:
* [splashicon-generator](https://github.com/eberlitz/splashicon-generator)
* [Cordova-gen-icon](https://www.npmjs.com/package/Cordova-gen-icon)
* [Ionic CLI](https://www.javascripttuts.com/how-to-automatically-generate-icons-and-splash-screens-with-the-ionic-cli/)
* [Cordova-icon](https://github.com/AlexDisler/Cordova-icon)

You will find the example model icon/splash in *Cordova/model* so that running [splashicon-generator](https://github.com/eberlitz/splashicon-generator) in the *Cordova* directory should work. **Under windows** take care to [this issue](https://github.com/eberlitz/splashicon-generator/issues/23).

### Plugins

We rely on a bunch of Cordova plugins so it might be useful to refer to their specific issues:
* [Cordova-plugin-device](https://github.com/apache/Cordova-plugin-device)
* [phonegap-plugin-push](https://github.com/phonegap/phonegap-plugin-push)
* [Cordova-plugin-geolocation](https://github.com/apache/Cordova-plugin-geolocation)
* [Cordova-plugin-crosswalk-webview](https://github.com/crosswalk-project/Cordova-plugin-crosswalk-webview)

::: danger
The Crosswalk project seems to be [discontinued](https://crosswalk-project.org/blog/crosswalk-final-release.html), as a consequence there are some issues with recent Cordova versions like [this](https://github.com/apache/Cordova-android/pull/417). We will probably drop it soon.
:::

## Modules/Plugins

Kalisio modules/plugins are [Feathers plugins](https://docs.feathersjs.com/guides/advanced/creating-a-plugin.html), so you will find most of the required information in the linked Feathers documentation. Typically for development you will do the following for each required plugins so that the module is re-compiled on each file change:
```bash
cd kdk
yarn install
yarn watch
```

### Running tests

To run the module tests including linting and coverage : `$ yarn test`

To speed-up things simply run the tests with: `$ yarn mocha`

To speed-up things even more run a single test suite with: `$ yarn mocha -- --grep "test suite name"`
