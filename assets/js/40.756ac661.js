(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{575:function(e,t,r){"use strict";r.r(t);var o=r(13),a=Object(o.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("h1",{attrs:{id:"develop-with-kdk"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#develop-with-kdk"}},[e._v("#")]),e._v(" Develop with KDK")]),e._v(" "),r("p",[e._v("The default Kalisio application template "),r("a",{attrs:{href:"https://github.com/kalisio/kApp",target:"_blank",rel:"noopener noreferrer"}},[e._v("kApp"),r("OutboundLink")],1),e._v(" provides the basic structure and tools to build and run a KDK-based application. We detail the main commands in the following sections.")]),e._v(" "),r("h2",{attrs:{id:"web-app"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#web-app"}},[e._v("#")]),e._v(" Web app")]),e._v(" "),r("h3",{attrs:{id:"running-for-development"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#running-for-development"}},[e._v("#")]),e._v(" Running for development")]),e._v(" "),r("p",[e._v("Run the frontend app (from root project folder): "),r("code",[e._v("$ yarn dev")])]),e._v(" "),r("p",[e._v("Then from the backend "),r("code",[e._v("api")]),e._v(" folder run the server-side app: "),r("code",[e._v("$ yarn dev")])]),e._v(" "),r("p",[e._v("Then point your browser to "),r("a",{attrs:{href:"http://localhost:8080",target:"_blank",rel:"noopener noreferrer"}},[e._v("localhost:8080"),r("OutboundLink")],1),e._v(".")]),e._v(" "),r("h3",{attrs:{id:"building-for-production"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#building-for-production"}},[e._v("#")]),e._v(" Building for production")]),e._v(" "),r("p",[e._v("Build the frontend app (from root project folder): "),r("code",[e._v("$ yarn build")]),e._v(".")]),e._v(" "),r("p",[e._v("Then from the backend "),r("code",[e._v("api")]),e._v(" folder build the server-side app: "),r("code",[e._v("$ yarn build")])]),e._v(" "),r("h3",{attrs:{id:"running-in-production"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#running-in-production"}},[e._v("#")]),e._v(" Running in production")]),e._v(" "),r("blockquote",[r("p",[e._v("Make sure you built your app first")])]),e._v(" "),r("p",[e._v("From the backend "),r("code",[e._v("api")]),e._v(" folder run the server-side Feathers app, this will also serve the frontend Quasar app : "),r("code",[e._v("$ yarn prod")])]),e._v(" "),r("p",[e._v("Then point your browser to "),r("a",{attrs:{href:"http://localhost:8081",target:"_blank",rel:"noopener noreferrer"}},[e._v("localhost:8081"),r("OutboundLink")],1),e._v(".")]),e._v(" "),r("h3",{attrs:{id:"linting-the-code"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#linting-the-code"}},[e._v("#")]),e._v(" Linting the code")]),e._v(" "),r("p",[e._v("The "),r("strong",[e._v("KDK")]),e._v(" relies on "),r("a",{attrs:{href:"https://github.com/feross/standard",target:"_blank",rel:"noopener noreferrer"}},[e._v("JavaScript standard style"),r("OutboundLink")],1),e._v(".")]),e._v(" "),r("p",[e._v("To lint the code:")]),e._v(" "),r("div",{staticClass:"language-bash extra-class"},[r("pre",{pre:!0,attrs:{class:"language-bash"}},[r("code",[r("span",{pre:!0,attrs:{class:"token variable"}},[e._v("$yarn")]),e._v(" lint\n")])])]),r("h3",{attrs:{id:"debugging"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#debugging"}},[e._v("#")]),e._v(" Debugging")]),e._v(" "),r("p",[e._v("Use "),r("a",{attrs:{href:"https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27",target:"_blank",rel:"noopener noreferrer"}},[e._v("Chrome DevTools"),r("OutboundLink")],1),e._v(", look at this "),r("a",{attrs:{href:"https://www.youtube.com/watch?v=Xb_0awoShR8",target:"_blank",rel:"noopener noreferrer"}},[e._v("tutorial video"),r("OutboundLink")],1),e._v(". Usually you simply have to open "),r("code",[e._v("chrome://inspect")]),e._v(" in the Chrome URL.")]),e._v(" "),r("p",[e._v("If you want to launch a specific test use: "),r("code",[e._v('yarn mocha -- --grep "My test"')]),e._v(".")]),e._v(" "),r("p",[e._v("If you want to pause the debugger when running the tests this should do it: "),r("code",[e._v("yarn mocha -- --inspect-brk")]),e._v(".")]),e._v(" "),r("p",[e._v("If you want to debug replicas you can use the following environment variables to launch two instances of your apps:")]),e._v(" "),r("ul",[r("li",[r("strong",[e._v("PORT / HTTPS_PORT")]),e._v(": API server port for HTTP and HTTPS modes")]),e._v(" "),r("li",[r("strong",[e._v("CLIENT_PORT / HTTPS_CLIENT_PORT")]),e._v(": frontend server port for HTTP and HTTPS modes")])]),e._v(" "),r("p",[e._v("For the backend run one instance with "),r("code",[e._v("$ yarn dev")]),e._v(" and the other one with "),r("code",[e._v("$ yarn dev:replica")]),e._v(" (this will use another port for the Node.js debugger on the second instance and avoid conflict).")]),e._v(" "),r("h2",{attrs:{id:"cordova-wrapper"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#cordova-wrapper"}},[e._v("#")]),e._v(" Cordova wrapper")]),e._v(" "),r("p",[r("a",{attrs:{href:"https://quasar.dev/quasar-cli/developing-cordova-apps/introduction",target:"_blank",rel:"noopener noreferrer"}},[e._v("Quasar guide"),r("OutboundLink")],1),e._v(" might help.")]),e._v(" "),r("h3",{attrs:{id:"running-for-development-2"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#running-for-development-2"}},[e._v("#")]),e._v(" Running for development")]),e._v(" "),r("p",[e._v("Run your web app as usual first, then build and run the mobile app in debug mode (from project folder):")]),e._v(" "),r("div",{staticClass:"language-bash extra-class"},[r("pre",{pre:!0,attrs:{class:"language-bash"}},[r("code",[e._v("// Android\n$ "),r("span",{pre:!0,attrs:{class:"token function"}},[e._v("yarn")]),e._v(" cordova:dev:android\n// iOS\n$ "),r("span",{pre:!0,attrs:{class:"token function"}},[e._v("yarn")]),e._v(" cordova:dev:ios\n")])])]),r("p",[e._v("If no device is connected this should launch the emulator, otherwise this should use your device.")]),e._v(" "),r("div",{staticClass:"custom-block tip"},[r("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),r("p",[e._v("Check that the "),r("a",{attrs:{href:"https://developer.android.com/studio/command-line/adb.html",target:"_blank",rel:"noopener noreferrer"}},[r("code",[e._v("adb")]),e._v(" daemon"),r("OutboundLink")],1),e._v(" is running and that you authorized USB debug on your device. Use "),r("code",[e._v("adb devices")]),e._v(" to check if your device is here, if you see it in "),r("code",[e._v("unauthorised")]),e._v(" state uncheck/check again the USB debug option on your device.")])]),e._v(" "),r("p",[e._v("Information about the "),r("a",{attrs:{href:"https://developer.android.com/studio/run/emulator-networking.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("Android Emulator Networking"),r("OutboundLink")],1),e._v(" might be useful.")]),e._v(" "),r("p",[e._v("When running the app through Cordova the "),r("code",[e._v("domain")]),e._v(" entry of the client-side config file is used to know how to contact the remote API service:")]),e._v(" "),r("ul",[r("li",[e._v("use http://10.0.2.2:8081 in the emulator which is an alias to host loopback interface")]),e._v(" "),r("li",[e._v("use eg http://192.168.1.16:8081 in your device which is the IP affected by your router to your localhost (use "),r("code",[e._v("ipconfig /all")]),e._v(" under Windows or "),r("code",[e._v("ifconfig")]),e._v(" under Linux to get it)")]),e._v(" "),r("li",[e._v("use "),r("a",{attrs:{href:"https://developers.google.com/web/tools/chrome-devtools/remote-debugging/local-server",target:"_blank",rel:"noopener noreferrer"}},[e._v("port forwarding"),r("OutboundLink")],1)])]),e._v(" "),r("h3",{attrs:{id:"building-for-production-2"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#building-for-production-2"}},[e._v("#")]),e._v(" Building for production")]),e._v(" "),r("p",[e._v("Build the app in release mode (from project folder):")]),e._v(" "),r("div",{staticClass:"language-bash extra-class"},[r("pre",{pre:!0,attrs:{class:"language-bash"}},[r("code",[e._v("// Android\n$ "),r("span",{pre:!0,attrs:{class:"token function"}},[e._v("yarn")]),e._v(" cordova:build:android\n// iOS\n$ "),r("span",{pre:!0,attrs:{class:"token function"}},[e._v("yarn")]),e._v(" cordova:build:ios\n")])])]),r("h3",{attrs:{id:"debug"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#debug"}},[e._v("#")]),e._v(" Debug")]),e._v(" "),r("p",[e._v("Use "),r("a",{attrs:{href:"https://developers.google.com/web/tools/chrome-devtools/remote-debugging/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Chrome DevTools"),r("OutboundLink")],1),e._v(" for the WebView. If you want to also get native errors without running Android Studio use "),r("a",{attrs:{href:"https://ourcodeworld.com/articles/read/295/how-to-debug-java-code-in-a-Cordova-android-application-from-your-device-using-adb-in-windows",target:"_blank",rel:"noopener noreferrer"}},[e._v("logcat"),r("OutboundLink")],1),e._v(".")]),e._v(" "),r("p",[e._v("If you'd like to debug similarly your iOS Webview you can use the "),r("a",{attrs:{href:"https://github.com/RemoteDebug/remotedebug-ios-webkit-adapter",target:"_blank",rel:"noopener noreferrer"}},[e._v("remotedebug-ios-webkit-adapter"),r("OutboundLink")],1),e._v(" under Windows.")]),e._v(" "),r("h3",{attrs:{id:"icons-splashscreens"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#icons-splashscreens"}},[e._v("#")]),e._v(" Icons & Splashscreens")]),e._v(" "),r("p",[e._v("It does exist a couple of solutions to generate it for your app:")]),e._v(" "),r("ul",[r("li",[r("a",{attrs:{href:"https://github.com/eberlitz/splashicon-generator",target:"_blank",rel:"noopener noreferrer"}},[e._v("splashicon-generator"),r("OutboundLink")],1)]),e._v(" "),r("li",[r("a",{attrs:{href:"https://www.npmjs.com/package/Cordova-gen-icon",target:"_blank",rel:"noopener noreferrer"}},[e._v("Cordova-gen-icon"),r("OutboundLink")],1)]),e._v(" "),r("li",[r("a",{attrs:{href:"https://www.javascripttuts.com/how-to-automatically-generate-icons-and-splash-screens-with-the-ionic-cli/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Ionic CLI"),r("OutboundLink")],1)]),e._v(" "),r("li",[r("a",{attrs:{href:"https://github.com/AlexDisler/Cordova-icon",target:"_blank",rel:"noopener noreferrer"}},[e._v("Cordova-icon"),r("OutboundLink")],1)])]),e._v(" "),r("p",[e._v("You will find the example model icon/splash in "),r("em",[e._v("Cordova/model")]),e._v(" so that running "),r("a",{attrs:{href:"https://github.com/eberlitz/splashicon-generator",target:"_blank",rel:"noopener noreferrer"}},[e._v("splashicon-generator"),r("OutboundLink")],1),e._v(" in the "),r("em",[e._v("Cordova")]),e._v(" directory should work. "),r("strong",[e._v("Under windows")]),e._v(" take care to "),r("a",{attrs:{href:"https://github.com/eberlitz/splashicon-generator/issues/23",target:"_blank",rel:"noopener noreferrer"}},[e._v("this issue"),r("OutboundLink")],1),e._v(".")]),e._v(" "),r("h3",{attrs:{id:"plugins"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#plugins"}},[e._v("#")]),e._v(" Plugins")]),e._v(" "),r("p",[e._v("We rely on a bunch of Cordova plugins so it might be useful to refer to their specific issues:")]),e._v(" "),r("ul",[r("li",[r("a",{attrs:{href:"https://github.com/apache/Cordova-plugin-device",target:"_blank",rel:"noopener noreferrer"}},[e._v("Cordova-plugin-device"),r("OutboundLink")],1)]),e._v(" "),r("li",[r("a",{attrs:{href:"https://github.com/phonegap/phonegap-plugin-push",target:"_blank",rel:"noopener noreferrer"}},[e._v("phonegap-plugin-push"),r("OutboundLink")],1)]),e._v(" "),r("li",[r("a",{attrs:{href:"https://github.com/apache/Cordova-plugin-geolocation",target:"_blank",rel:"noopener noreferrer"}},[e._v("Cordova-plugin-geolocation"),r("OutboundLink")],1)]),e._v(" "),r("li",[r("a",{attrs:{href:"https://github.com/crosswalk-project/Cordova-plugin-crosswalk-webview",target:"_blank",rel:"noopener noreferrer"}},[e._v("Cordova-plugin-crosswalk-webview"),r("OutboundLink")],1)])]),e._v(" "),r("div",{staticClass:"custom-block danger"},[r("p",{staticClass:"custom-block-title"},[e._v("WARNING")]),e._v(" "),r("p",[e._v("The Crosswalk project seems to be "),r("a",{attrs:{href:"https://crosswalk-project.org/blog/crosswalk-final-release.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("discontinued"),r("OutboundLink")],1),e._v(", as a consequence there are some issues with recent Cordova versions like "),r("a",{attrs:{href:"https://github.com/apache/Cordova-android/pull/417",target:"_blank",rel:"noopener noreferrer"}},[e._v("this"),r("OutboundLink")],1),e._v(". We will probably drop it soon.")])]),e._v(" "),r("h2",{attrs:{id:"modules-plugins"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#modules-plugins"}},[e._v("#")]),e._v(" Modules/Plugins")]),e._v(" "),r("p",[e._v("Kalisio modules/plugins are "),r("a",{attrs:{href:"https://docs.feathersjs.com",target:"_blank",rel:"noopener noreferrer"}},[e._v("Feathers modules"),r("OutboundLink")],1),e._v(", so you will find most of the required information in the linked Feathers documentation. Typically for development you will do the following for each required plugins so that the module is re-compiled on each file change:")]),e._v(" "),r("div",{staticClass:"language-bash extra-class"},[r("pre",{pre:!0,attrs:{class:"language-bash"}},[r("code",[r("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" kdk\n"),r("span",{pre:!0,attrs:{class:"token function"}},[e._v("yarn")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v("\n"),r("span",{pre:!0,attrs:{class:"token function"}},[e._v("yarn")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token function"}},[e._v("watch")]),e._v("\n")])])]),r("h3",{attrs:{id:"linting-the-code-2"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#linting-the-code-2"}},[e._v("#")]),e._v(" Linting the code")]),e._v(" "),r("p",[e._v("The "),r("strong",[e._v("KDK")]),e._v(" relies on "),r("a",{attrs:{href:"https://github.com/feross/standard",target:"_blank",rel:"noopener noreferrer"}},[e._v("JavaScript standard style"),r("OutboundLink")],1),e._v(".")]),e._v(" "),r("p",[e._v("To lint the code:")]),e._v(" "),r("div",{staticClass:"language-bash extra-class"},[r("pre",{pre:!0,attrs:{class:"language-bash"}},[r("code",[r("span",{pre:!0,attrs:{class:"token variable"}},[e._v("$yarn")]),e._v(" lint\n")])])]),r("p",[e._v("You can also lint each of the submodules independently using the following commands:")]),e._v(" "),r("div",{staticClass:"language-bash extra-class"},[r("pre",{pre:!0,attrs:{class:"language-bash"}},[r("code",[r("span",{pre:!0,attrs:{class:"token variable"}},[e._v("$yarn")]),e._v(" lint:core   "),r("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# lint the core part")]),e._v("\n"),r("span",{pre:!0,attrs:{class:"token variable"}},[e._v("$yarn")]),e._v(" lint:map    "),r("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# lint the map part")]),e._v("\n")])])]),r("p",[e._v(":::")])])}),[],!1,null,null,null);t.default=a.exports}}]);