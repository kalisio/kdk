/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "5cff287b2a42278060eec86077ffcd36"
  },
  {
    "url": "assets/css/0.styles.c934418d.css",
    "revision": "18309ff288b175bd55a7ee313c41f97b"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/2.e081efaf.js",
    "revision": "60235e4657444b246f7d63bc6b15dc84"
  },
  {
    "url": "assets/js/3.4c50859d.js",
    "revision": "632a0f0a262ec65a743ead6387ac31de"
  },
  {
    "url": "assets/js/4.d447d9b2.js",
    "revision": "9a5b4c340be2030b1961c08dbdbb1f35"
  },
  {
    "url": "assets/js/5.25aaf316.js",
    "revision": "ee60af664222da01fc2a4397a2a00b6e"
  },
  {
    "url": "assets/js/6.e4183601.js",
    "revision": "20fe69fd72102af6e807897cc2ab5970"
  },
  {
    "url": "assets/js/7.071a6cc7.js",
    "revision": "5b30b4d95f5e6086fc0c518e78e6289d"
  },
  {
    "url": "assets/js/app.e836ef7f.js",
    "revision": "bab3752dfa9d645085f5d8899ee790dd"
  },
  {
    "url": "CONTRIBUTING.html",
    "revision": "828004785bed827302830e72781f2c58"
  },
  {
    "url": "index.html",
    "revision": "a786f8929fb72b7cc5a40b171b6200e7"
  },
  {
    "url": "LICENSE.html",
    "revision": "d4900f9fbacc29fef5548d4222b3c3a9"
  },
  {
    "url": "what-is-it/index.html",
    "revision": "6796f2581d86f6f11e9ab2f3b6b1c6fb"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
