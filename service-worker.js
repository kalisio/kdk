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
    "revision": "c3c8c2927ccee4dc2d681dd444db519a"
  },
  {
    "url": "about/introduction.html",
    "revision": "6501eb01aca8dbacd861644dc61f0e79"
  },
  {
    "url": "about/license.html",
    "revision": "33a326e5e7982bc86a1e3f80156d9108"
  },
  {
    "url": "about/roadmap.html",
    "revision": "25cb2fe5b1513e03263b745caa20329c"
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
    "url": "assets/js/10.63140c71.js",
    "revision": "4a9306de7fa89d0684b4c8023fac1be9"
  },
  {
    "url": "assets/js/11.5af273bf.js",
    "revision": "9966f0075cab0d6734eef86adad2624a"
  },
  {
    "url": "assets/js/12.e037e988.js",
    "revision": "b5826f39d4c7e0b7ae6b22b04b793414"
  },
  {
    "url": "assets/js/13.64233503.js",
    "revision": "b65c4d579ef74d1c9712f7523ccd8d4a"
  },
  {
    "url": "assets/js/14.2ef5460a.js",
    "revision": "b082913f4ee09e1433d896d3105f94ef"
  },
  {
    "url": "assets/js/15.aa964f38.js",
    "revision": "660a796c20e0598d8bc7799f6752d71d"
  },
  {
    "url": "assets/js/16.028a6ba9.js",
    "revision": "e05a2ff388abbb41429b18f48cf99baf"
  },
  {
    "url": "assets/js/2.0615a57a.js",
    "revision": "1ffa9ffdde55531e8d69e9d487ea52b8"
  },
  {
    "url": "assets/js/3.eedbabb8.js",
    "revision": "fae8aea3f8d035be1339e4febe746f19"
  },
  {
    "url": "assets/js/4.46b2cac8.js",
    "revision": "db6220e111e8f378c799f7a6ff60f75e"
  },
  {
    "url": "assets/js/5.8603d9da.js",
    "revision": "9bbf7d2180d6863d6b1eadd1f46d48c7"
  },
  {
    "url": "assets/js/6.fba59f4c.js",
    "revision": "cffd33b180983cf77d424259cfaa814a"
  },
  {
    "url": "assets/js/7.0dd64a80.js",
    "revision": "509084343994463925b9038a5ee1f654"
  },
  {
    "url": "assets/js/8.f18f60dd.js",
    "revision": "170fb9ddd6c1d1d005ba005e03eeb42c"
  },
  {
    "url": "assets/js/9.97e33768.js",
    "revision": "156c7d7f947166fa501550327f1cfef2"
  },
  {
    "url": "assets/js/app.9364c7bf.js",
    "revision": "55f85872c395bd9870da86dfaaaee08d"
  },
  {
    "url": "CONTRIBUTING.html",
    "revision": "1aebe5836abf4a8f3bebff215071b5af"
  },
  {
    "url": "development/architecture.html",
    "revision": "93ab5a8b816f4fd799185b06e12a3613"
  },
  {
    "url": "index.html",
    "revision": "081bf98022ae5052a769f724810f1ce3"
  },
  {
    "url": "LICENSE.html",
    "revision": "2e8b2e1554b50585c764e41157dc8448"
  },
  {
    "url": "modules/kbilling.html",
    "revision": "5882a14db2069dabe5fa032a1baf8b25"
  },
  {
    "url": "modules/kcore.html",
    "revision": "2c84a0fb9ca8341fc1c6690bf7b24af3"
  },
  {
    "url": "modules/kevent.html",
    "revision": "97df02714ddd7bb6c6bd5f767911939e"
  },
  {
    "url": "modules/kmap.html",
    "revision": "a270018f1b0921c249b31756d5dfef26"
  },
  {
    "url": "modules/knotify.html",
    "revision": "c0820dcd836e6a18f458c967bb1cd222"
  },
  {
    "url": "modules/kteam.html",
    "revision": "d84f706d6ec5b3f55e3d190b66caa8d9"
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
