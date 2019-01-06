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
    "url": "_old_/guides/DEPLOY.html",
    "revision": "db33bed353efed9d2058307083694b60"
  },
  {
    "url": "_old_/guides/guides/DEPLOY.html",
    "revision": "9228922b87c3b830bf7917c983422a55"
  },
  {
    "url": "404.html",
    "revision": "03c7f368e285dedb7369c54fe0065ac3"
  },
  {
    "url": "about/introduction.html",
    "revision": "4a3f20800a3aa50e7d14bf6d3200df3c"
  },
  {
    "url": "about/license.html",
    "revision": "ea633356ed05e5dfd38c3baa6593f185"
  },
  {
    "url": "about/roadmap.html",
    "revision": "9ac59fa5ec56eccbf082478cda0d2485"
  },
  {
    "url": "assets/css/0.styles.c934418d.css",
    "revision": "18309ff288b175bd55a7ee313c41f97b"
  },
  {
    "url": "assets/img/component-view.a19a90c8.png",
    "revision": "a19a90c8dc0cafd027a5825b9dd3e077"
  },
  {
    "url": "assets/img/global-architecture.62f2e9b2.svg",
    "revision": "62f2e9b23f59d325b00376982b49ea43"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.b78a69b8.js",
    "revision": "c77a35a9270ea12a2af63cf2cfd3ea4f"
  },
  {
    "url": "assets/js/11.e31ce011.js",
    "revision": "1dbf88b3843fb438221e1a414fbe34cd"
  },
  {
    "url": "assets/js/12.b02ccd2e.js",
    "revision": "8ea6584b4f872f3ce76582875cad0409"
  },
  {
    "url": "assets/js/13.f95978f9.js",
    "revision": "a861ecdf573f2bd0e1bdbd774356e576"
  },
  {
    "url": "assets/js/14.a7cec42b.js",
    "revision": "4b812bc9fa1f52d23404d0a4a9360d1d"
  },
  {
    "url": "assets/js/15.773d37a6.js",
    "revision": "6c43a041328739858a5fc45d967436b5"
  },
  {
    "url": "assets/js/16.654157c2.js",
    "revision": "f2136e46853bc2ea7e658220630893fa"
  },
  {
    "url": "assets/js/2.7ebc69aa.js",
    "revision": "a89a1a8ee2c8ec93866bb704942284fe"
  },
  {
    "url": "assets/js/3.5628c351.js",
    "revision": "fe7383332a839f67df0cde936a747073"
  },
  {
    "url": "assets/js/4.3c3b9dee.js",
    "revision": "137f0ef6acf2633d3de80e2722af6c91"
  },
  {
    "url": "assets/js/5.605ce644.js",
    "revision": "a815b27799a327cdd6bcfc6128e904e4"
  },
  {
    "url": "assets/js/6.c80fc327.js",
    "revision": "898840e673181d99952dd6d91a087c7d"
  },
  {
    "url": "assets/js/7.0b3ec3a6.js",
    "revision": "d0bf69e4ec93fb8c76c1027044b7a784"
  },
  {
    "url": "assets/js/8.3dd71db3.js",
    "revision": "d00a2b0a3109a7bed12fdbf093ac5dd2"
  },
  {
    "url": "assets/js/9.c7958b55.js",
    "revision": "dfb4868c1af34b730afa251c69e1ddc8"
  },
  {
    "url": "assets/js/app.ccc3a75c.js",
    "revision": "63f6ae413445f05c68264390031df582"
  },
  {
    "url": "development/architecture.html",
    "revision": "76d6068205b1700d8bbb9219209ae95e"
  },
  {
    "url": "index.html",
    "revision": "5cc1f8c53b57c25eb16654c34106131c"
  },
  {
    "url": "modules/kbilling.html",
    "revision": "57e323289a9c7210ef6e132e763a2bec"
  },
  {
    "url": "modules/kcore.html",
    "revision": "2777ec81715d6447d7b34c3457a07213"
  },
  {
    "url": "modules/kevent.html",
    "revision": "a22a4131ba4d1ba57c8d402f7de17333"
  },
  {
    "url": "modules/kmap.html",
    "revision": "9e5002f5d19d285d4df468a2aac1f466"
  },
  {
    "url": "modules/knotify.html",
    "revision": "b782f9f49269c66e3aa52c0c24d8a78f"
  },
  {
    "url": "modules/kteam.html",
    "revision": "5d769f958bad16724562b066d627f598"
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
