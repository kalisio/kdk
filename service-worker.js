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
    "revision": "23ed4edfd8fadaa448bab3951c62e350"
  },
  {
    "url": "about/introduction.html",
    "revision": "14018099c91226687a2a77ad9501f6c7"
  },
  {
    "url": "about/license.html",
    "revision": "93251ac01589885f9f2f4d88fbb117af"
  },
  {
    "url": "about/roadmap.html",
    "revision": "5a920c4cd0e03af69203d8797bb9c0a3"
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
    "url": "assets/js/8.ca82bd33.js",
    "revision": "798548b2da1053f25dc30bf1628ed6f8"
  },
  {
    "url": "assets/js/9.97e33768.js",
    "revision": "156c7d7f947166fa501550327f1cfef2"
  },
  {
    "url": "assets/js/app.53e7d609.js",
    "revision": "4428337c22f86d2774809d00a85d1a42"
  },
  {
    "url": "CONTRIBUTING.html",
    "revision": "6920015f7d46ddb84dcf45abf901f4c7"
  },
  {
    "url": "development/architecture.html",
    "revision": "4016a902989587c3bb313ae7ca777460"
  },
  {
    "url": "index.html",
    "revision": "db5765eeba541fcc3f4228cc652cc162"
  },
  {
    "url": "LICENSE.html",
    "revision": "4cc7a717704a2fdcc25b0004e1b2d567"
  },
  {
    "url": "modules/kbilling.html",
    "revision": "4e1630ab489df43eebbbf6a8f869f192"
  },
  {
    "url": "modules/kcore.html",
    "revision": "0370e5c177e0dbee9cb26950a7074c87"
  },
  {
    "url": "modules/kevent.html",
    "revision": "250fb80362fb08f0c32b701c1e16c025"
  },
  {
    "url": "modules/kmap.html",
    "revision": "fe0b0001d88687db03df1f89042f27e0"
  },
  {
    "url": "modules/knotify.html",
    "revision": "26ade7bbb52f7fc865401a2686d062b2"
  },
  {
    "url": "modules/kteam.html",
    "revision": "0a875655ffebe1ee82fc50733803c58d"
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
