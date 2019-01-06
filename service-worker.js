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
    "revision": "b664ae92cb59ee8dd4563ad624064a7f"
  },
  {
    "url": "about/introduction.html",
    "revision": "1fcd793ab84002df4a29ecddf9ed04cc"
  },
  {
    "url": "about/license.html",
    "revision": "d1663676cb53ed91ee1f53a349a00752"
  },
  {
    "url": "about/roadmap.html",
    "revision": "ae81b0edc9dcf37ff1edbe5f5641112b"
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
    "url": "assets/js/7.c26dd8cf.js",
    "revision": "2d429e84ceb09518c669b24e40b4e3ff"
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
    "url": "assets/js/app.63bc01fe.js",
    "revision": "d643b84a6ab7f768df5702d247c20c3d"
  },
  {
    "url": "CONTRIBUTING.html",
    "revision": "c6f06fb7d3cb8cbed01a679b314be9b0"
  },
  {
    "url": "development/architecture.html",
    "revision": "b54774cbc72a3b42e7c8c4c3ed1dade4"
  },
  {
    "url": "index.html",
    "revision": "f99a76b1bd13c85f026d731bf76fdd37"
  },
  {
    "url": "LICENSE.html",
    "revision": "81d27bad8e97950cd83ceb48bf371c09"
  },
  {
    "url": "modules/kbilling.html",
    "revision": "569e8a0aaa27ab85e06c5616d15c033d"
  },
  {
    "url": "modules/kcore.html",
    "revision": "6d53b4241480fff8ed2074992e9b6b47"
  },
  {
    "url": "modules/kevent.html",
    "revision": "bb3f07e3517ba3af99f3609ed2a6fbf0"
  },
  {
    "url": "modules/kmap.html",
    "revision": "c36aa26ceee85ef1c392cdba32aeb1c7"
  },
  {
    "url": "modules/knotify.html",
    "revision": "49932642867eff2e55259ae1f940d400"
  },
  {
    "url": "modules/kteam.html",
    "revision": "4a72fe661ce9aeddd78043c311c850a5"
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
