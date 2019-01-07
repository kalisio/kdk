## Develop

## Web app

The default Kalisio web application template is based on the [Quasar wrapper for Feathers](https://github.com/quasarframework/quasar-wrapper-feathersjs-api).

### Running for development
Run the frontend Quasar app (from root project folder): `$ quasar dev`

Then from the backend `api` folder run the server-side Feathers app: `$ yarn/npm run dev`

Then point your browser to [localhost:8080](http://localhost:8080).

### Building for production
Build the frontend Quasar app (from root project folder): `$ quasar build`.

Then from the backend `api` folder build the server-side Feathers app: `$ yarn/npm run build`

### Running in production

> Make sure you built your app first

From the backend `api` folder run the server-side Feathers app, this will also serve the frontend Quasar app : `$ yarn/npm run prod`

Then point your browser to [localhost:8081](http://localhost:8081).

### Running tests

From the root or backend `api` folder run the server-side tests : `$ yarn/npm run test:server` or `$ yarn/npm run test`
This will lint and fix issues in the code according to [JS standard](https://github.com/feross/standard), then execute tests using [Mocha](https://mochajs.org/) and compute code coverage using [Istanbul](https://istanbul.js.org/).

From the root folder run the client-side tests : `yarn/npm run test:client`. This will build the client, launch the server then execute tests using [TestCafé](https://github.com/DevExpress/testcafe). If you already have a built app and a running server you could simply do this to launch TestCafé only: `$ yarn/npm run cafe`

In development mode, you can tell TestCafé to run a given fixture or a given test:
```
# Running a given fixture
npm run cafe -- -f "my fxture"

# Running a given test
npm run cafe -- -t "my test"
```

### Debug

Use [Chrome DevTools](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27), look at this [tutorial video](https://www.youtube.com/watch?v=Xb_0awoShR8). Usually you simply have to open `chrome://inspect` in the Chrome URL.

If you want to pause the debugger when running the tests this should do it: `npm run mocha -- --inspect-brk`.

If you want to debug replicas you can use the following environment variables to launch two instances of your apps:
* **PORT / HTTPS_PORT**: API server port for HTTP and HTTPS modes
* **CLIENT_PORT / HTTPS_CLIENT_PORT**: frontend server port for HTTP and HTTPS modes

For the backend run one instance with `$ yarn/npm run dev` and the other one with `$ yarn/npm run dev:replica` (this will use another port for the Node.js debugger on the second instance and avoid conflict).

## Cordova wrapper

[Quasar guide](http://quasar-framework.org/guide/cordova-wrapper.html) might help.

### Configuring the app

Information about the [Android Emulator Networking](https://developer.android.com/studio/run/emulator-networking.html) might be usefull.

When running the app through cordova the `domain` entry of the client-side config file is used to know how to contact the remote API service:
* use http://10.0.2.2:8081 in the emulator which is an alias to host loopback interface
* use eg http://192.168.1.16:8081 in your device which is the IP affected by your router to your localhost (use `ipconfig /all` under Windows or `ifconfig` under Linux to get it)
* use [port forwarding](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/local-server)

### Building the app
Build the app (from project folder): 
```
// Debug mode
$ yarn/npm run cordova:build:debug
// Release mode
$ yarn/npm run cordova:build:release
// All
$ yarn/npm run cordova:build
```

### Running the app
Run the app (from project folder):
```
// Debug mode
$ yarn/npm run cordova:dev
// Release mode
$ yarn/npm run cordova:prod
// Shortcut to dev mode
$ yarn/npm run cordova
```

If no device is connected this should launch the emulator, otherwise this should use your device.

> Check that the [`adb` daemon](https://developer.android.com/studio/command-line/adb.html) is running and that you authorized USB debug on your device. Use `adb devices` to check if your device is here, if you see it in `unauthorised` state uncheck/check again the USB debug option on your device.

### Debug

Use [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/) for the WebView. If you want to also get native errors without running Android Studio use [logcat](https://ourcodeworld.com/articles/read/295/how-to-debug-java-code-in-a-cordova-android-application-from-your-device-using-adb-in-windows).

### Icons & Splashscreens

It does exist a couple of solutions to generate it for your app:
* https://github.com/eberlitz/splashicon-generator
* https://www.npmjs.com/package/cordova-gen-icon
* https://www.javascripttuts.com/how-to-automatically-generate-icons-and-splash-screens-with-the-ionic-cli/
* https://github.com/AlexDisler/cordova-icon

You will find the example model icon/splash in *cordova/model* so that running https://github.com/eberlitz/splashicon-generator in the *cordova* directory should work. **Under windows** take care to [this issue](https://github.com/eberlitz/splashicon-generator/issues/23).

### Plugins

We rely on a bunch of cordova plugins so it might be usefull to refer to their specific issues:
* https://github.com/apache/cordova-plugin-device
* https://github.com/phonegap/phonegap-plugin-push
* https://github.com/apache/cordova-plugin-geolocation
* https://github.com/crosswalk-project/cordova-plugin-crosswalk-webview

**The Crosswalk project seems to be [discontinued](https://crosswalk-project.org/blog/crosswalk-final-release.html), as a consequence there are some issues with recent Cordova versions like [this](https://github.com/apache/cordova-android/pull/417). We will probably drop it soon.**

## Modules/Plugins

Kalisio modules/plugins are [Feathers plugins](https://docs.feathersjs.com/guides/advanced/creating-a-plugin.html), so you will find most of the required information in the linked Feathers documentation. Typically for development you will do the following for each required plugins so that the module is re-compiled on each file change:
```bash
cd kTeam
yarn/npm install
yarn/npm run watch
```

### Running tests

To run the module tests including linting and coverage : `$ npm run test`

To speed-up things simply run the tests with: `$ npm run mocha`

To speed-up things even more run a single test suite with: `$ npm run mocha -- --grep "test suite name"`
