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
    "revision": "aef791eaab604107662f74a455ccfdcc"
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
    "url": "assets/js/6.e4183601.js",
    "revision": "20fe69fd72102af6e807897cc2ab5970"
  },
  {
    "url": "assets/js/7.071a6cc7.js",
    "revision": "5b30b4d95f5e6086fc0c518e78e6289d"
  },
  {
    "url": "assets/js/app.2f90bc9e.js",
    "revision": "095b72ab8923a3121d74d409b2a88b20"
  },
  {
    "url": "CONTRIBUTING.html",
    "revision": "4908141fa4e8c65d406b7e7277663f70"
  },
  {
    "url": "index.html",
    "revision": "ffcd29652ab540b28ebd8cc2217b3384"
  },
  {
    "url": "LICENSE.html",
    "revision": "8fc148001b0819663520908771a00237"
  },
  {
    "url": "what-is-it/index.html",
    "revision": "628e13ca1ef27fbbc62c2ec9b02f182a"
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
