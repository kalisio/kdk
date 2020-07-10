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

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "f44479cb055fd6844cc1a549d462ddf6"
  },
  {
    "url": "about/contact.html",
    "revision": "6e422568a5537f35e918220dbf6380f6"
  },
  {
    "url": "about/contributing.html",
    "revision": "63d8015cbac2ddb99266feb95b5badc5"
  },
  {
    "url": "about/index.html",
    "revision": "e144d3d061df2f6b33e9d1947149dd99"
  },
  {
    "url": "about/license.html",
    "revision": "b9ec9e7d4fffca12e9196bc63c1838b3"
  },
  {
    "url": "about/roadmap.html",
    "revision": "8d0adbab785bcf8cdeb3f581fbce029e"
  },
  {
    "url": "api/core/application.html",
    "revision": "5f5e0f127464fde0eb7dcffa17b68cf2"
  },
  {
    "url": "api/core/components.html",
    "revision": "6d64ccc6d37c67c72da52979d5c516fe"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "8c36763cfa6e5ef4b9742e1d9f2b2f91"
  },
  {
    "url": "api/core/index.html",
    "revision": "13aa505ea03442194218016d41b8855a"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "627b0b4445f28f1df4c7fbb6e8670065"
  },
  {
    "url": "api/core/services.html",
    "revision": "c5c29ea96394a84f9dca8d3fe07bd482"
  },
  {
    "url": "api/index.html",
    "revision": "df80f8cbe0ccd03614cda53d7c3ab544"
  },
  {
    "url": "api/map/components.html",
    "revision": "92882a86af793802014d2aad0e6008f2"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "ef3ac06794cb972846296d524177172d"
  },
  {
    "url": "api/map/index.html",
    "revision": "652b73ad9a43fb2a55ea4e916decb439"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "b0b6ddea4c04b67ee518a62cc536b496"
  },
  {
    "url": "api/map/services.html",
    "revision": "7981ada6fb316278dea73c4f0ef4a854"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "bcf4115e3f7fc2009b06b9707d84c135"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "b98f34870818e3dcd21ce8c852a27e9b"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "fd620c0ac7cbc1be5c99db67166d6097"
  },
  {
    "url": "architecture/index.html",
    "revision": "9a19f3b71db56992e2f169d2a41497f1"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "b9f5b321bbf23004f80334b3ff00c58f"
  },
  {
    "url": "assets/css/0.styles.be5e49f6.css",
    "revision": "fae068808c1c3a8f81a1b90be35d1766"
  },
  {
    "url": "assets/img/aggregated-feature-data-model.688823b1.png",
    "revision": "688823b1d38b25a2bf17ca95920def55"
  },
  {
    "url": "assets/img/aktnmap-layout.7dce3192.png",
    "revision": "7dce31929edd640a0491536514cbe7b9"
  },
  {
    "url": "assets/img/application-hooks.e15ca2e0.svg",
    "revision": "e15ca2e0e0ce1b30ac2716348e14cc33"
  },
  {
    "url": "assets/img/authorisations-hooks.223455bf.png",
    "revision": "223455bfff7bf51dddf7721b4a40d5f6"
  },
  {
    "url": "assets/img/catalog-data-model.998b319c.png",
    "revision": "998b319c85f0c564838fe6886a1aa5b3"
  },
  {
    "url": "assets/img/cd-pipeline-android.aac6a2e0.svg",
    "revision": "aac6a2e0ae4e0a08d62434fc4f9e700c"
  },
  {
    "url": "assets/img/cd-pipeline-app.f5ae4922.svg",
    "revision": "f5ae4922e9e2a5263b805ee8a1cd1779"
  },
  {
    "url": "assets/img/cd-pipeline-env.e2075fb1.svg",
    "revision": "e2075fb1bb069e7f46ea7f0a880df06b"
  },
  {
    "url": "assets/img/cd-pipeline-global.bf86d245.svg",
    "revision": "bf86d245695e16937bf9f6e08c38b0ad"
  },
  {
    "url": "assets/img/cd-pipeline-ios.b4f66a54.svg",
    "revision": "b4f66a5494f77e98899d44a066515ed0"
  },
  {
    "url": "assets/img/cd-pipeline-travis.5e40ee62.svg",
    "revision": "5e40ee62f8c213080bcd46106366ccbd"
  },
  {
    "url": "assets/img/component-view.de49f2d5.png",
    "revision": "de49f2d54005249f92b47c78e46776cc"
  },
  {
    "url": "assets/img/domain-model.0547d09f.svg",
    "revision": "0547d09ff803394e1f2d859c04728556"
  },
  {
    "url": "assets/img/editor-lifecycle.174bae43.png",
    "revision": "174bae432562fed4c258bc985253d0ac"
  },
  {
    "url": "assets/img/feature-data-model.de64ed49.png",
    "revision": "de64ed4936ffd7dc5ee67482f140cbba"
  },
  {
    "url": "assets/img/feature-hooks.c545f93a.png",
    "revision": "c545f93a07bb3da5d461aaf310813751"
  },
  {
    "url": "assets/img/global-architecture.62f2e9b2.svg",
    "revision": "62f2e9b23f59d325b00376982b49ea43"
  },
  {
    "url": "assets/img/groups-data-model.437e9630.svg",
    "revision": "437e963022b899ff09e989224a42ba90"
  },
  {
    "url": "assets/img/hooks-diagram-template.bf7579e1.png",
    "revision": "bf7579e1f6e36a2f9585242446149c20"
  },
  {
    "url": "assets/img/item-collections.59bf2c4c.png",
    "revision": "59bf2c4c802c8fc5c68c359ecfa95398"
  },
  {
    "url": "assets/img/kano-3D.65e359f9.png",
    "revision": "65e359f95783bb99097fc5b763ec4151"
  },
  {
    "url": "assets/img/kano-components.ad92b7e2.png",
    "revision": "ad92b7e2f4bf02c26bb9e24b67f19b11"
  },
  {
    "url": "assets/img/kano-layout.702937a9.png",
    "revision": "702937a910e38ce3e140ae86cbfd5b3c"
  },
  {
    "url": "assets/img/kano-weather.2b6d4bbf.png",
    "revision": "2b6d4bbfa0992bbbbaae5745b2a7db4b"
  },
  {
    "url": "assets/img/kdk-workspace.d228efd0.png",
    "revision": "d228efd0427f5ee0027e9557bf11f9c8"
  },
  {
    "url": "assets/img/layers-panel.def38fe5.png",
    "revision": "def38fe54ce12f8b11b1d523eeacbaec"
  },
  {
    "url": "assets/img/marker-cluster-2D.63ae3032.png",
    "revision": "63ae3032f9266059c3d95ccb402b0608"
  },
  {
    "url": "assets/img/marker-cluster-3D.e8927429.png",
    "revision": "e892742919b7d249bada3f31153e11fa"
  },
  {
    "url": "assets/img/organizations-data-model.0d40de04.svg",
    "revision": "0d40de04d4ac06c438ad08de62bdbf6b"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/img/storage-hooks.f7cd9bef.png",
    "revision": "f7cd9befe2f959dfbe39b009dcda2ea0"
  },
  {
    "url": "assets/img/tags-hooks.19298e57.png",
    "revision": "19298e5708cae740717b9063f3f8868c"
  },
  {
    "url": "assets/img/timeseries.370f7197.png",
    "revision": "370f7197130302dce62fdcd4d3be49ea"
  },
  {
    "url": "assets/img/users-data-model.e037f5f6.svg",
    "revision": "e037f5f6dd66241e355c8f7b559237e4"
  },
  {
    "url": "assets/img/users-hooks.506d5935.png",
    "revision": "506d59353934862bbe3bb0fb5210ffdc"
  },
  {
    "url": "assets/js/10.9a7a60d0.js",
    "revision": "b98964b320e72df8258d37d4c86486c7"
  },
  {
    "url": "assets/js/11.f547d344.js",
    "revision": "ebc807f7259125c0bbb2e109b37d9b1e"
  },
  {
    "url": "assets/js/12.202b719d.js",
    "revision": "629497688424a444b4b65f48c20b3d0e"
  },
  {
    "url": "assets/js/13.c04d3589.js",
    "revision": "29116afc0efc394634f6d2aae8f51d38"
  },
  {
    "url": "assets/js/14.2d9b4973.js",
    "revision": "15c469d8dfd6d13c966aa9f7d228e8a5"
  },
  {
    "url": "assets/js/15.b3e46354.js",
    "revision": "8a9375fd8876a3da292ccc920dcb495e"
  },
  {
    "url": "assets/js/16.85bb4331.js",
    "revision": "a5da87552e6a378768658d4c94f34869"
  },
  {
    "url": "assets/js/17.55762bcd.js",
    "revision": "bc25fe42a3f678d607e76994483a3d48"
  },
  {
    "url": "assets/js/18.c2630b84.js",
    "revision": "2dfffe3bd4f568150188b42ebb5b3fbd"
  },
  {
    "url": "assets/js/19.3ce75162.js",
    "revision": "14a635a7727f77311e70386e90fa7122"
  },
  {
    "url": "assets/js/2.b84e3a27.js",
    "revision": "01ed428ce1af7ebd09023f223959a755"
  },
  {
    "url": "assets/js/20.fc6d40c8.js",
    "revision": "500c7b73eb03f90ba85f18f629a3cf55"
  },
  {
    "url": "assets/js/21.4a5cd3aa.js",
    "revision": "ded282b001fa55d272c8abc3ddcdc204"
  },
  {
    "url": "assets/js/22.84ae16c2.js",
    "revision": "36d16d649de16cd6d5654949a8d6a3fd"
  },
  {
    "url": "assets/js/23.219edd51.js",
    "revision": "04d96b1f65f929a681ab5c90ccd98c24"
  },
  {
    "url": "assets/js/24.bf7b406a.js",
    "revision": "8fa55cfe437bf0525749e69407f74813"
  },
  {
    "url": "assets/js/25.28829694.js",
    "revision": "c4729eda18ff0d2978d0e1df9a64a0e1"
  },
  {
    "url": "assets/js/26.09c0d336.js",
    "revision": "cdbe69bf8eacf0bb8053871000764b09"
  },
  {
    "url": "assets/js/27.2eddd959.js",
    "revision": "5e485f84c03e881da4630a6fa4649e2b"
  },
  {
    "url": "assets/js/28.cdce61b4.js",
    "revision": "fc3859d87bcfd9a598888492ac22c89e"
  },
  {
    "url": "assets/js/29.bc29f96c.js",
    "revision": "4f8e0c45a20d8ed9c558bc3f46bc100a"
  },
  {
    "url": "assets/js/3.038ace67.js",
    "revision": "d8a939a97a635a1aa5a74444ed70602e"
  },
  {
    "url": "assets/js/30.bcd6bb80.js",
    "revision": "a5543cd89e89275115659a7cb65865a0"
  },
  {
    "url": "assets/js/31.55925014.js",
    "revision": "af44678d923af2a6c6f1981a35910dad"
  },
  {
    "url": "assets/js/32.e80a9c46.js",
    "revision": "cd042808747d433d1890b242bcf20148"
  },
  {
    "url": "assets/js/33.d70f888c.js",
    "revision": "e0af3e4c1a122740ab9c598b519e0dbf"
  },
  {
    "url": "assets/js/34.567e6f74.js",
    "revision": "482d8e4f263aae77ac54609c350e48bd"
  },
  {
    "url": "assets/js/35.b9f2d41b.js",
    "revision": "7f21b95f52be24ce291b245b24964152"
  },
  {
    "url": "assets/js/36.e9606c59.js",
    "revision": "73cba767d8ec49a9a61c77fc8032fb73"
  },
  {
    "url": "assets/js/37.124afb38.js",
    "revision": "6d1daa0ac76f35a82866ded9a05896c7"
  },
  {
    "url": "assets/js/38.85aa41ac.js",
    "revision": "65e117871c38c127e31b623958bd7a80"
  },
  {
    "url": "assets/js/39.a15e6c89.js",
    "revision": "08f50444075db08788f1b65cff144c31"
  },
  {
    "url": "assets/js/4.aafc6d9f.js",
    "revision": "61b9e82ee23c581563c1141b5401ed51"
  },
  {
    "url": "assets/js/40.06e1995a.js",
    "revision": "c0ea865013b593f3616b85069fa25ed3"
  },
  {
    "url": "assets/js/41.08627c68.js",
    "revision": "498206aa0df75f4ce158660fc2a42efc"
  },
  {
    "url": "assets/js/42.4b84ac28.js",
    "revision": "b2977ce201466169fee1cad8a3506fb0"
  },
  {
    "url": "assets/js/43.62e892a4.js",
    "revision": "2612a7f219355725fe8d39cbd9c8cb1e"
  },
  {
    "url": "assets/js/44.d038a9e8.js",
    "revision": "a36dd3f21eedc91d251e5a5606111fa1"
  },
  {
    "url": "assets/js/5.182fa82f.js",
    "revision": "1a81baa11ab94dd89bbd645732b1448b"
  },
  {
    "url": "assets/js/6.b89c564d.js",
    "revision": "a06d18e65ee4c3ab2406e6d82a893df6"
  },
  {
    "url": "assets/js/7.565ed12c.js",
    "revision": "92d1dd3fd1f1f2af59621b9bb9610816"
  },
  {
    "url": "assets/js/8.307fa4dc.js",
    "revision": "a1752c30a75d0d48fe9d3cb43e685c76"
  },
  {
    "url": "assets/js/9.6a1d0cd9.js",
    "revision": "03d3e007d30a9f5eae44207d25fdc5a1"
  },
  {
    "url": "assets/js/app.4fbaa551.js",
    "revision": "3ea21bdba0ff119c08452365c153eb8d"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "cb64cc52725954881da28d786dccb9bf"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "d7384e8a757913f685ca562c0e0bf373"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "9db970ff125d69558d3ad8ecd03aefc7"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "cbc18dd37c18019db4dc101da10005dd"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "5f7595c1f849409fc59ddb626d3e3eaa"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "7c4b5710b1b3abd46a556682fca6e169"
  },
  {
    "url": "guides/index.html",
    "revision": "a2797d1285416f84d1c67dcfc026b777"
  },
  {
    "url": "index.html",
    "revision": "9c1978d3948eb933bae4d3604ffb80dc"
  },
  {
    "url": "tips.html",
    "revision": "72ca3b621f8018488c2ac72e0fb901c0"
  },
  {
    "url": "tools/browsers.html",
    "revision": "bfead85b1c41c1279e9ee7390ce67cc5"
  },
  {
    "url": "tools/cli.html",
    "revision": "0165d2c8beb8b369eddb2f5276f2ef0d"
  },
  {
    "url": "tools/documentation.html",
    "revision": "71dc1f44067962d037c76617a5a7f6b3"
  },
  {
    "url": "tools/index.html",
    "revision": "af2d8f313ae1bd5a7cb886d3e3b3013a"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "ec71c1ef582dfbcbdb7ff192ec91fcf2"
  }
].concat(self.__precacheManifest || []);
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
