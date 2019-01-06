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
    "revision": "f1a9dd3f0f7b8e10310fcea918ab1a3c"
  },
  {
    "url": "about/introduction.html",
    "revision": "5d32b065f1e09fd95a7466c9b0839ba1"
  },
  {
    "url": "about/license.html",
    "revision": "d1cade2c0ed6c129bd8a4574a7e5122b"
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
    "url": "assets/js/3.9aa2f797.js",
    "revision": "0a18420bb0a8c3a0a75e814d4c395844"
  },
  {
    "url": "assets/js/4.d5929984.js",
    "revision": "b9ed6c1c7b3cafca61de2ff0f635e858"
  },
  {
    "url": "assets/js/5.9588eea2.js",
    "revision": "f1b1eb5a046cbf8a81c855d565417032"
  },
  {
    "url": "assets/js/6.cb1dd798.js",
    "revision": "3d13303bf332b5862ec406dd97dbc927"
  },
  {
    "url": "assets/js/7.9db402ad.js",
    "revision": "b079bcbbc6edc3c99e756338e6ad1fab"
  },
  {
    "url": "assets/js/8.18771c68.js",
    "revision": "d50cc621002cf1ae42547cf7b16d8949"
  },
  {
    "url": "assets/js/app.9f7e62d6.js",
    "revision": "4e4a12d2fe7a1b7e70ffe022398a9026"
  },
  {
    "url": "CONTRIBUTING.html",
    "revision": "de6fc0301571e43b9494b8d46d5b4ee8"
  },
  {
    "url": "index.html",
    "revision": "003ccdbcd0f0381827f9c4eb26a9d371"
  },
  {
    "url": "LICENSE.html",
    "revision": "b808e988f811ab740302ba9ed2453787"
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
