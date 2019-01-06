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
    "revision": "bba9abaae3edab56182be723bd9ee7b2"
  },
  {
    "url": "about/contributing.html",
    "revision": "597d995a00633ea868bccf1c0486e299"
  },
  {
    "url": "about/introduction.html",
    "revision": "a24f506b2097b0285fe4b3fb910bbaf9"
  },
  {
    "url": "about/license.html",
    "revision": "3933a994868ce2bae477a5e3b5688a0f"
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
    "url": "assets/js/3.448912c5.js",
    "revision": "df16766fd2845e1ac6e1231e1fe31dbe"
  },
  {
    "url": "assets/js/4.d5929984.js",
    "revision": "b9ed6c1c7b3cafca61de2ff0f635e858"
  },
  {
    "url": "assets/js/5.561f879d.js",
    "revision": "7825cffce407004086ba76c59a993cce"
  },
  {
    "url": "assets/js/6.e8492aff.js",
    "revision": "6502de3fc159817ef1ccc7c342122037"
  },
  {
    "url": "assets/js/7.a395c0cb.js",
    "revision": "22543772bc4fc1e160e4f15a3037011e"
  },
  {
    "url": "assets/js/8.aaad9cc2.js",
    "revision": "6e56bc9f8377b1f6e83eb59e67ffd18b"
  },
  {
    "url": "assets/js/9.ef445e94.js",
    "revision": "fa4634529913950bd3e6786170bc0c8a"
  },
  {
    "url": "assets/js/app.7aa7fe06.js",
    "revision": "af60f48d14802ca8648e8e57d1596db7"
  },
  {
    "url": "CONTRIBUTING.html",
    "revision": "0d934d8fe4344fb86f4539e21040ce51"
  },
  {
    "url": "index.html",
    "revision": "822bd3f38a8634fddd11ba2947a544e5"
  },
  {
    "url": "LICENSE.html",
    "revision": "3ac8ab2a99c13bd870267d27aaab6b2f"
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
