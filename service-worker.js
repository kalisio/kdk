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
    "revision": "418e28ca9aa5558796e01795e236d38f"
  },
  {
    "url": "_old_/guides/guides/DEPLOY.html",
    "revision": "00c2e3bb8100751723e5f5399f35e49d"
  },
  {
    "url": "404.html",
    "revision": "3eeaf408f3f28002218849f58e92b864"
  },
  {
    "url": "about/introduction.html",
    "revision": "88dd022811a7f108722a8a38a98778f7"
  },
  {
    "url": "about/license.html",
    "revision": "3cb84f2073d29c22fb20e46602b8a840"
  },
  {
    "url": "about/roadmap.html",
    "revision": "6c6fab31a8bb1168f3f2d22b460d5ffb"
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
    "url": "assets/js/10.e3e316cf.js",
    "revision": "981e9c95dfad81cfbebd57a0900a5c10"
  },
  {
    "url": "assets/js/11.bcfd061c.js",
    "revision": "d9c1ef8c54f72ac512baca1296c67d2d"
  },
  {
    "url": "assets/js/12.fbdf05a2.js",
    "revision": "7cf44d017b2b2b3e2c13d95ddeb4fc47"
  },
  {
    "url": "assets/js/13.80f2424a.js",
    "revision": "2c3f8c145a0cae1ebb5b74fb0ca58b0f"
  },
  {
    "url": "assets/js/14.b236acca.js",
    "revision": "036bd72fc126f2ac86e9ca442fa0673d"
  },
  {
    "url": "assets/js/15.8119675c.js",
    "revision": "c2ba91cd255af1dd006011317abe33d3"
  },
  {
    "url": "assets/js/16.efd2b033.js",
    "revision": "fe19be302da8b22ce661146305840c81"
  },
  {
    "url": "assets/js/17.6c764e91.js",
    "revision": "f576d5a77d385e7401815f304150bc09"
  },
  {
    "url": "assets/js/18.bb73a275.js",
    "revision": "45775be9630990f1e61a6b7dbc8b972c"
  },
  {
    "url": "assets/js/2.e346cfdb.js",
    "revision": "c224eca6186b4c81228bda39010e6468"
  },
  {
    "url": "assets/js/3.5628c351.js",
    "revision": "fe7383332a839f67df0cde936a747073"
  },
  {
    "url": "assets/js/4.c5917bd8.js",
    "revision": "dba44b4839d0bfcdcc59519a11c79b83"
  },
  {
    "url": "assets/js/5.2ea0bc4c.js",
    "revision": "3903a888690e459e6f99ca40e2cd83e7"
  },
  {
    "url": "assets/js/6.3c25618b.js",
    "revision": "346917a023c275236a9a47ae4c546593"
  },
  {
    "url": "assets/js/7.d83371be.js",
    "revision": "ab49c65b2b0afe8824b6270cbb84fe8d"
  },
  {
    "url": "assets/js/8.a59d9c65.js",
    "revision": "e9e6de77bc437609e27ffe1b398400d7"
  },
  {
    "url": "assets/js/9.b3c30bdd.js",
    "revision": "a05e52f42f36d6f410dfaa2ec0a67e6f"
  },
  {
    "url": "assets/js/app.9af0895d.js",
    "revision": "a080d566feef9ba859da4f46d0ab61a4"
  },
  {
    "url": "CONTRIBUTING.html",
    "revision": "a7c0c416cfe3b9524f3a8af16a673db5"
  },
  {
    "url": "development/architecture.html",
    "revision": "628d3e2161528fa0d4a65a808dad63f3"
  },
  {
    "url": "index.html",
    "revision": "cb0b1def7b697b45c14c722415229cd7"
  },
  {
    "url": "LICENSE.html",
    "revision": "33847e083647a8d1452d9ae961d1d33e"
  },
  {
    "url": "modules/kbilling.html",
    "revision": "f0c03eae5a99b3485ba128952a40bdae"
  },
  {
    "url": "modules/kcore.html",
    "revision": "5f7ce298b3940e2d6567e2ee50e1e0ae"
  },
  {
    "url": "modules/kevent.html",
    "revision": "003d020f318bc3b4d921bb29d6788798"
  },
  {
    "url": "modules/kmap.html",
    "revision": "b4e0c6313c98222949489641155cb156"
  },
  {
    "url": "modules/knotify.html",
    "revision": "38d15bf4dba7ff1a823db5cf67f019dc"
  },
  {
    "url": "modules/kteam.html",
    "revision": "be3a13a8a55c30857654c71eb13e9806"
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
