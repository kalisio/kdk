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
    "revision": "839a0fbc242d2dc0ded7c44b1b1d7af1"
  },
  {
    "url": "about/introduction.html",
    "revision": "06e0cce95617db669c936644c60b09c5"
  },
  {
    "url": "about/license.html",
    "revision": "368271e21329868e374293ce902b4f03"
  },
  {
    "url": "about/roadmap.html",
    "revision": "f4d088a0f593c0c8af2c4450ef7e1beb"
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
    "url": "assets/js/7.ed6398f5.js",
    "revision": "d804c8e6e8c339931c24ca5d979bd910"
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
    "url": "assets/js/app.8fe01c2c.js",
    "revision": "5b7d1b1ff448836b27e02b40cbbb2f08"
  },
  {
    "url": "CONTRIBUTING.html",
    "revision": "6b04257dfe2cf4734eea1274df884a4c"
  },
  {
    "url": "development/architecture.html",
    "revision": "5a5cea5bd40b5c9f3e5dab057f78fe75"
  },
  {
    "url": "index.html",
    "revision": "2ceacc3f2e763b271ea67c4444b8fecc"
  },
  {
    "url": "LICENSE.html",
    "revision": "6c418fe58918bcaddca9cdcba5912735"
  },
  {
    "url": "modules/kbilling.html",
    "revision": "71183a6e7f1541473d84217a12d35e2c"
  },
  {
    "url": "modules/kcore.html",
    "revision": "df30f8c84afbcef9a4540023aa3414eb"
  },
  {
    "url": "modules/kevent.html",
    "revision": "753d326e9464bf55ceedb7ea5542146f"
  },
  {
    "url": "modules/kmap.html",
    "revision": "b758812c476f557c5f16214ae34ae3f4"
  },
  {
    "url": "modules/knotify.html",
    "revision": "28c1019d4fe3b58219d93d024f967967"
  },
  {
    "url": "modules/kteam.html",
    "revision": "6bd1d8a672f2e76af60eb40689adbab5"
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
