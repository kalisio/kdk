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
    "revision": "02f6fb2c78886342f6f3e6bb52f87459"
  },
  {
    "url": "_old_/guides/guides/DEPLOY.html",
    "revision": "df567b7a5ca54ba1787d1433fd549a1b"
  },
  {
    "url": "404.html",
    "revision": "0472b16fa7572e8a37717884a9dae3b8"
  },
  {
    "url": "about/introduction.html",
    "revision": "83bfd4ffcdbe2b4860ae0c2dd8690b30"
  },
  {
    "url": "about/license.html",
    "revision": "568345011c619b73cce23dbb3423079b"
  },
  {
    "url": "about/roadmap.html",
    "revision": "83488a798fb38e3ba0c1d9e9b39e549a"
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
    "url": "assets/js/8.f30bd193.js",
    "revision": "37ac6203c5b7a09695c38c07b4e15f24"
  },
  {
    "url": "assets/js/9.c7958b55.js",
    "revision": "dfb4868c1af34b730afa251c69e1ddc8"
  },
  {
    "url": "assets/js/app.1e40003c.js",
    "revision": "5cd8cd427bc6f8ac5bbef0f3cb137dc0"
  },
  {
    "url": "development/architecture.html",
    "revision": "0769ecf8b3ad72098dec94a80f1aa4e2"
  },
  {
    "url": "index.html",
    "revision": "056e73395c10311068f440da7ce0b95f"
  },
  {
    "url": "modules/kbilling.html",
    "revision": "888133eb64892ef1cf4b80179243fe0a"
  },
  {
    "url": "modules/kcore.html",
    "revision": "7526d85198efac4c6445d54e3031af4a"
  },
  {
    "url": "modules/kevent.html",
    "revision": "3b24aca306df7fc02390b35cb3f1af51"
  },
  {
    "url": "modules/kmap.html",
    "revision": "9b227d669c0a4f633112d4e288d642cb"
  },
  {
    "url": "modules/knotify.html",
    "revision": "14c3f32218f21f9fc2300a9320b82695"
  },
  {
    "url": "modules/kteam.html",
    "revision": "db52b7e4cdfba761bfc1555aca49558c"
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
