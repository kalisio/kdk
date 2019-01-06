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
    "revision": "823874a62f29dccd1ad8776ce616fc46"
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
    "url": "assets/js/4.8c10f1fc.js",
    "revision": "2f82192379efe3f414c371bc7bd0febd"
  },
  {
    "url": "assets/js/5.30391395.js",
    "revision": "9c946c81685ec67094d135e23e8bb155"
  },
  {
    "url": "assets/js/6.641a182e.js",
    "revision": "c41e2ded2dec173cd7adae2cf16de808"
  },
  {
    "url": "assets/js/7.071a6cc7.js",
    "revision": "5b30b4d95f5e6086fc0c518e78e6289d"
  },
  {
    "url": "assets/js/app.6c78b500.js",
    "revision": "840475417bdb1be37d49e268bddef30e"
  },
  {
    "url": "CONTRIBUTING.html",
    "revision": "c3ffc9a27ff17c97142d6d3df4426ef9"
  },
  {
    "url": "index.html",
    "revision": "63de12f0bc582458e0559bd896c4d41a"
  },
  {
    "url": "LICENSE.html",
    "revision": "550f3ece8f42c4cba7763a944a92f9b5"
  },
  {
    "url": "what-is-it/index.html",
    "revision": "9fed1d13c3b34fa9ba60221917e763f4"
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
